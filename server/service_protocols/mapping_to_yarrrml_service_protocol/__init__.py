from abc import ABC, abstractmethod

from server.models.mapping import MappingGraph
from server.models.source import Source
from server.service_protocols.fs_service_protocol import (
    FSServiceProtocol,
)


class MappingToYARRRMLServiceProtocol(ABC):
    @abstractmethod
    def convert_mapping_to_yarrrml(
        self,
        prefixes: dict[str, str],
        source: Source,
        mapping: MappingGraph,
        fs_service: FSServiceProtocol,
    ) -> str:
        """
        Convert a mapping to YARRRML

        Args:
            prefixes (dict): A dictionary of prefixes
            source (Source): Source data of the mapping
            mapping (MappingGraph): Mapping data

        Returns:
            str: Valid Yaml string representing the YARRRML mapping
        """
        pass
