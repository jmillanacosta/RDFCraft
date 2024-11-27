from typing import Protocol

from server.service_protocols.workspace_metadata_service_protocol.models import (
    WorkspaceMetadataModel,
)
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceType,
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
        self,
        name: str,
        description: str,
        type: WorkspaceType,
        location: str,
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

    def delete_workspace_metadata(self, uuid: str) -> None:
        """
        Delete workspace metadata

        Args:
            uuid (str): UUID of the workspace
        """
        ...
