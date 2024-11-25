from enum import Enum

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class WorkspaceType(str, Enum):
    LOCAL = "local"
    REMOTE = "remote"


class WorkspaceMetadata(Base):
    """
    Table for workspace metadata.

    Attributes:
        - uuid - str
        - name - str
        - description - str
        - type - WorkspaceType
        - location - str - path to the workspace. File path for local workspaces, URL for remote workspaces.
        - enabled_features - str - comma-separated list of enabled features
    """

    __tablename__ = "workspace_metadata"

    uuid: Mapped[str] = mapped_column(
        String, primary_key=True
    )
    name: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    type: Mapped[WorkspaceType] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    enabled_features: Mapped[str] = mapped_column(String)

    def __repr__(self):
        return f"<WorkspaceMetadata(uuid={self.uuid}, name={self.name}, description={self.description}, type={self.type}, location={self.location})>"
