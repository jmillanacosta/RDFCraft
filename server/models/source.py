from dataclasses import dataclass
from enum import StrEnum


class SourceType(StrEnum):
    """
    Enumeration of the types of sources.
    """

    CSV = "csv"
    JSON = "json"


@dataclass
class Source:
    """
    Data class representing a source.

    Attributes:
    - type: SourceType
        The type of the source.
    - references: list[str]
        The list of references that the source has. These references used for assisting user during the mapping process.
        For example, if the source is a CSV file, the references can be the column names
    - file_uuid: str
        The UUID of the file. Depending on the type, this can point to a file or connection args to a database.
    - extra: dict
        Extra information that can be used for the source
    """

    uuid: str
    type: SourceType
    references: list[str]
    file_uuid: str
    extra: dict

    def to_dict(self) -> dict:
        """
        Convert the object to a dictionary.

        Returns:
            dict: Dictionary representation of the object
        """
        return {
            "uuid": self.uuid,
            "type": self.type,
            "references": self.references,
            "file_uuid": self.file_uuid,
            "extra": self.extra if self.extra else {},
        }

    @staticmethod
    def from_dict(data: dict) -> "Source":
        """
        Create a Source object from a dictionary.

        Args:
            data (dict): Dictionary containing the data

        Returns:
            Source: Source object
        """

        if "uuid" not in data:
            raise ValueError("Missing 'uuid' in data")

        if "type" not in data:
            raise ValueError("Missing 'type' in data")
        if "references" not in data:
            raise ValueError("Missing 'references' in data")
        if "file_uuid" not in data:
            raise ValueError("Missing 'file_uuid' in data")

        return Source(
            uuid=data["uuid"],
            type=SourceType(data["type"]),
            references=data["references"],
            file_uuid=data["file_uuid"],
            extra=data.get("extra", {}),
        )
