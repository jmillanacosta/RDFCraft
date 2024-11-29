from dataclasses import dataclass

from server.services.core.sqlite_db_service import (
    FileMetadataTable,
)


@dataclass
class FileMetadata:
    """
    Model for file metadata

    Attributes:
        uuid (str): UUID of the file
        name (str): name of the file with extension
        stem (str): name of the file without extension
        suffix (str): extension of the file
        hash (str): hash of the file
    """

    uuid: str
    name: str
    stem: str
    suffix: str
    hash: str

    def to_table(self):
        """
        Convert to table representation

        Returns:
            dict: Table representation
        """
        return FileMetadataTable(
            uuid=self.uuid,
            name=self.name,
            stem=self.stem,
            suffix=self.suffix,
            hash=self.hash,
        )

    @classmethod
    def from_table(cls, table: FileMetadataTable):
        """
        Convert from table representation

        Args:
            table (dict): Table representation

        Returns:
            FileMetadata: File metadata
        """
        return cls(
            uuid=table.uuid,
            name=table.name,
            stem=table.stem,
            suffix=table.suffix,
            hash=table.hash,
        )
