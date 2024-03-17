from models.authorization_document import (
    AuthorizationDocument,
)
from models.file_document import FileDocument
from models.mapping_document import MappingDocument
from models.ontology_document import OntologyDocument
from models.prefix_document import PrefixDocument
from models.source_document import SourceDocument
from models.user_document import UserDocument
from models.workspace_document import WorkspaceDocument


all_documents = [
    AuthorizationDocument,
    FileDocument,
    MappingDocument,
    OntologyDocument,
    PrefixDocument,
    SourceDocument,
    UserDocument,
    WorkspaceDocument,
]


__all__ = [
    "all_documents",
]
