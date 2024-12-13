import json
from io import BytesIO

from kink import inject

from server.utils.schema_extractor.i_schema_extractor import (
    ISchemaExtractor,
)


@inject(alias=ISchemaExtractor)
class JSONSchemaExtractor(ISchemaExtractor):
    def __init__(
        self,
        TEMP_DIR: str,
    ):
        super().__init__("JSON Schema Extractor", ["json"])

    def read_file(self, file: bytes) -> list[dict]:
        with BytesIO(file) as f:
            data = json.load(f)

            if isinstance(data, dict):
                raise ValueError(
                    "The root path you provided does not return an array of"
                    " objects"
                )

            return data

    def getPaths(self, obj, parent="") -> set:
        result = set()
        if isinstance(obj, dict):
            for key, value in obj.items():
                result.update(
                    self.getPaths(
                        value, parent + "." + str(key)
                    )
                )
        elif isinstance(obj, list):
            for i, value in enumerate(obj):
                result.update(
                    self.getPaths(
                        value, parent + "[" + str(i) + "]"
                    )
                )
        else:
            result.add(parent)
        return result

    def extract_schema(
        self,
        file: bytes,
        file_extension: str,
        name_prefix: str,
    ):
        data = self.read_file(file)

        sets = [self.getPaths(obj, "") for obj in data]

        return list(
            map(
                lambda x: "{}{}".format(name_prefix, x[1:]),
                set.union(*sets),
            )
        )
