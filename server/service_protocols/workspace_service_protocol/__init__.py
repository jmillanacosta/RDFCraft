from abc import ABC, abstractmethod

from server.models.workspace import (
    WorkspaceModel,
)


class WorkspaceServiceProtocol(ABC):
    """
    Service for workspace operations
    """

    @abstractmethod
    def get_workspace(self, location: str) -> WorkspaceModel:
        """
        Get a workspace by location

        Args:
            location (str): location of the workspace

        Returns:
            WorkspaceModel: workspace
        """
        ...

    @abstractmethod
    def create_workspace(self, workspace: WorkspaceModel) -> None:
        """
        Create a workspace

        Args:
            workspace (WorkspaceModel): workspace
        """
        ...

    @abstractmethod
    def update_workspace(self, workspace: WorkspaceModel) -> None:
        """
        Update a workspace

        Args:
            workspace (WorkspaceModel): workspace
        """
        ...

    @abstractmethod
    def delete_workspace(self, location: str) -> None:
        """
        Delete a workspace

        Args:
            location (str): location of the workspace
        """
        ...
