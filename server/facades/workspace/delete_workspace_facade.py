from kink import inject

from server.exceptions import ErrCodes
from server.facades import (
    BaseFacade,
    FacadeResponse,
    ServerException,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.local.local_workspace_service import (
    WorkspaceServiceProtocol,
)


@inject
class DeleteWorkspaceFacade(BaseFacade):
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
        uuid: str,
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            uuid=uuid,
        )
        self.logger.info("Deleting workspace")
        try:
            self.workspace_service.delete_workspace(
                location=workspace_metadata.location,
            )

        except ServerException as e:
            # Ignore workspace not found error
            if e.code != ErrCodes.WORKSPACE_NOT_FOUND:
                raise e

        self.logger.info("Deleting workspace metadata")
        self.workspace_metadata_service.delete_workspace_metadata(
            uuid=uuid,
        )
        return FacadeResponse(
            status=204,
            message="Workspace deleted",
        )
