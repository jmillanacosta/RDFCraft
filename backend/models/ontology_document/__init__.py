from enum import Enum
from beanie import (
    Document,
    Indexed,
    Link,
    PydanticObjectId,
)

from helpers.pydantic_uri import PydanticUriRef
from models.file_document import FileDocument

from models.prefix_document import PrefixDocument


class OntologyIndividualModel(Document):
    full_uri: PydanticUriRef = Indexed(
        PydanticUriRef, unique=True
    )
    ontology_id: PydanticObjectId
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
    ontology_id: PydanticObjectId
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
    ontology_id: PydanticObjectId
    label: str
    description: str
    is_deprecated: bool


class OntologyDocument(Document):
    name: str
    description: str
    file: Link[FileDocument]
    prefix: Link[PrefixDocument]


__all__ = [
    "OntologyDocument",
    "OntologyClassDocument",
    "OntologyPropertyDocument",
    "PropertyType",
]
