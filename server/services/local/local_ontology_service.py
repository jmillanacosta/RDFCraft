from kink import inject

from server.service_protocols.fs_service_protocol import (
    FSServiceProtocol,
)
from server.services.local.local_fs_service import (
    LocalFSService,
)


@inject
class LocalOntologyService:
    def __init__(self, fs_service: LocalFSService):
        self.fs_service: FSServiceProtocol = fs_service

