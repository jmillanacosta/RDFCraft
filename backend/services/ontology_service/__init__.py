import logging
from typing import List
from beanie import PydanticObjectId
from fastapi import HTTPException
from kink import inject

from models.file_document import FileDocument
from models.ontology_document import (
    OntologyClassDocument,
    OntologyDocument,
    OntologyIndividualModel,
    OntologyPropertyDocument,
)
from services.file_service import FileService
from services.prefix_service import PrefixService
from utils.ontology_indexer import OntologyIndexer


@inject
class OntologyService:
    def __init__(
        self,
        file_service: FileService,
        prefix_service: PrefixService,
    ):
        self.logger = logging.getLogger(__name__)
        self.file_service = file_service
        self.prefix_service = prefix_service

    async def upload_ontology(
        self,
        file_name: str,
        file_extension: str,
        bytes: bytes,
        name: str,
        description: str,
        prefix_id: str,
    )-> OntologyDocument:
        # Check if prefix exists, raises 404 if not
        prefix = await self.prefix_service.get_prefix_by_id(
            prefix_id
        )

        # Create file, raises 500 if not created
        file = await self.file_service.create_file(
            file_name, file_extension, bytes
        )
        # Create ontology with out indexes
        ontology = OntologyDocument(
            name=name,
            description=description,
            file=file,  # type: ignore
            prefix=prefix,  # type: ignore
        )

        ontology: OntologyDocument | None = (
            await OntologyDocument.insert(ontology)
        )

        if ontology is None:
            raise HTTPException(
                status_code=500,
                detail="Failed to create ontology",
            )

        # Create Indexes for ontology
        self.logger.info(f"Indexing ontology {ontology.id}")
        indexer = OntologyIndexer(
            rdf_path=file.path, ontology_id=str(ontology.id)
        )

        ontology_classes = indexer.extract_classes()
        ontology_data_properties = (
            indexer.extract_data_properties()
        )
        ontology_object_properties = (
            indexer.extract_object_properties()
        )
        ontology_individuals = indexer.extract_individuals()

        self.logger.info("Saving indexes to database")

        if len(ontology_classes) != 0:
            result_1 = (
                await OntologyClassDocument.insert_many(
                    ontology_classes
                )
            )
            if len(result_1.inserted_ids) != len(
                ontology_classes
            ):
                self.logger.error(
                    "Failed to save ontology, reverting changes"
                )
                await self._revert_ontology_creation(
                    ontology.id, file.id  # type: ignore
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to save ontology classes",
                )

        if len(ontology_data_properties) != 0:
            result_2 = (
                await OntologyPropertyDocument.insert_many(
                    ontology_data_properties
                )
            )
            if len(result_2.inserted_ids) != len(
                ontology_data_properties
            ):
                self.logger.error(
                    "Failed to save ontology, reverting changes"
                )
                await self._revert_ontology_creation(
                    ontology.id, file.id  # type: ignore
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to save ontology data properties",
                )
        if len(ontology_object_properties) != 0:
            result_3 = (
                await OntologyPropertyDocument.insert_many(
                    ontology_object_properties
                )
            )
            if len(result_3.inserted_ids) != len(
                ontology_object_properties
            ):
                self.logger.error(
                    "Failed to save ontology, reverting changes"
                )
                await self._revert_ontology_creation(
                    ontology.id, file.id  # type: ignore
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to save ontology object properties",
                )
        if len(ontology_individuals) != 0:
            result_4 = (
                await OntologyIndividualModel.insert_many(
                    ontology_individuals
                )
            )
            if len(result_4.inserted_ids) != len(
                ontology_individuals
            ):
                self.logger.error(
                    "Failed to save ontology, reverting changes"
                )
                await self._revert_ontology_creation(
                    ontology.id, file.id  # type: ignore
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to save ontology individuals",
                )

        self.logger.info(
            f"Indexed {len(ontology_classes)} classes, "
            f"{len(ontology_data_properties)} data properties, "
            f"{len(ontology_object_properties)} object properties, "
            f"{len(ontology_individuals)} individuals"
        )
        self.logger.info(f"Ontology {ontology.id} created")

        return ontology

    async def update_prefix(
        self, ontology_id: str, prefix_id: str
    ) -> OntologyDocument:
        ontology = await OntologyDocument.get(ontology_id)
        if ontology is None:
            raise HTTPException(
                status_code=404, detail="Ontology not found"
            )
        prefix = await self.prefix_service.get_prefix_by_id(
            prefix_id
        )
        if prefix is None:
            raise HTTPException(
                status_code=404, detail="Prefix not found"
            )
        ontology.prefix = prefix  # type: ignore
        await OntologyDocument.replace(ontology)
        return ontology

    async def get_ontology_by_id(self, ontology_id: str):
        ontology = await OntologyDocument.find_one(
            OntologyDocument.id == ontology_id,
            fetch_links=True,
        )
        if ontology is None:
            raise HTTPException(
                status_code=404, detail="Ontology not found"
            )
        return ontology

    async def get_ontology_classes(self, ontology_id: str) -> List[OntologyClassDocument]:
        classes = await OntologyClassDocument.find(
            OntologyClassDocument.ontology_id == ontology_id
        ).to_list()
        return classes

    async def get_ontology_properties(
        self, ontology_id: str
    ) -> List[OntologyPropertyDocument]:
        properties = await OntologyPropertyDocument.find(
            OntologyPropertyDocument.ontology_id
            == ontology_id
        ).to_list()
        return properties

    async def get_ontology_individuals(
        self, ontology_id: str
    ) -> List[OntologyIndividualModel]:
        individuals = await OntologyIndividualModel.find(
            OntologyIndividualModel.ontology_id
            == ontology_id
        ).to_list()
        return individuals

    async def delete_ontology(self, ontology_id: str) -> OntologyDocument:
        ontology = await OntologyDocument.get(
            ontology_id, fetch_links=True
        )
        if ontology is None:
            raise HTTPException(
                status_code=404, detail="Ontology not found"
            )
        await OntologyPropertyDocument.find_many(
            OntologyPropertyDocument.ontology_id
            == PydanticObjectId(ontology_id)
        ).delete()
        await OntologyClassDocument.find_many(
            OntologyClassDocument.ontology_id
            == PydanticObjectId(ontology_id)
        ).delete()
        await OntologyIndividualModel.find_many(
            OntologyIndividualModel.ontology_id
            == PydanticObjectId(ontology_id)
        ).delete()

        await OntologyDocument.delete(ontology)
        await self.file_service.delete_file(
            str(ontology.file.id)  # type: ignore
        )
        return ontology

    async def _revert_ontology_creation(
        self,
        ontology_id: PydanticObjectId,
        file_id: PydanticObjectId,
    ):
        await OntologyPropertyDocument.delete(
            OntologyPropertyDocument.ontology_id
            == ontology_id
        )
        await OntologyClassDocument.delete(
            OntologyClassDocument.ontology_id == ontology_id
        )
        await OntologyIndividualModel.delete(
            OntologyIndividualModel.ontology_id
            == ontology_id
        )
        await OntologyDocument.delete(ontology_id)
        await self.file_service.delete_file(str(file_id))
        return
