from abc import ABC, abstractmethod

from server.models.mapping import MappingGraph


class MappingServiceProtocol(ABC):
    @abstractmethod
    def get_mapping(self, mapping_id: str) -> MappingGraph:
        """
        Get a mapping by ID

        Args:
            mapping_id (str): ID of the mapping

        Returns:
            MappingGraph: Mapping
        """
        pass

    @abstractmethod
    def create_mapping(self, graph: MappingGraph) -> str:
        """
        Create a new mapping

        Args:
            graph (MappingGraph): Mapping

        Returns:
            str: ID of the mapping
        """
        pass

    @abstractmethod
    def update_mapping(
        self, mapping_id: str, graph: MappingGraph
    ) -> None:
        """
        Update a mapping

        Args:
            mapping_id (str): ID of the mapping
            graph (MappingGraph): Mapping

        Returns:
            None
        """
        pass

    @abstractmethod
    def delete_mapping(self, mapping_id: str) -> None:
        """
        Delete a mapping

        Args:
            mapping_id (str): ID of the mapping

        Returns:
            None
        """
        pass
