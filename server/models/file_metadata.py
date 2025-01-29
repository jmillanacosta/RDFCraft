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

    @classmethod
    def from_dict(cls, data):
        """
        Convert from dict representation

        Args:
            data (dict): Dict representation

        Returns:
            FileMetadata: File metadata
        """
        if "uuid" not in data:
            raise ValueError("uuid is required")
        if "name" not in data:
            raise ValueError("name is required")
        if "stem" not in data:
            raise ValueError("stem is required")
        if "suffix" not in data:
            raise ValueError("suffix is required")
        if "hash" not in data:
            raise ValueError("hash is required")
        return cls(
            uuid=data["uuid"],
            name=data["name"],
            stem=data["stem"],
            suffix=data["suffix"],
            hash=data["hash"],
        )

    def to_dict(self):
        """
        Convert to dict representation
        """
        return {
            "uuid": self.uuid,
            "name": self.name,
            "stem": self.stem,
            "suffix": self.suffix,
            "hash": self.hash,
        }
