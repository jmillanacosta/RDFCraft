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
class GetPrefixInWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service = workspace_metadata_service
        self.workspace_service = workspace_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        return FacadeResponse(
            status=200,
            message="Prefixes retrieved",
            data=workspace.prefixes,
        )
