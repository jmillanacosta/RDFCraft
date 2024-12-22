from kink import inject

from server.facades import BaseFacade, FacadeResponse
from server.models.source import Source
from server.services.local.local_source_service import (
    SourceServiceProtocol,
)


@inject
class GetSourceFacade(BaseFacade):
    def __init__(
        self,
        source_service: SourceServiceProtocol,
    ):
        super().__init__()
        self.source_service = source_service

    @BaseFacade.error_wrapper
    def execute(
        self,
        source_uuid: str,
    ) -> FacadeResponse:
        self.logger.info("Getting source")

        source: Source = self.source_service.get_source(
            source_id=source_uuid
        )

        return self._success_response(
            message="Source fetched successfully",
            data=source,
        )
