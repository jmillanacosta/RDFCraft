import logging
from typing import Tuple

from kink import inject
from sqlalchemy import Result, Row, Select, select

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocols.db_service_protocol import (
    DBService,
)
from server.service_protocols.workspace_metadata_service_protocol.models import (
    WorkspaceMetadataModel,
)
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceMetadata,
)


@inject
class WorkspaceMetadataService:
    def __init__(self, db_service: DBService):
        self.logger = logging.getLogger(
            "rdfcraft.services.workspace_metadata_service"
        )
        self._db_service = db_service

    def get_workspaces(
        self,
    ) -> list[WorkspaceMetadataModel]:
        self.logger.info("Getting workspaces")
        with self._db_service.get_session() as session:
            res = session.query(WorkspaceMetadata).all()
            self.logger.info(
                f"Fetched {len(res)} workspaces"
            )
            return list(
                map(WorkspaceMetadataModel.from_table, res)
            )

    def create_workspace_metadata(
        self, workspace_metadata: WorkspaceMetadataModel
    ) -> None:
        self.logger.info(
            f"Creating workspace metadata: {workspace_metadata}"
        )
        with self._db_service.get_session() as session:
            session.add(workspace_metadata.to_table())
            session.commit()
            self.logger.info(
                f"Workspace metadata created: {workspace_metadata}"
            )

    def update_workspace_metadata(
        self,
        uuid: str,
        workspace_metadata: WorkspaceMetadataModel,
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
            session.merge(workspace_metadata.to_table())
            session.commit()
            self.logger.info(
                f"Workspace metadata updated: {workspace_metadata}"
            )

    def delete_workspace_metadata(self, uuid: str) -> None:
        self.logger.info(
            f"Deleting workspace metadata: {uuid}"
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
            session.delete(item)
            session.commit()
            self.logger.info(
                f"Workspace metadata deleted: {uuid}"
            )


__all__ = ["WorkspaceMetadataService"]
