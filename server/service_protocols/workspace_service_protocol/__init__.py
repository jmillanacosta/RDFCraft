from typing import Protocol

from server.models.workspace import (
    WorkspaceModel,
)


class WorkspaceServiceProtocol(Protocol):
    """
    Service for workspace operations
    """

    def get_workspace(self, uuid: str) -> WorkspaceModel:
        """
        Get a workspace by UUID

        Args:
            uuid (str): UUID of the workspace

        Returns:
            WorkspaceModel: workspace
        """
        ...

    def create_workspace(
        self, workspace: WorkspaceModel
    ) -> None:
        """
        Create a workspace

        Args:
            workspace (WorkspaceModel): workspace
        """
        ...

    def update_workspace(
        self, workspace: WorkspaceModel
    ) -> None:
        """
        Update a workspace

        Args:
            workspace (WorkspaceModel): workspace
        """
        ...

    def delete_workspace(self, uuid: str) -> None:
        """
        Delete a workspace

        Args:
            uuid (str): UUID of the workspace
        """
        ...
