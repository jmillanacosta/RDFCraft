from pathlib import Path
from beanie import BackLink, Document


class FileDocument(Document):
    name: str
    byte_size: int
    extension: str | None
    md5: str
    path: Path


__all__ = ["FileDocument"]
