from abc import ABC, abstractmethod


class ISchemaExtractor(ABC):
    def __init__(
        self,
        name: str,
        file_types: list[str],
    ):
        self.name = name
        self.file_types = file_types

    @abstractmethod
    def extract_schema(
        self,
        file: bytes,
        file_extension: str,
        name_prefix: str,
    ) -> list[str]:
        pass
