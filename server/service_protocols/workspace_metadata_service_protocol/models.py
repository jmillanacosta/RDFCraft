from dataclasses import dataclass

from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceMetadata,
    WorkspaceType,
)


@dataclass
class WorkspaceMetadataModel:
    """
    Model for workspace metadata

    Attributes:
        uuid (str): UUID of the workspace
        name (str): name of the workspace
        description (str): description of the workspace
        type (WorkspaceType): type of the workspace
        location (str): location of the workspace
        enabled_features (list[str]): list of enabled features
    """

    uuid: str
    name: str
    description: str
    type: WorkspaceType
    location: str
    enabled_features: list[str]

    @staticmethod
    def from_table(workspace_metadata: WorkspaceMetadata):
        return WorkspaceMetadataModel(
            uuid=workspace_metadata.uuid,
            name=workspace_metadata.name,
            description=workspace_metadata.description,
            type=workspace_metadata.type,
            location=workspace_metadata.location,
            enabled_features=workspace_metadata.enabled_features.split(
                ","
            ),
        )

    def to_table(self):
        return WorkspaceMetadata(
            uuid=self.uuid,
            name=self.name,
            description=self.description,
            type=self.type,
            location=self.location,
            enabled_features=",".join(
                self.enabled_features
            ),
        )
