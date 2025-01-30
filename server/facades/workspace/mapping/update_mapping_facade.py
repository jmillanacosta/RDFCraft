from kink import inject

from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.models.mapping import MappingGraph
from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)


@inject
class UpdateMappingFacade(BaseFacade):
    def __init__(
        self,
        mapping_service: MappingServiceProtocol,
    ):
        super().__init__()
        self.mapping_service: MappingServiceProtocol = mapping_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        mapping_id: str,
        mapping_graph: MappingGraph,
    ) -> FacadeResponse:
        self.logger.info(f"Updating mapping {mapping_id}")
        self.mapping_service.update_mapping(
            mapping_id,
            mapping_graph,
        )
        return FacadeResponse(
            status=200,
            message=f"Mapping {mapping_id} updated",
        )
