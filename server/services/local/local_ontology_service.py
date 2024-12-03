import json
import logging

from kink import inject
from sqlalchemy import select

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


@inject
class LocalOntologyService:
    def __init__(
        self,
        fs_service: LocalFSService,
        db_service: DBService,
    ):
        self.logger = logging.getLogger(__name__)
        self.fs_service: FSServiceProtocol = fs_service
        self.db_service: DBService = db_service

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
        query = (
            select(OntologyTable)
            .where(OntologyTable.uuid == ontology_id)
            .limit(1)
        )

        ontology_table: OntologyTable | None = None

        with self.db_service.get_session() as session:
            result = session.execute(query).first()
            if not result:
                raise ValueError(
                    f"Ontology with id {ontology_id} not found"
                )

            ontology_table = result[0]

        if not ontology_table:
            raise ValueError(
                f"Ontology with id {ontology_id} not found"
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
        self, name: str, content: bytes
    ) -> Ontology: ...
