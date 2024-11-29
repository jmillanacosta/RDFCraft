from dataclasses import dataclass

from server.models.workspace_metadata import (
    WorkspaceMetadata,
)


@dataclass
class WorkspaceModel:
    """
    Model for workspace

    Attributes:
        metadata (WorkspaceMetadataModel): metadata of the workspace
        sources (list[str]): ids of sources
        mappings (list[str]): ids of mappings
        ontologies (list[str]): ids of ontologies
        prefixes (dict[str, str]): prefixes
        used_uri_patterns (list[str]): list of used URI patterns
    """

    metadata: WorkspaceMetadata
    sources: list[str]
    mappings: list[str]
    prefixes: dict[str, str]
    ontologies: list[str]
    used_uri_patterns: list[str]
