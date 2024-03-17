from enum import Enum
from beanie import Document, Link
from pydantic import BaseModel
from models.file_document import FileDocument


class SourceType(str, Enum):
    CSV = "csv"
    JSON = "json"


class SourceDocument(Document):
    name: str
    description: str
    source_type: SourceType
    file: Link[FileDocument]
    refs: list[
        str
    ]  # Column/Attribute references in this source


__all__ = ["SourceDocument", "SourceType"]
