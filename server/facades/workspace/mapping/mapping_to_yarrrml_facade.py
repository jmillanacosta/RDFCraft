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
from server.service_protocols.mapping_to_yarrrml_service_protocol import (
    FSServiceProtocol,
    MappingToYARRRMLServiceProtocol,
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
class MappingToYARRRMLFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
        yarrrml_service: MappingToYARRRMLServiceProtocol,
        fs_service: FSServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service: WorkspaceMetadataServiceProtocol = (
            workspace_metadata_service
        )
        self.workspace_service: WorkspaceServiceProtocol = workspace_service
        self.mapping_service: MappingServiceProtocol = mapping_service
        self.source_service: SourceServiceProtocol = source_service
        self.yarrrml_service: MappingToYARRRMLServiceProtocol = yarrrml_service
        self.fs_service: FSServiceProtocol = fs_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
        mapping_id: str | None = None,
    ) -> FacadeResponse:
        self.logger.info(
            f"Creating YARRRML mapping for mapping {mapping_id} in workspace {workspace_id}"
        )

        self.logger.info("Retrieving workspace metadata")

        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")

        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        self.logger.info("Retrieving mapping")

        if mapping_id not in workspace.mappings:
            self.logger.error(
                f"Mapping {mapping_id} not found in workspace {workspace_id}"
            )
            raise ServerException(
                f"Mapping {mapping_id} not found in workspace {workspace_id}",
                ErrCodes.MAPPING_NOT_FOUND,
            )

        mapping = self.mapping_service.get_mapping(mapping_id)

        self.logger.info("Retrieving source")

        source = self.source_service.get_source(
            mapping.source_id,
        )

        self.logger.info("Converting mapping to YARRRML")

        yarrrml = self.yarrrml_service.convert_mapping_to_yarrrml(
            workspace.prefixes,
            source,
            mapping,
            self.fs_service,
        )

        return self._success_response(
            data=yarrrml,
            message="YARRRML mapping created",
        )
