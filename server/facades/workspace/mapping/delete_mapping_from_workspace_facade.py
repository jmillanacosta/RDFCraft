from kink import inject

from server.exceptions import ErrCodes
from server.facades import (
    BaseFacade,
    FacadeResponse,
    ServerException,
)
from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.local.local_source_service import (
    SourceServiceProtocol,
)
from server.services.local.local_workspace_service import (
    WorkspaceServiceProtocol,
)


@inject
class DeleteMappingFromWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service: WorkspaceMetadataServiceProtocol = (
            workspace_metadata_service
        )
        self.workspace_service: WorkspaceServiceProtocol = workspace_service
        self.mapping_service: MappingServiceProtocol = mapping_service
        self.source_service: SourceServiceProtocol = source_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
        mapping_id: str,
    ) -> FacadeResponse:
        self.logger.info(f"Dropping mapping {mapping_id} from workspace {workspace_id}")
        self.logger.info(f"Retrieving workspace {workspace_id}")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        if mapping_id not in workspace.mappings:
            self.logger.error(
                f"Mapping {mapping_id} not found in workspace {workspace_id}"
            )
            raise ServerException(
                f"Mapping {mapping_id} not found in workspace {workspace_id}",
                code=ErrCodes.MAPPING_NOT_FOUND,
            )

        self.logger.info(f"Retrieving mapping {mapping_id}")

        mapping = self.mapping_service.get_mapping(
            mapping_id,
        )

        self.logger.info(f"Deleting source {mapping.source_id}")

        self.source_service.delete_source(
            mapping.source_id,
        )

        self.logger.info(f"Deleting mapping {mapping_id}")

        self.mapping_service.delete_mapping(
            mapping_id,
        )

        self.logger.info(f"Removing mapping {mapping_id} from workspace {workspace_id}")

        new_model = workspace.copy_with(
            mappings=[m for m in workspace.mappings if m != mapping_id],
        )

        self.workspace_service.update_workspace(
            new_model,
        )

        return FacadeResponse(
            status=200,
            message=f"Mapping {mapping_id} dropped from workspace {workspace_id}",
        )
