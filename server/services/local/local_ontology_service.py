import json
import logging
from uuid import uuid4

from kink import inject
from pkg_resources import FileMetadata
from sqlalchemy import select

from server.exceptions import ErrCodes, ServerException
from server.models.ontology import Ontology
from server.service_protocols.fs_service_protocol import (
    FSServiceProtocol,
)
from server.services.core.sqlite_db_service import (
    DBService,
    OntologyTable,
)
from server.services.local.local_fs_service import (
    LocalFSService,
)
from server.utils.ontology_indexer import OntologyIndexer
from server.utils.rdf_loader import RDFLoader


@inject
class LocalOntologyService:
    def __init__(
        self,
        fs_service: LocalFSService,
        ontology_indexer: OntologyIndexer,
        db_service: DBService,
    ):
        self.logger = logging.getLogger(__name__)
        self.ontology_indexer: OntologyIndexer = (
            ontology_indexer
        )
        self.fs_service: FSServiceProtocol = fs_service
        self.db_service: DBService = db_service

    def _get_from_ontology_table(
        self, ontology_id: str
    ) -> OntologyTable | None:
        query = (
            select(OntologyTable)
            .where(OntologyTable.uuid == ontology_id)
            .limit(1)
        )

        with self.db_service.get_session() as session:
            result = session.execute(query).first()
            if not result:
                return None

            return result[0]

    def get_ontology(self, ontology_id: str) -> Ontology:
        """
        Get ontology by id

        Parameters:
            ontology_id (str): Ontology id

        Returns:
            Ontology: Ontology
        """

        self.logger.info(
            f"Getting ontology with id: {ontology_id}"
        )
        ontology_table = self._get_from_ontology_table(
            ontology_id
        )

        if not ontology_table:
            raise ServerException(
                "Ontology not found",
                ErrCodes.ONTOLOGY_NOT_FOUND,
            )

        file_bytes = (
            self.fs_service.download_file_with_uuid(
                ontology_table.json_file_uuid
            )
        )

        data = json.loads(file_bytes.decode("utf-8"))

        return Ontology.from_dict(data)

    def get_ontologies(
        self, ids: list[str]
    ) -> list[Ontology]:
        """
        Get a list of ontologies by ids

        Parameters:
            ids (list[str]): List of ontology ids

        Returns:
            list[Ontology]: List of ontologies
        """

        self.logger.info(
            f"Getting ontologies with ids: {ids}"
        )
        query = select(OntologyTable).where(
            OntologyTable.uuid.in_(ids)
        )

        ontologies = []

        with self.db_service.get_session() as session:
            result = session.execute(query).all()

            for ontology_table in result:
                file_bytes = (
                    self.fs_service.download_file_with_uuid(
                        ontology_table.json_file_uuid
                    )
                )

                data = json.loads(
                    file_bytes.decode("utf-8")
                )
                ontologies.append(Ontology.from_dict(data))

        return ontologies

    def create_ontology(
        self, name: str, base_uri: str, content: bytes
    ) -> Ontology:
        self.logger.info(f"Creating ontology: {name}")
        self.logger.info("Parsing ontology content")
        g = RDFLoader.load_rdf_bytes(content)
        self.logger.info(f"Indexing ontology: {name}")

        all_classes = self.ontology_indexer.get_classes(
            base_uri, g
        )

        all_properties = (
            self.ontology_indexer.get_properties(
                base_uri, g
            )
        )

        all_individuals = (
            self.ontology_indexer.get_individuals(
                base_uri, g
            )
        )

        self.logger.info("Indexing complete")
        self.logger.info("Uploading ontology file")
        file_metadata = self.fs_service.upload_file(
            name, content
        )
        self.logger.info("File uploaded")

        ontology = Ontology(
            uuid=uuid4().hex,
            file_uuid=file_metadata.uuid,
            name=name,
            classes=all_classes,
            individuals=all_individuals,
            properties=all_properties,
        )

        self.logger.info("Saving ontology to filesystem")

        json_data = ontology.to_dict()

        ontology_json_file = self.fs_service.upload_file(
            f"{name}.json",
            json.dumps(json_data).encode("utf-8"),
        )
        self.logger.info("Ontology saved to filesystem")

        with self.db_service.get_session() as session:
            session.add(
                OntologyTable(
                    uuid=ontology.uuid,
                    name=ontology.name,
                    json_file_uuid=ontology_json_file.uuid,
                    ontology_file_uuid=file_metadata.uuid,
                )
            )
            session.commit()

        return ontology

    def update_ontology(
        self,
        ontology_id: str,
        name: str,
        file_metadata: FileMetadata,
    ) -> Ontology:
        raise ServerException(
            "Not implemented", ErrCodes.NOT_IMPLEMENTED
        )

    def delete_ontology(self, ontology_id: str):
        self.logger.info(
            f"Deleting ontology with id: {ontology_id}"
        )

        ontology_table = self._get_from_ontology_table(
            ontology_id
        )

        if not ontology_table:
            raise ServerException(
                "Ontology not found",
                ErrCodes.ONTOLOGY_NOT_FOUND,
            )

        self.fs_service.delete_file_with_uuid(
            ontology_table.json_file_uuid
        )
        self.fs_service.delete_file_with_uuid(
            ontology_table.ontology_file_uuid
        )

        with self.db_service.get_session() as session:
            session.delete(ontology_table)
            session.commit()

        self.logger.info(
            f"Ontology with id: {ontology_id} deleted"
        )

        return None
