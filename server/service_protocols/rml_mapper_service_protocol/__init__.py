from abc import ABC, abstractmethod


class RMLMapperServiceProtocol(ABC):
    @abstractmethod
    def execute_rml_mapping(self, mapping: str) -> str:
        """
        Execute an RML mapping

        Args:
            mapping (str): RML mapping

        Returns:
            str: Result of the mapping
        """
