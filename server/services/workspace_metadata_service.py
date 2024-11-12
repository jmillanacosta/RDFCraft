import logging
from typing import Tuple

from kink import inject
from sqlalchemy import Result, Row, Select, select

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocol.db_service_protocol import (
    DBService,
)
from server.service_protocol.workspace_metadata_service_protocol import (
    WorkspaceMetadataService,
)
from server.services.db_service.tables.workspace_metadata import (
    WorkspaceMetadata,
)


@inject(alias=WorkspaceMetadataService)
class _WorkspaceMetadataService:
    def __init__(self, db_service: DBService):
        self.logger = logging.getLogger(
            "rdfcraft.services.workspace_metadata_service"
        )
        self._db_service = db_service

    def get_workspaces(self) -> list[WorkspaceMetadata]:
        self.logger.info("Getting workspaces")
        with self._db_service.get_session() as session:
            res = session.query(WorkspaceMetadata).all()
            self.logger.info(
                f"Fetched {len(res)} workspaces"
            )
            return res

    def create_workspace_metadata(
        self, workspace_metadata: WorkspaceMetadata
    ) -> None:
        self.logger.info(
            f"Creating workspace metadata: {workspace_metadata}"
        )
        with self._db_service.get_session() as session:
            session.add(workspace_metadata)
            session.commit()
            self.logger.info(
                f"Workspace metadata created: {workspace_metadata}"
            )

    def update_workspace_metadata(
        self,
        uuid: str,
        workspace_metadata: WorkspaceMetadata,
    ) -> None:
        self.logger.info(
            f"Updating workspace metadata: {workspace_metadata}"
        )
        query: Select[Tuple[WorkspaceMetadata]] = (
            select(WorkspaceMetadata)
            .where(WorkspaceMetadata.uuid == uuid)
            .limit(1)
        )
        with self._db_service.get_session() as session:
            res: Result[Tuple[WorkspaceMetadata]] = (
                session.execute(query)
            )
            item: Row[Tuple[WorkspaceMetadata]] | None = (
                res.one_or_none()
            )
            if item is None:
                err_msg = f"Workspace metadata with uuid {uuid} not found"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
                )
            if (
                workspace_metadata.uuid
                and workspace_metadata.uuid != uuid
            ):
                err_msg = f"Cannot update workspace metadata uuid ({uuid} -> {workspace_metadata.uuid})"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_ILLEGAL_UPDATE_OPERATION,
                )
            session.commit()
            self.logger.info(
                f"Workspace metadata updated: {workspace_metadata}"
            )

    def delete_workspace_metadata(
        self, workspace_metadata: WorkspaceMetadata
    ) -> None:
        self.logger.info(
            f"Deleting workspace metadata: {workspace_metadata}"
        )
        with self._db_service.get_session() as session:
            item: WorkspaceMetadata | None = (
                session.query(WorkspaceMetadata)
                .filter_by(uuid=workspace_metadata.uuid)
                .first()
            )
            if item is None:
                err_msg = f"Workspace metadata with uuid {workspace_metadata.uuid} not found"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
                )
            session.delete(workspace_metadata)
            session.commit()
            self.logger.info(
                f"Workspace metadata deleted: {workspace_metadata}"
            )


__all__ = ["_WorkspaceMetadataService"]
