from pathlib import Path

import pandas as pd
from kink import inject

from models.source_document import SourceType
from utils.data_reader.readers.i_data_reader import (
    IDataReader,
)


@inject(alias=IDataReader)
class CSVDataReader(IDataReader):

    def __init__(self):
        super().__init__(SourceType.CSV)

    def read(self, path: Path, count: int) -> bytes:
        self.logger.info(f"Reading data from {path}")
        df = pd.read_csv(path)
        self.logger.info(f"Returning {count} rows")
        return df.head(count).to_csv(index=False).encode()
