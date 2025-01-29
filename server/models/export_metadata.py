from dataclasses import dataclass
from enum import StrEnum

from server.models.file_metadata import FileMetadata
from server.models.mapping import MappingGraph
from server.models.source import Source
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
    sources: list[Source]
    workspace_metadata: WorkspaceMetadata | None
    workspace_model: WorkspaceModel | None
    mappings: list[MappingGraph]

    def to_dict(self):
        """
        Convert to dictionary
        """
        return {
            "type": self.type,
            "files": [
                file.to_dict() for file in self.files
            ],
            "sources": [
                source.to_dict() for source in self.sources
            ],
            "workspace_metadata": (
                self.workspace_metadata.to_dict()
                if self.workspace_metadata is not None
                else None
            ),
            "workspace_model": (
                self.workspace_model.to_dict()
                if self.workspace_model is not None
                else None
            ),
            "mappings": [
                mapping.to_dict()
                for mapping in self.mappings
            ],
        }
