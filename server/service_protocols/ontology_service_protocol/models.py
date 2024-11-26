from dataclasses import dataclass, field
from enum import StrEnum

from server.service_protocols.fs_service_protocol.models import (
    FileMetadata,
)


@dataclass(kw_only=True)
class Literal:
    """
    A literal is a value that is not a URI, but a string, integer, etc.

    Attributes:
        value (str): The value of the literal
        datatype (str): The datatype of the literal
        language (str): The language of the literal
    """

    value: str
    datatype: str = ""
    language: str = ""


class NamedNodeType(StrEnum):
    """
    Enumeration of the types of named nodes.
    """

    CLASS = "class"
    INDIVIDUAL = "individual"
    PROPERTY = "property"


class PropertyType(StrEnum):
    """
    Enumeration of the types of properties.
    """

    OBJECT = "object"
    DATATYPE = "datatype"
    ANNOTATION = "annotation"


@dataclass(kw_only=True)
class NamedNode:
    """
    A named node is a node that has a URI.

    Attributes:
        belongs_to (str): The URI of the ontology that the node belongs to
        full_uri (str): The full URI of the node
        label (list[Literal]): The label of the node
        description (list[Literal]): The description of the node
        is_deprecated (bool): Whether the node is deprecated
    """

    belongs_to: str
    type: NamedNodeType
    full_uri: str
    label: list[Literal]
    description: list[Literal]
    is_deprecated: bool


@dataclass(kw_only=True)
class Individual(NamedNode):
    """
    An individual is a named node that is an instance of a class.

    Inherits from NamedNode.
    """

    type: NamedNodeType = field(
        default=NamedNodeType.INDIVIDUAL
    )

    def __post_init__(self):
        if self.type != NamedNodeType.INDIVIDUAL:
            raise ValueError(
                f"Individual must have type {NamedNodeType.INDIVIDUAL}"
            )


@dataclass(kw_only=True)
class Class(NamedNode):
    """
    A class is a named node that is a class.

    Inherits from NamedNode.

    Attributes:
        super_classes (list[str]): Full URIs of the super classes of the class
    """

    super_classes: list[str]
    type: NamedNodeType = NamedNodeType.CLASS

    def __post_init__(self):
        if self.type != NamedNodeType.CLASS:
            raise ValueError(
                f"Class must have type {NamedNodeType.CLASS}"
            )


@dataclass(kw_only=True)
class Property(NamedNode):
    """
    A property is a named node that is a property.

    Inherits from NamedNode.

    Attributes:
        property_type (PropertyType): The type of the property
        range (list[str]): Full URIs of the range of the property. Either a class or a datatype
        domain (list[str]): Full URIs of the domain of the property. Either a class or an individual
    """

    property_type: PropertyType
    range: list[str]
    domain: list[str]
    type: NamedNodeType = NamedNodeType.PROPERTY

    def __post_init__(self):
        if self.type != NamedNodeType.PROPERTY:
            raise ValueError(
                f"Property must have type {NamedNodeType.PROPERTY}"
            )


@dataclass(kw_only=True)
class Ontology:
    """
    An ontology is a collection of named nodes.

    Attributes:
        uuid (str): The UUID of the ontology
        name (str): The name of the ontology
        classes (list[Class]): The classes in the ontology
        individuals (list[Individual]): The individuals in the ontology
        properties (list[Property]): The properties in the ontology
        all_named_nodes (list[NamedNode]): All named nodes in the ontology

    """

    uuid: str
    file_metadata: FileMetadata
    name: str
    classes: list[Class]
    individuals: list[Individual]
    properties: list[Property]
    all_named_nodes: list[NamedNode]
