from typing import Protocol

from server.services.db_service.tables.workspace_metadata import \
    WorkspaceMetadata


class WorkspaceMetadataService(Protocol):
    """
    Service for scanning workspaces
    """

    def get_workspaces(self) -> list[WorkspaceMetadata]:
        """
        Get all workspaces
        """
        ...

    def create_workspace_metadata(self, workspace_metadata: WorkspaceMetadata) -> None:
        """
        Create workspace metadata
        """
        ...

    def update_workspace_metadata(self, uuid: str, workspace_metadata: WorkspaceMetadata) -> None:
        """
        Update workspace metadata
        """
        ...

    def delete_workspace_metadata(self, uuid: str) -> None:
        """
        Delete workspace metadata
        """
        ...
