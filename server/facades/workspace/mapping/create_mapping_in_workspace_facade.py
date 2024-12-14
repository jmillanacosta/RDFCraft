from kink import inject

from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.models.source import SourceType
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
class CreateMappingInWorkspaceFacade(BaseFacade):
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
        name: str,
        description: str,
        source_content: bytes,
        source_type: SourceType,
        extra: dict,
    ) -> FacadeResponse:
        self.logger.info(
            f"Creating mapping in workspace {workspace_id} with name {name}"
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
        self.logger.info("Creating source")
        source = self.source_service.create_source(
            type=source_type,
            content=source_content,
            extra=extra,
        )
        self.logger.info("Creating mapping")
        mapping_graph_uuid = (
            self.mapping_service.create_mapping(
                name=name,
                description=description,
                source_uuid=source,
            )
        )
        self.logger.info("Mapping created")
        new_model = workspace.copy_with(
            mappings=workspace.mappings
            + [mapping_graph_uuid],
        )
        self.workspace_service.update_workspace(
            new_model,
        )
        self.logger.info("Workspace updated")
        return FacadeResponse(
            status=202,
            message="Mapping created",
            data=mapping_graph_uuid,
        )
