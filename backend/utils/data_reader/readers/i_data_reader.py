import logging
from abc import ABC, abstractmethod
from pathlib import Path

from models.source_document import SourceType


class IDataReader(ABC):

    def __init__(self, data_type: SourceType):
        self.logger = logging.getLogger(__name__)
        self.data_type = data_type
        pass

    @abstractmethod
    def read(self, path: Path, count: int) -> bytes:
        pass
