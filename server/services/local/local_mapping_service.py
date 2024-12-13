import logging

from kink import inject

from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)


@inject(alias=MappingServiceProtocol)
class LocalMappingService(MappingServiceProtocol):
    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)

        self.logger.info("LocalMappingService initialized")
