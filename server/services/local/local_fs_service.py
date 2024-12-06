import logging
from hashlib import sha1
from pathlib import Path
from typing import Tuple
from uuid import uuid4

from kink import inject
from sqlalchemy import delete, select
from sqlalchemy.engine.row import Row

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.models.file_metadata import FileMetadataTable
from server.service_protocols.fs_service_protocol import (
    FileMetadata,
    FSServiceProtocol,
)
from server.services.core.sqlite_db_service import DBService


@inject(alias=FSServiceProtocol)
class LocalFSService(FSServiceProtocol):
    def __init__(
        self, APP_DIR: Path, db_service: DBService
    ):
        self.logger = logging.getLogger(__name__)
        self._FILE_DIR = APP_DIR / "files"
        self._db_service = db_service
        if not self._FILE_DIR.exists():
            self.logger.info(
                f"File directory {self._FILE_DIR} does not exist. Creating..."
            )
            self._FILE_DIR.mkdir()

    def upload_file(
        self,
        name: str,
        content: bytes,
        uuid: str | None = None,
        allow_overwrite: bool = False,
    ) -> FileMetadata:
        self.logger.info(f"Uploading file {name}")
        with self._db_service.get_session() as session:
            file_uuid = (
                uuid if uuid is not None else uuid4().hex
            )
            file_path = self._FILE_DIR / file_uuid
            stem, suffix = (
                name.rsplit(".", 1)
                if "." in name
                else (name, "")
            )
            file_hash = sha1(content).hexdigest()
            if file_path.exists():
                if not allow_overwrite:
                    raise ServerException(
                        f"File with UUID {file_uuid} already exists",
                        code=ErrCodes.FILE_EXISTS,
                    )
                file_path.unlink()
            model = FileMetadata(
                uuid=file_uuid,
                name=name,
                stem=stem,
                suffix=suffix,
                hash=file_hash,
            )
            session.merge(model.to_table())
            try:
                file_path.write_bytes(content)
            except Exception:
                session.rollback()
            else:
                session.commit()
            return model

    def delete_file_with_uuid(self, uuid: str) -> None:
        self.logger.info(f"Deleting file with UUID {uuid}")

        query = select(FileMetadataTable).filter(
            FileMetadataTable.uuid == uuid
        )

        delete_query = delete(FileMetadataTable).filter(
            FileMetadataTable.uuid == uuid
        )

        with self._db_service.get_session() as session:
            res = session.execute(query).first()

            if not res:
                raise ServerException(
                    f"File with UUID {uuid} does not exist",
                    code=ErrCodes.FILE_NOT_FOUND,
                )

            file_path = self._FILE_DIR / uuid

            if not file_path.exists():
                raise ServerException(
                    f"File with UUID {uuid} does not exist",
                    code=ErrCodes.FILE_NOT_FOUND,
                )
            file_path.unlink()
            session.execute(delete_query)
            session.commit()

    def download_file_with_uuid(self, uuid: str) -> bytes:
        self.logger.info(
            f"Downloading file with UUID {uuid}"
        )

        query = (
            select(FileMetadataTable)
            .filter(FileMetadataTable.uuid == uuid)
            .limit(1)
        )
        with self._db_service.get_session() as session:
            res: Row[Tuple[FileMetadataTable]] | None = (
                session.execute(query).first()
            )

            if not res:
                raise ServerException(
                    f"File with UUID {uuid} does not exist",
                    code=ErrCodes.FILE_NOT_FOUND,
                )

            table_hash = res.tuple()[0].hash
            file_path = self._FILE_DIR / uuid
            if (
                table_hash
                != sha1(file_path.read_bytes()).hexdigest()
            ):
                raise ServerException(
                    f"File with UUID {uuid} is corrupted, please delete and re-upload",
                    code=ErrCodes.FILE_CORRUPTED,
                )

            if not file_path.exists():
                raise ServerException(
                    f"File with UUID {uuid} does not exist",
                    code=ErrCodes.FILE_NOT_FOUND,
                )

        return file_path.read_bytes()


__all__ = ["LocalFSService"]
