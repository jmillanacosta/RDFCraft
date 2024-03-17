from typing import Optional
from beanie import Document, Link
from pydantic import BaseModel
from helpers.pydantic_uri import PydanticUriRef
from models.ontology_document import OntologyDocument


class PrefixDocument(Document):
    prefix: str
    uri: PydanticUriRef
    ontology: Optional[Link[OntologyDocument]]


__all__ = ["PrefixDocument"]
