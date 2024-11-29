from dataclasses import dataclass


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
        return {
            "uuid": self.uuid,
            "name": self.name,
            "stem": self.stem,
            "suffix": self.suffix,
            "hash": self.hash,
        }
