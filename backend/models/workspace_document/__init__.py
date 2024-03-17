from beanie import Document, Link
from models.mapping_document import MappingDocument
from models.ontology_document import OntologyDocument
from models.prefix_document import PrefixDocument
from models.source_document import SourceDocument


class WorkspaceDocument(Document):
    name: str
    description: str
    sources: list[Link[SourceDocument]] = []
    prefixes: list[Link[PrefixDocument]] = []
    ontologies: list[Link[OntologyDocument]] = []
    mappings: list[Link[MappingDocument]] = []


__all__ = ["WorkspaceDocument"]
