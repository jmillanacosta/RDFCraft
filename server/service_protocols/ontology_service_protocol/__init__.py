from typing import Protocol

from server.models.file_metadata import (
    FileMetadata,
)
from server.models.ontology import (
    Ontology,
)


class OntologyServiceProtocol(Protocol):
    """
    Ontology service protocol
    """

    def get_ontology(self, ontology_id: str) -> Ontology:
        """
        Get ontology by id

        Parameters:
            ontology_id (str): Ontology id
        """
        ...

    def get_ontologies(
        self, ids: list[str]
    ) -> list[Ontology]:
        """
        Get a list of ontologies by ids

        Parameters:
            ids (list[str]): List of ontology ids
        """
        ...

    def create_ontology(
        self, name: str, file_metadata: FileMetadata
    ) -> Ontology:
        """
        Create an ontology

        Parameters:
            name (str): Ontology name
            file_metadata (FileMetadata): Ontology file metadata
        """
        ...

    def update_ontology(
        self,
        ontology_id: str,
        name: str,
        file_metadata: FileMetadata,
    ) -> Ontology:
        """
        Update an ontology

        Parameters:
            ontology_id (str): Ontology id
            name (str): Ontology name
            file_metadata (FileMetadata): Ontology file metadata
        """
        ...

    def delete_ontology(self, ontology_id: str) -> None:
        """
        Delete an ontology

        Parameters:
            ontology_id (str): Ont
        """
        ...
