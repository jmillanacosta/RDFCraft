import logging
from typing import Tuple
from uuid import uuid4

from kink import inject
from sqlalchemy import Result, Row, Select, delete, select

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.models.workspace_metadata import (
    WorkspaceMetadata,
)
from server.service_protocols.workspace_metadata_service_protocol import (
    WorkspaceMetadataServiceProtocol,
)
from server.services.core.sqlite_db_service import DBService
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceMetadataTable,
    WorkspaceType,
)


@inject(alias=WorkspaceMetadataServiceProtocol)
class WorkspaceMetadataService(WorkspaceMetadataServiceProtocol):
    def __init__(self, db_service: DBService):
        self.logger = logging.getLogger("rdfcraft.services.workspace_metadata_service")
        self._db_service: DBService = db_service

        self.logger.info("WorkspaceMetadataService initialized")

    def get_workspace_metadata(
        self,
        uuid: str,
    ) -> WorkspaceMetadata:
        self.logger.info(f"Getting workspace metadata: {uuid}")
        query: Select[Tuple[WorkspaceMetadataTable]] = (
            select(WorkspaceMetadataTable)
            .where(WorkspaceMetadataTable.uuid == uuid)
            .limit(1)
        )
        with self._db_service.get_session() as session:
            res: Result[Tuple[WorkspaceMetadataTable]] = session.execute(query)
            item: Row[Tuple[WorkspaceMetadataTable]] | None = res.one_or_none()
            if item is None:
                err_msg = f"Workspace metadata with uuid {uuid} not found"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
                )
            return WorkspaceMetadata.from_table(item.tuple()[0])

    def get_workspaces(
        self,
    ) -> list[WorkspaceMetadata]:
        self.logger.info("Getting workspaces")
        with self._db_service.get_session() as session:
            res = session.query(WorkspaceMetadataTable).all()
            self.logger.info(f"Fetched {len(res)} workspaces")
            return list(map(WorkspaceMetadata.from_table, res))

    def create_workspace_metadata(
        self,
        name: str,
        description: str,
        type: WorkspaceType,
        location: str,
    ) -> WorkspaceMetadata:
        self.logger.info(f"Creating workspace metadata for {name}")

        _uuid = uuid4().hex
        workspace_metadata = WorkspaceMetadata(
            uuid=_uuid,
            name=name,
            description=description,
            type=type,
            location=_uuid if location is None or location == "" else location,
            enabled_features=[],
        )

        with self._db_service.get_session() as session:
            session.add(workspace_metadata.to_table())
            session.commit()
            self.logger.info(f"Workspace metadata created: {workspace_metadata}")
            return workspace_metadata

    def update_workspace_metadata(
        self,
        uuid: str,
        name: str | None,
        description: str | None,
    ) -> None:
        self.logger.info(f"Updating workspace metadata: {uuid}")
        query: Select[Tuple[WorkspaceMetadataTable]] = (
            select(WorkspaceMetadataTable)
            .where(WorkspaceMetadataTable.uuid == uuid)
            .limit(1)
        )
        with self._db_service.get_session() as session:
            res: Result[Tuple[WorkspaceMetadataTable]] = session.execute(query)
            item: Row[Tuple[WorkspaceMetadataTable]] | None = res.one_or_none()
            if item is None:
                err_msg = f"Workspace metadata with uuid {uuid} not found"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
                )
            if name is not None:
                item.name = name
            if description is not None:
                item.description = description
            session.commit()
            self.logger.info(f"Workspace metadata updated: {uuid}")

    def delete_workspace_metadata(self, uuid: str) -> None:
        self.logger.info(f"Deleting workspace metadata: {uuid}")

        query: Select[Tuple[WorkspaceMetadataTable]] = (
            select(WorkspaceMetadataTable)
            .where(WorkspaceMetadataTable.uuid == uuid)
            .limit(1)
        )

        with self._db_service.get_session() as session:
            res: Result[Tuple[WorkspaceMetadataTable]] = session.execute(query)
            item: Row[Tuple[WorkspaceMetadataTable]] | None = res.one_or_none()
            if item is None:
                err_msg = f"Workspace metadata with uuid {uuid} not found"
                self.logger.error(err_msg)
                raise ServerException(
                    err_msg,
                    ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
                )
            session.execute(
                delete(WorkspaceMetadataTable).where(
                    WorkspaceMetadataTable.uuid == uuid
                )
            )
            session.commit()
            self.logger.info(f"Workspace metadata deleted: {uuid}")


__all__ = ["WorkspaceMetadataService"]
