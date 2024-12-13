from kink import inject

from server.facades import (
    BaseFacade,
    FacadeResponse,
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
class GetMappingsInWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service: WorkspaceMetadataServiceProtocol = workspace_metadata_service
        self.workspace_service: WorkspaceServiceProtocol = (
            workspace_service
        )
        self.mapping_service: MappingServiceProtocol = (
            mapping_service
        )
        self.source_service: SourceServiceProtocol = (
            source_service
        )

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
    ) -> FacadeResponse:
        self.logger.info(
            f"Retrieving mappings in workspace {workspace_id}"
        )
        self.logger.info(
            f"Retrieving workspace {workspace_id}"
        )
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )
        self.logger.info("Retrieving mappings")

        mappings = [
            self.mapping_service.get_mapping(mapping_id)
            for mapping_id in workspace.mappings
        ]

        return FacadeResponse(
            status=200,
            message=f"Retrieved mappings in workspace {workspace_id}",
            data=mappings,
        )
