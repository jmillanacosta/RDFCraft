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
class DeletePrefixFromWorkspaceFacade(BaseFacade):
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
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        if prefix not in workspace.prefixes:
            return FacadeResponse(
                status=404,
                err_code=ErrCodes.PREFIX_NOT_FOUND,
                message=f"Prefix {prefix} not found in workspace",
            )

        new_model = workspace.copy_with(
            prefixes={
                key: value
                for key, value in workspace.prefixes.items()
                if key != prefix
            }
        )

        self.logger.info("Updating workspace")
        self.workspace_service.update_workspace(
            workspace=new_model,
        )

        return FacadeResponse(
            status=200,
            message=f"Prefix {prefix} deleted from workspace",
        )
