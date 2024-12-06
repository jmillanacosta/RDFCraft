from kink import inject

from server.facades import BaseFacade, FacadeResponse
from server.models.workspace import (
    WorkspaceModel,
    WorkspaceType,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.local.local_workspace_service import (
    WorkspaceServiceProtocol,
)


@inject
class CreateWorkspaceFacade(BaseFacade):
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
        name: str,
        description: str,
        type: WorkspaceType,
        location: str,
    ) -> FacadeResponse:
        self.logger.info("Creating workspace metadata")

        workspace_metadata = self.workspace_metadata_service.create_workspace_metadata(
            name=name,
            description=description,
            type=type,
            location=location,
        )

        self.logger.info("Creating workspace")
        model: WorkspaceModel = (
            WorkspaceModel.create_with_defaults(
                uuid=workspace_metadata.uuid,
                name=name,
                description=description,
                type=type,
                location=location,
            )
        )
        self.workspace_service.create_workspace(
            workspace=model
        )

        return self._success_response(
            data=workspace_metadata,
            message="Workspace created",
        )
