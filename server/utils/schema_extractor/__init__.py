from kink import inject

from utils.schema_extractor.i_schema_extractor import (
    ISchemaExtractor,
)
from utils.schema_extractor.json_schema_extractor import (
    JSONSchemaExtractor,  # noqa: F401
)
from utils.schema_extractor.tabular_schema_extractor import (
    TabularSchemaExtractor,  # noqa: F401
)


@inject
class SchemaExtractor:
    def __init__(
        self, schema_extractors: list[ISchemaExtractor]
    ) -> None:
        self.type_mapping: dict[str, ISchemaExtractor] = {}
        for schema_extractor in schema_extractors:
            for file_type in schema_extractor.file_types:
                if file_type in self.type_mapping:
                    raise KeyError(
                        f"File type {file_type} is already registered to"
                        f" {self.type_mapping[file_type].name} / Can't register"
                        f" to {schema_extractor.name} as well"
                    )
                self.type_mapping[file_type] = (
                    schema_extractor
                )

    def extract_schema(
        self,
        file: bytes,
        file_extension: str,
    ):
        if file_extension not in self.type_mapping:
            raise KeyError(
                f"File type {file_extension} is not registered to any schema"
                " extractor"
            )

        return self.type_mapping[
            file_extension
        ].extract_schema(file, file_extension, "")
