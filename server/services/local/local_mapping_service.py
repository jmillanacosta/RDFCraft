import json
import logging

from kink import inject

from server.exceptions import ErrCodes
from server.facades import ServerException
from server.models.mapping import MappingGraph
from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)
from server.services import LocalFSService


@inject(alias=MappingServiceProtocol)
class LocalMappingService(MappingServiceProtocol):
    def __init__(self, fs_service: LocalFSService):
        self.logger = logging.getLogger(__name__)
        self._fs_service: LocalFSService = fs_service

        self.logger.info("LocalMappingService initialized")

    def get_mapping(self, mapping_id: str) -> MappingGraph:
        self.logger.info(f"Getting mapping {mapping_id}")
        try:
            raw_mapping = (
                self._fs_service.download_file_with_uuid(
                    mapping_id
                )
            )
        except ServerException as e:
            if e.code == ErrCodes.FILE_NOT_FOUND:
                self.logger.error(
                    f"Mapping {mapping_id} not found"
                )
                raise ServerException(
                    f"Mapping {mapping_id} not found",
                    code=ErrCodes.MAPPING_NOT_FOUND,
                )
            self.logger.error(
                f"Failed to get mapping {mapping_id}"
            )
            raise e
        except Exception as e:
            self.logger.error(
                f"Unexpected error while getting mapping {mapping_id}",
                exc_info=e,
            )
            raise ServerException(
                "Unexpected error",
                code=ErrCodes.UNKNOWN_ERROR,
            )

        self.logger.info(
            f"Mapping {mapping_id} found, parsing"
        )
        mapping = MappingGraph.from_dict(
            json.loads(raw_mapping.decode("utf-8"))
        )
        self.logger.info(
            f"Mapping {mapping_id} parsed successfully"
        )
        return mapping

    def update_mapping(
        self, mapping_id: str, graph: MappingGraph
    ) -> None:
        self.logger.info(f"Fetching mapping {mapping_id}")
        self.get_mapping(
            mapping_id
        )  # This will raise an exception if the mapping does not exist

        if mapping_id != graph.uuid:
            raise ServerException(
                f"Mapping ID {mapping_id} does not match graph UUID {graph.uuid}",
                code=ErrCodes.MAPPING_ILLEGAL_UPDATE_OPERATION,
            )

        self.logger.info(f"Updating mapping {mapping_id}")
        self._fs_service.upload_file(
            mapping_id,
            json.dumps(graph.to_dict()).encode("utf-8"),
            allow_overwrite=True,
        )

        self.logger.info(
            f"Mapping {mapping_id} updated successfully"
        )

    def create_mapping(self, graph: MappingGraph) -> str:
        self.logger.info(f"Creating mapping {graph.uuid}")
        self._fs_service.upload_file(
            graph.uuid,
            json.dumps(graph.to_dict()).encode(
                "utf-8",
            ),
        )

        self.logger.info(
            f"Mapping {graph.uuid} created successfully"
        )
        return graph.uuid

    def delete_mapping(self, mapping_id: str) -> None:
        self.logger.info(f"Deleting mapping {mapping_id}")
        self.get_mapping(
            mapping_id
        )  # This will raise an exception if the mapping does not exist
        self._fs_service.delete_file_with_uuid(mapping_id)
