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
