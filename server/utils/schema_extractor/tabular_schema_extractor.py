from io import BytesIO
from kink import inject

import pandas as pd

from utils.schema_extractor.i_schema_extractor import (
    ISchemaExtractor,
)


@inject(alias=ISchemaExtractor)
class TabularSchemaExtractor(ISchemaExtractor):
    def __init__(
        self,
        temp_storage: str,
    ):
        super().__init__(
            "Tabular Schema Extractor",
            [
                "csv",
                "tsv",
                "xls",
                "xlsx",
            ],
        )

    def read_file(
        self, file: bytes, file_extension: str
    ) -> pd.DataFrame:
        if file_extension == "csv":
            return pd.read_csv(
                BytesIO(file),
            )

        if file_extension == "tsv":
            return pd.read_csv(
                BytesIO(file),
                sep="\t",
            )

        if (
            file_extension == "xls"
            or file_extension == "xlsx"
        ):
            df = pd.read_excel(
                BytesIO(file),
            )

            if len(df.sheet_names) > 1:
                raise ValueError(
                    "Multiple sheets are not supported yet"
                )

            return df

        raise KeyError("File extension not supported")

    def extract_schema(
        self,
        file: bytes,
        file_extension: str,
        name_prefix: str,
    ):
        df = self.read_file(file, file_extension)

        return [
            "{}{}".format(name_prefix, column_name)
            for column_name in df.columns
        ]
