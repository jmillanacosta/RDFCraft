from enum import Enum
from typing import Union
from beanie import Document, Link
from pydantic import BaseModel
from models.source_document import SourceDocument


class NodeNoteModel(BaseModel):
    """
    Add note to node
    """

    id: str
    note: str


class PositionModel(BaseModel):
    x: float
    y: float


class NodeType(str, Enum):
    OBJECT = "object"
    LITERAL = "literal"
    URIREF = "uriref"


class ObjectNodeDataModel(BaseModel):
    label: str = ""
    rdf_type: str
    is_blank_node: bool = False
    pattern_prefix: str
    pattern: str


class LiteralNodeDataModel(BaseModel):
    rdf_type: str
    pattern: str


class UriRefNodeDataModel(BaseModel):
    label: str = ""
    pattern_prefix: str
    pattern: str


class NodeModel(BaseModel):
    id: str
    type: NodeType
    position: PositionModel
    width: int
    height: int
    data: Union[
        ObjectNodeDataModel,
        LiteralNodeDataModel,
        UriRefNodeDataModel,
    ]


class EdgeType(str, Enum):
    DATA_PROPERTY = "data_property"
    OBJECT_PROPERTY = "object_property"


class EdgeDataModel(BaseModel):
    label: str
    full_uri: str
    predicate_type: EdgeType


class EdgeModel(BaseModel):
    id: str
    source: str
    target: str
    data: EdgeDataModel


class ObjectNodeModel(BaseModel):
    id: str
    type: str
    position: dict


class MappingModel(Document):
    nodes: list[NodeModel] = []
    edges: list[EdgeModel] = []


class MappingDocument(Document):
    name: str
    source: Link[SourceDocument]
    mappings: list[Link[MappingModel]]
    current_mapping: Link[
        MappingModel
    ]  # Use this to sync between clients/ Should point to last mapping
    notes: list[NodeNoteModel] = []


__all__ = [
    "MappingDocument",
    "NodeNoteModel",
    "PositionModel",
    "NodeType",
    "ObjectNodeDataModel",
    "LiteralNodeDataModel",
    "UriRefNodeDataModel",
    "NodeModel",
    "EdgeType",
    "EdgeDataModel",
    "EdgeModel",
    "ObjectNodeModel",
    "MappingModel",
]
