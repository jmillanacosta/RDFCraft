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
from server.services.local.local_mapping_service import (
    MappingServiceProtocol,
)
from server.services.local.local_ontology_service import (
    OntologyServiceProtocol,
)
from server.services.local.local_source_service import (
    SourceServiceProtocol,
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
        ontology_service: OntologyServiceProtocol,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service = (
            workspace_metadata_service
        )
        self.workspace_service = workspace_service
        self.ontology_service = ontology_service
        self.mapping_service = mapping_service
        self.source_service = source_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        uuid: str,
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            uuid=uuid,
        )
        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            location=workspace_metadata.location,
        )
        if workspace is None:
            raise ServerException(
                f"Workspace {uuid} not found",
                code=ErrCodes.WORKSPACE_NOT_FOUND,
            )
        self.logger.info("Deleting Ontologies")
        for ontology in workspace.ontologies:
            self.ontology_service.delete_ontology(
                ontology_id=ontology,
            )
        self.logger.info("Fetching mappings")
        mappings = [
            self.mapping_service.get_mapping(mapping)
            for mapping in workspace.mappings
        ]
        self.logger.info("Deleting Sources")
        for mapping in mappings:
            for source in mapping.source_id:
                self.source_service.delete_source(
                    source_id=source,
                )

        self.logger.info("Deleting mappings")
        for mapping in workspace.mappings:
            self.mapping_service.delete_mapping(
                mapping_id=mapping,
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
