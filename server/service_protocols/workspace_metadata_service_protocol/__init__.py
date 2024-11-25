from typing import Protocol

from server.service_protocols.workspace_metadata_service_protocol.models import (
    WorkspaceMetadataModel,
)


class WorkspaceMetadataService(Protocol):
    """
    Service for metadata of workspaces
    """

    def get_workspaces(
        self,
    ) -> list[WorkspaceMetadataModel]:
        """
        Get all workspaces

        Returns:
            list[WorkspaceMetadataModel]: list of workspace metadata
        """
        ...

    def create_workspace_metadata(
        self, workspace_metadata: WorkspaceMetadataModel
    ) -> None:
        """
        Create workspace metadata

        Args:
            workspace_metadata (WorkspaceMetadataModel): workspace metadata
        """
        ...

    def update_workspace_metadata(
        self,
        uuid: str,
        workspace_metadata: WorkspaceMetadataModel,
    ) -> None:
        """
        Update workspace metadata

        Args:
            uuid (str): UUID of the workspace
            workspace_metadata (WorkspaceMetadataModel): workspace metadata
        """
        ...

    def delete_workspace_metadata(self, uuid: str) -> None:
        """
        Delete workspace metadata

        Args:
            uuid (str): UUID of the workspace
        """
        ...
