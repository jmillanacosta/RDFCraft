from abc import ABC, abstractmethod

from server.models.workspace_metadata import (
    WorkspaceMetadata,
)
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceType,
)


class WorkspaceMetadataServiceProtocol(ABC):
    """
    Service for metadata of workspaces
    """

    @abstractmethod
    def get_workspace_metadata(
        self,
        uuid: str,
    ) -> WorkspaceMetadata:
        """
        Get workspace metadata

        Args:
            uuid (str): UUID of the workspace

        Returns:
            WorkspaceMetadataModel: workspace metadata
        """
        ...

    @abstractmethod
    def get_workspaces(
        self,
    ) -> list[WorkspaceMetadata]:
        """
        Get all workspaces

        Returns:
            list[WorkspaceMetadataModel]: list of workspace metadata
        """
        ...

    @abstractmethod
    def create_workspace_metadata(
        self,
        name: str,
        description: str,
        type: WorkspaceType,
        location: str,
    ) -> WorkspaceMetadata:
        """
        Create workspace metadata

        Args:
            workspace_metadata (WorkspaceMetadataModel): workspace metadata
        """
        ...

    @abstractmethod
    def update_workspace_metadata(
        self,
        uuid: str,
        name: str,
        description: str,
    ) -> None:
        """
        Update workspace metadata

        Args:
            uuid (str): UUID of the workspace
            workspace_metadata (WorkspaceMetadataModel): workspace metadata
        """
        ...

    @abstractmethod
    def delete_workspace_metadata(self, uuid: str) -> None:
        """
        Delete workspace metadata

        Args:
            uuid (str): UUID of the workspace
        """
        ...
