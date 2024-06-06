import logging
from pathlib import Path

from kink import inject

from models.source_document import SourceType
from utils.data_reader.readers import IDataReader


@inject
class DataReader:
    def __init__(self, readers: list[IDataReader]):
        self.logger = logging.getLogger(__name__)
        self.readers = {
            reader.data_type: reader for reader in readers
        }

    async def read_data(
        self,
        file_path: Path,
        data_type: SourceType,
        count: int,
    ) -> bytes:
        self.logger.info(f"Reading data from {file_path}")
        reader = self.readers.get(data_type, None)
        if reader is None:
            raise ValueError(
                f"Reader for {data_type} not found"
            )

        return reader.read(file_path, count)
