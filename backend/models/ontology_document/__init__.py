from enum import Enum
from beanie import (
    BackLink,
    Document,
    Indexed,
    Link,
)
from pydantic import BaseModel
from helpers.pydantic_uri import PydanticUriRef
from models.file_document import FileDocument


class OntologyIndividualModel(Document):
    full_uri: PydanticUriRef = Indexed(
        PydanticUriRef, unique=True
    )
    base_uri: PydanticUriRef = Indexed(PydanticUriRef)
    label: str
    description: str
    is_deprecated: bool


class PropertyType(str, Enum):
    OBJECT_PROPERTY = "object_property"
    DATA_PROPERTY = "data_property"


class OntologyPropertyDocument(Document):
    full_uri: PydanticUriRef = Indexed(
        PydanticUriRef, unique=True
    )
    base_uri: PydanticUriRef = Indexed(PydanticUriRef)
    label: str
    description: str
    is_deprecated: bool

    property_type: PropertyType
    property_range: list[PydanticUriRef]
    property_domain: list[PydanticUriRef]


class OntologyClassDocument(Document):
    full_uri: PydanticUriRef = Indexed(
        PydanticUriRef, unique=True
    )
    base_uri: PydanticUriRef = Indexed(PydanticUriRef)
    label: str
    description: str
    is_deprecated: bool


class OntologyDocument(Document):
    name: str
    description: str
    uri: PydanticUriRef = Indexed(
        PydanticUriRef, unique=True
    )
    file: Link[FileDocument]
    prefix: Link


__all__ = [
    "OntologyDocument",
    "OntologyClassDocument",
    "OntologyPropertyDocument",
    "PropertyType",
]
