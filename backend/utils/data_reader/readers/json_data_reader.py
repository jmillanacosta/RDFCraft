import json
from pathlib import Path

from kink import inject

from models.source_document import SourceType
from utils.data_reader.readers.i_data_reader import (
    IDataReader,
)


@inject(alias=IDataReader)
class JSONDataReader(IDataReader):

    def __init__(self):
        super().__init__(SourceType.JSON)

    def read(self, path: Path, count: int) -> bytes:
        self.logger.info(f"Reading data from {path}")
        with open(path, "rb") as f:
            data = json.load(f)

        self.logger.info(f"Returning {count} rows")
        return json.dumps(data[:count]).encode()
