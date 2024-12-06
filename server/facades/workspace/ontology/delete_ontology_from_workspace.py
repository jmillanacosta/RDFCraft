from kink import inject

from server.const.err_enums import ErrCodes
from server.facades import (
    BaseFacade,
    FacadeResponse,
)
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
class DeleteOntologyFromWorkspaceFacade(BaseFacade):
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
        ontology_id: str,
    ):
        self.logger.info("Retrieving workspace metadata")
        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id,
        )

        self.logger.info("Retrieving workspace")
        workspace = self.workspace_service.get_workspace(
            workspace_metadata.location,
        )

        if ontology_id not in workspace.ontologies:
            return FacadeResponse(
                status=404,
                message=f"Ontology {ontology_id} not found in workspace {workspace_id}",
                err_code=ErrCodes.ONTOLOGY_NOT_FOUND,
            )

        self.logger.info("Deleting ontology")
        self.ontology_service.delete_ontology(ontology_id)

        self.logger.info("Updating workspace")
        new_model = workspace.copy_with(
            ontologies=[
                ontology
                for ontology in workspace.ontologies
                if ontology != ontology_id
            ]
        )

        self.workspace_service.update_workspace(new_model)

        return FacadeResponse(
            status=200,
            message="Ontology deleted from workspace",
        )
