from beanie import Document, Link
from pydantic import BaseModel
from models.source_document import SourceDocument


class NodeNoteModel(BaseModel):
    """
    Add note to node
    """

    id: str
    note: str


class RawMapping(BaseModel):
    version: int
    raw_mapping: dict


class MappingDocument(Document):
    name: str
    source: Link[SourceDocument]
    raw_mappings: list[
        RawMapping
    ]  # Raw mapping data from ReactFlow
    notes: list[NodeNoteModel] = []

    class Settings:
        use_revision = True


__all__ = [
    "MappingDocument",
    "NodeNoteModel",
]
