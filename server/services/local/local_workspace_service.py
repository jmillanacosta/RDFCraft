import json
import logging

from kink import inject

from server.exceptions import ErrCodes, ServerException
from server.models.workspace import WorkspaceModel
from server.service_protocols.workspace_service_protocol import (
    WorkspaceServiceProtocol,
)
from server.services import LocalFSService


@inject(alias=WorkspaceServiceProtocol)
class LocalWorkspaceService(
    WorkspaceServiceProtocol,
):
    def __init__(self, fs_service: LocalFSService):
        self.logger = logging.getLogger(__name__)
        self._fs_service: LocalFSService = fs_service

    def get_workspace(
        self, location: str
    ) -> WorkspaceModel:
        self.logger.info(f"Getting workspace at {location}")
        try:
            workspace_json_raw = (
                self._fs_service.download_file_with_uuid(
                    location
                )
            )
            workspace = WorkspaceModel.from_dict(
                json.loads(
                    workspace_json_raw.decode("utf-8")
                )
            )

            return workspace
        except ServerException as e:
            if e.code == ErrCodes.FILE_NOT_FOUND:
                self.logger.error(
                    f"Workspace at {location} not found"
                )
                raise ServerException(
                    f"Workspace at {location} not found",
                    code=ErrCodes.WORKSPACE_NOT_FOUND,
                )
            self.logger.error(
                f"Failed to get workspace at {location}"
            )
            raise e

        except Exception as e:
            self.logger.error(
                f"Unexpected error while getting workspace at {location}",
                exc_info=e,
            )
            raise ServerException(
                "Unexpected error",
                ErrCodes.UNKNOWN_ERROR,
            )

    def create_workspace(
        self, workspace: WorkspaceModel
    ) -> None:
        self.logger.info(
            f"Creating workspace {workspace.name}"
        )
        if workspace.location == "":
            workspace = workspace.copy_with(
                location=workspace.uuid
            )
        workspace_json = json.dumps(workspace.to_dict())
        self._fs_service.upload_file(
            workspace.name,
            workspace_json.encode("utf-8"),
            workspace.location,
        )
        self.logger.info(
            f"Workspace {workspace.name} created with location {workspace.location}"
        )

    def update_workspace(
        self, workspace: WorkspaceModel
    ) -> None:
        workspace_json = json.dumps(workspace.to_dict())
        self._fs_service.upload_file(
            workspace.name,
            workspace_json.encode("utf-8"),
            workspace.location,
            allow_overwrite=True,
        )

    def delete_workspace(self, location: str) -> None:
        try:
            self._fs_service.delete_file_with_uuid(location)
        except ServerException as e:
            if e.code == ErrCodes.FILE_NOT_FOUND:
                self.logger.error(
                    f"Workspace at {location} not found"
                )
                raise ServerException(
                    f"Workspace at {location} not found",
                    code=ErrCodes.WORKSPACE_NOT_FOUND,
                )
            self.logger.error(
                f"Failed to delete workspace at {location}"
            )
            raise e
        except Exception as e:
            self.logger.error(
                f"Unexpected error while deleting workspace at {location}",
                exc_info=e,
            )
            raise ServerException(
                "Unexpected error",
                ErrCodes.UNKNOWN_ERROR,
            )
