from kink import inject

from server.const.err_enums import ErrCodes
from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.models.ontology import Ontology
from server.service_protocols.ontology_service_protocol import (
    OntologyServiceProtocol,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.local.local_workspace_service import (
    WorkspaceServiceProtocol,
)


@inject
class CreateOntologyInWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        ontology_service: OntologyServiceProtocol,
    ):
        super().__init__()
        self.workspace_metadata_service = (
            workspace_metadata_service
        )
        self.workspace_service = workspace_service
        self.ontology_service = ontology_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
        name: str,
        description: str,
        base_uri: str,
        content: bytes,
    ) -> FacadeResponse:
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        self.logger.info("Creating ontology")
        ontology: Ontology = (
            self.ontology_service.create_ontology(
                name,
                description,
                base_uri,
                content,
            )
        )

        self.logger.info("Adding ontology to workspace")

        new_model = workspace.copy_with(
            ontologies=workspace.ontologies
            + [ontology.uuid],
        )

        self.workspace_service.update_workspace(
            new_model,
        )

        return FacadeResponse(
            status=200,
            message="Ontology created",
            data=ontology,
        )
