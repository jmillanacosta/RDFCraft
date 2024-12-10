from kink import inject

from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.local.local_workspace_service import (
    WorkspaceServiceProtocol,
)


@inject
class GetWorkspacesFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service = (
            workspace_metadata_service
        )
        self.workspace_service = workspace_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        uuid: str | None = None,
    ) -> FacadeResponse:
        self.logger.info(
            "Retrieving all workspace metadata"
        )
        all_workspace_metadata = (
            self.workspace_metadata_service.get_workspaces()
        )

        if uuid:
            all_workspace_metadata = [
                metadata
                for metadata in all_workspace_metadata
                if metadata.uuid == uuid
            ]

        all_workspaces = [
            self.workspace_service.get_workspace(
                metadata.location,
            )
            for metadata in all_workspace_metadata
        ]

        return FacadeResponse(
            status=200,
            message="All workspaces retrieved",
            data=all_workspaces,
        )
