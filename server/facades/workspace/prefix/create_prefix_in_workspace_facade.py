from kink import inject

from server.const.err_enums import ErrCodes
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
class CreatePrefixInWorkspaceFacade(BaseFacade):
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
        workspace_id: str,
        prefix: str,
        uri: str,
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        if prefix in workspace.prefixes:
            return FacadeResponse(
                status=400,
                err_code=ErrCodes.PREFIX_EXISTS,
                message=f"Prefix {prefix} already exists in workspace",
            )

        new_model = workspace.copy_with(
            prefixes={
                **workspace.prefixes,
                prefix: uri,
            }
        )

        self.logger.info("Updating workspace")
        self.workspace_service.update_workspace(
            workspace=new_model,
        )

        return FacadeResponse(
            status=200,
            message=f"Prefix {prefix} added to workspace",
        )
