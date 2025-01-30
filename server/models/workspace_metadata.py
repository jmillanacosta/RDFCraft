from dataclasses import dataclass

from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceMetadataTable,
    WorkspaceType,
)


@dataclass
class WorkspaceMetadata:
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
    def from_table(
        workspace_metadata: WorkspaceMetadataTable,
    ):
        return WorkspaceMetadata(
            uuid=workspace_metadata.uuid,
            name=workspace_metadata.name,
            description=workspace_metadata.description,
            type=workspace_metadata.type,
            location=workspace_metadata.location,
            enabled_features=workspace_metadata.enabled_features.split(","),
        )

    def to_table(self):
        return WorkspaceMetadataTable(
            uuid=self.uuid,
            name=self.name,
            description=self.description,
            type=self.type,
            location=self.location,
            enabled_features=",".join(self.enabled_features),
        )

    @classmethod
    def from_dict(cls, data):
        if "uuid" not in data:
            raise ValueError("uuid is required")
        if "name" not in data:
            raise ValueError("name is required")
        if "description" not in data:
            raise ValueError("description is required")
        if "type" not in data:
            raise ValueError("type is required")
        if "location" not in data:
            raise ValueError("location is required")
        if "enabled_features" not in data:
            raise ValueError("enabled_features is required")
        return cls(
            uuid=data["uuid"],
            name=data["name"],
            description=data["description"],
            type=WorkspaceType(data["type"]),
            location=data["location"],
            enabled_features=data["enabled_features"],
        )

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "description": self.description,
            "type": self.type,
            "location": self.location,
            "enabled_features": self.enabled_features,
        }
