from dataclasses import dataclass
from enum import StrEnum


class MappingNodeType(StrEnum):
    ENTITY = "entity"
    LITERAL = "literal"
    URIRef = "uri_ref"


@dataclass(kw_only=True)
class Position:
    """
    A position in a mapping graph.

    Attributes:
        x (int): The x-coordinate of the position
        y (int): The y-coordinate of the position
    """

    x: int
    y: int

    def to_dict(self):
        return {
            "x": self.x,
            "y": self.y,
        }

    @classmethod
    def from_dict(cls, data):
        if "x" not in data:
            raise ValueError("x is required")
        if "y" not in data:
            raise ValueError("y is required")
        return cls(
            x=data["x"],
            y=data["y"],
        )


@dataclass(kw_only=True)
class MappingNode:
    """
    A node in a mapping graph.

    Attributes:
        id (str): The ID of the node
        type (MappingNodeType): The type of the node
        label (str): The label of the node
        uri_pattern (str): The URI pattern of the node
        rdf_type (list[str]): The RDF type/s of the node
        properties (list[str]): The properties of the node
        position (Position): The position of the node
    """

    id: str
    type: MappingNodeType
    label: str
    uri_pattern: str
    rdf_type: list[str]
    properties: list[str]
    position: Position

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "label": self.label,
            "uri_pattern": self.uri_pattern,
            "rdf_type": self.rdf_type,
            "properties": self.properties,
            "position": self.position.to_dict(),
        }

    @classmethod
    def from_dict(cls, data):
        if "id" not in data:
            raise ValueError("id is required")
        if "type" not in data:
            raise ValueError("type is required")
        if "label" not in data:
            raise ValueError("label is required")
        if "uri_pattern" not in data:
            raise ValueError("uri_pattern is required")
        if "position" not in data:
            raise ValueError("position is required")
        if "rdf_type" not in data:
            data["rdf_type"] = []
        if "properties" not in data:
            data["properties"] = []
        return cls(
            id=data["id"],
            type=data["type"],
            label=data["label"],
            uri_pattern=data["uri_pattern"],
            rdf_type=data["rdf_type"],
            properties=data["properties"],
            position=Position.from_dict(data["position"]),
        )


@dataclass(kw_only=True)
class MappingLiteral:
    """
    A literal in a mapping graph.

    Attributes:
        id (str): The ID of the literal
        type (MappingNodeType): The type of the literal
        label (str): The label of the literal
        value (str): The value of the literal
        literal_type (str): The type of the literal
        position (Position): The position of the literal
    """

    id: str
    type: MappingNodeType
    label: str
    value: str
    literal_type: str
    position: Position

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "label": self.label,
            "value": self.value,
            "literal_type": self.literal_type,
            "position": self.position.to_dict(),
        }

    @classmethod
    def from_dict(cls, data):
        if "id" not in data:
            raise ValueError("id is required")
        if "type" not in data:
            raise ValueError("type is required")
        if "label" not in data:
            raise ValueError("label is required")
        if "value" not in data:
            raise ValueError("value is required")
        if "literal_type" not in data:
            raise ValueError("literal_type is required")
        if "position" not in data:
            raise ValueError("position is required")
        return cls(
            id=data["id"],
            type=data["type"],
            label=data["label"],
            value=data["value"],
            literal_type=data["literal_type"],
            position=Position.from_dict(data["position"]),
        )


@dataclass(kw_only=True)
class MappingURIRef:
    """
    A URI reference in a mapping graph.

    Attributes:
        id (str): The ID of the URI reference
        type (MappingNodeType): The type of the URI reference
        uri_pattern (str): The URI pattern of the URI reference
        position (Position): The position of the URI reference
    """

    id: str
    type: MappingNodeType
    uri_pattern: str
    position: Position

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "uri_pattern": self.uri_pattern,
            "position": self.position.to_dict(),
        }

    @classmethod
    def from_dict(cls, data):
        if "id" not in data:
            raise ValueError("id is required")
        if "type" not in data:
            raise ValueError("type is required")
        if "uri_pattern" not in data:
            raise ValueError("uri_pattern is required")
        if "position" not in data:
            raise ValueError("position is required")
        return cls(
            id=data["id"],
            type=data["type"],
            uri_pattern=data["uri_pattern"],
            position=Position.from_dict(data["position"]),
        )


@dataclass(kw_only=True)
class MappingEdge:
    """
    An edge in a mapping graph.

    Attributes:
        id (str): The ID of the edge
        source (str): The ID of the source node
        target (str): The ID of the target node
        source_handle (str): The handle of the source node
        target_handle (str): The handle of the target node
    """

    id: str
    source: str
    target: str
    source_handle: str
    target_handle: str

    def to_dict(self):
        return {
            "id": self.id,
            "source": self.source,
            "target": self.target,
            "source_handle": self.source_handle,
            "target_handle": self.target_handle,
        }

    @classmethod
    def from_dict(cls, data):
        if "id" not in data:
            raise ValueError("id is required")
        if "source" not in data:
            raise ValueError("source is required")
        if "target" not in data:
            raise ValueError("target is required")
        if "predicate_uri" not in data:
            raise ValueError("predicate_uri is required")
        if "source_handle" not in data:
            raise ValueError("source_handle is required")
        if "target_handle" not in data:
            raise ValueError("target_handle is required")
        return cls(
            id=data["id"],
            source=data["source"],
            target=data["target"],
            source_handle=data["source_handle"],
            target_handle=data["target_handle"],
        )


@dataclass(kw_only=True)
class MappingGraph:
    """
    A mapping graph.

    Attributes:
        uuid (str): The UUID of the graph
        name (str): The name of the graph
        description (str): The description of the graph
        nodes (list[MappingNode]): The nodes in the graph
        edges (list[MappingEdge]): The edges in the graph
    """

    uuid: str
    name: str
    description: str
    source_id: str
    nodes: list[
        MappingNode | MappingLiteral | MappingURIRef
    ]
    edges: list[MappingEdge]

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "description": self.description,
            "source_id": self.source_id,
            "nodes": [
                node.to_dict() for node in self.nodes
            ],
            "edges": [
                edge.to_dict() for edge in self.edges
            ],
        }

    @classmethod
    def from_dict(cls, data):
        if "uuid" not in data:
            raise ValueError("uuid is required")
        if "name" not in data:
            raise ValueError("name is required")
        if "description" not in data:
            raise ValueError("description is required")
        if "source_id" not in data:
            raise ValueError("source_id is required")
        if "nodes" not in data:
            raise ValueError("nodes is required")
        if "edges" not in data:
            raise ValueError("edges is required")
        return cls(
            uuid=data["uuid"],
            name=data["name"],
            description=data["description"],
            source_id=data["source_id"],
            nodes=[
                MappingNode.from_dict(node)
                if node["type"] == MappingNodeType.ENTITY
                else MappingLiteral.from_dict(node)
                if node["type"] == MappingNodeType.LITERAL
                else MappingURIRef.from_dict(node)
                for node in data["nodes"]
            ],
            edges=[
                MappingEdge.from_dict(edge)
                for edge in data["edges"]
            ],
        )
