from dataclasses import dataclass
from enum import StrEnum

from server.models.file_metadata import FileMetadata
from server.models.mapping import MappingGraph
from server.models.workspace import WorkspaceModel
from server.models.workspace_metadata import (
    WorkspaceMetadata,
)


class ExportMetadataType(StrEnum):
    MAPPING = "mapping"
    WORKSPACE = "workspace"


@dataclass
class ExportMetadata:
    """
    Contains metadata for an export
    """

    type: ExportMetadataType
    files: list[FileMetadata]
    workspace_metadata: WorkspaceMetadata | None
    workspace_model: WorkspaceModel | None
    mappings: list[MappingGraph]
