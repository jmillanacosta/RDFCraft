import logging

from beanie import DeleteRules
from fastapi import HTTPException
from kink import inject

from models.mapping_document import (
    EdgeModel,
    MappingDocument,
    MappingModel,
    NodeModel,
)
from services.source_service import SourceService


@inject
class MappingService:
    def __init__(self, source_service: SourceService):
        self.logger = logging.getLogger(__name__)
        self.source_service = source_service

    async def create_mapping(
        self,
        name: str,
        description: str,
        file_name: str,
        file_extension: str,
        json_path: str,
        bytes: bytes,
    ) -> MappingDocument:
        self.logger.info(
            f"Creating mapping for source with name {file_name} and extension {file_extension}"
        )

        # Create source
        source = await self.source_service.create_source(
            name,
            description,
            file_name,
            file_extension,
            bytes,
        )

        mapping = MappingModel()

        mapping = await MappingModel.insert_one(mapping)

        mapping_document = MappingDocument(
            name=name,
            source=source,  # type: ignore
            mappings=[mapping],  # type: ignore
            current_mapping=mapping,  # type: ignore
            json_path=json_path,
        )

        await MappingDocument.insert(mapping_document)

        return mapping_document

    async def get_mapping(
        self, mapping_id: str
    ) -> MappingDocument:
        document = await MappingDocument.get(
            mapping_id, fetch_links=True
        )
        if document is None:
            raise HTTPException(
                detail="Mapping not found",
                status_code=404,
            )

        return document

    async def revert_mapping(
        self, mapping_id: str, mapping_model_id: str
    ) -> MappingDocument:
        document = await MappingDocument.get(
            mapping_id, fetch_links=True
        )
        if document is None:
            raise HTTPException(
                detail="Mapping not found",
                status_code=404,
            )
        try:
            index = document.mappings.index(
                lambda x: x.id == mapping_model_id  # type: ignore
            )
            # Delete all mappings after the index
            document.current_mapping = document.mappings[index]  # type: ignore
            document.mappings = document.mappings[:index]  # type: ignore
        except ValueError:
            raise HTTPException(
                detail="Mapping model not found",
                status_code=404,
            )

        await document.save()  # type: ignore
        return document

    async def save_mapping(
        self,
        mapping_id: str,
        node_data: list[NodeModel],
        edge_data: list[EdgeModel],
    ) -> MappingDocument:
        document = await MappingDocument.get(
            mapping_id, fetch_links=True
        )
        if document is None:
            raise HTTPException(
                detail="Mapping not found",
                status_code=404,
            )

        data = {
            "nodes": node_data,
            "edges": edge_data,
        }

        mapping_model = MappingModel(**data)  # type: ignore

        mapping_model = await MappingModel.insert_one(
            mapping_model
        )

        if mapping_model is None:
            raise HTTPException(
                detail="Error creating mapping model",
                status_code=500,
            )

        document.mappings.append(mapping_model)  # type: ignore

        if len(document.mappings) > 50:
            document.mappings.pop(0)

        document.current_mapping = mapping_model  # type: ignore

        await document.save()  # type: ignore

        return document

    async def delete_mapping(
        self, mapping_id: str
    ) -> MappingDocument:
        document = await MappingDocument.get(
            mapping_id, fetch_links=True
        )
        if document is None:
            raise HTTPException(
                detail="Mapping not found",
                status_code=404,
            )
        await self.source_service.remove_source(
            document.source.id  #  type: ignore
        )
        for mapping in document.mappings:
            await MappingModel.delete(mapping)
        await document.delete(
            link_rule=DeleteRules.DELETE_LINKS
        )  # type: ignore
        return document
