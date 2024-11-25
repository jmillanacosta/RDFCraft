import logging
from hashlib import sha1
from pathlib import Path
from uuid import uuid4

from kink import inject

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocols.fs_service_protocol import (
    FileMetadata,
)


@inject
class LocalFSService:
    def __init__(self, APP_DIR: Path):
        self.logger = logging.getLogger(__name__)
        self._FILE_DIR = APP_DIR / "files"
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
    ) -> FileMetadata:
        self.logger.info(f"Uploading file {name}")
        file_uuid = uuid if uuid else str(uuid4())
        file_path = self._FILE_DIR / file_uuid
        stem, suffix = (
            name.rsplit(".", 1)
            if "." in name
            else (name, "")
        )
        file_hash = sha1(content).hexdigest()
        file_path.write_bytes(content)

        return FileMetadata(
            uuid=file_uuid,
            name=name,
            stem=stem,
            suffix=suffix,
            hash=file_hash,
        )

    def delete_file_with_uuid(self, uuid: str) -> None:
        self.logger.info(f"Deleting file with UUID {uuid}")
        file_path = self._FILE_DIR / uuid

        if not file_path.exists():
            raise ServerException(
                f"File with UUID {uuid} does not exist",
                code=ErrCodes.FILE_NOT_FOUND,
            )

        file_path.unlink()

    def download_file_with_uuid(self, uuid: str) -> bytes:
        self.logger.info(
            f"Downloading file with UUID {uuid}"
        )
        file_path = self._FILE_DIR / uuid

        if not file_path.exists():
            raise ServerException(
                f"File with UUID {uuid} does not exist",
                code=ErrCodes.FILE_NOT_FOUND,
            )

        return file_path.read_bytes()

    def download_file_with_metadata(
        self, metadata: FileMetadata
    ) -> bytes:
        self.logger.info(
            f"Downloading file with metadata {metadata}"
        )
        file_path = self._FILE_DIR / metadata.uuid

        if not file_path.exists():
            raise ServerException(
                f"File with metadata {metadata} does not exist",
                code=ErrCodes.FILE_NOT_FOUND,
            )

        # Compare hashes

        stored_hash = sha1(
            file_path.read_bytes()
        ).hexdigest()

        if stored_hash != metadata.hash:
            raise ServerException(
                f"File with metadata {metadata} is corrupted, please delete and re-upload",
                code=ErrCodes.FILE_CORRUPTED,
            )

        return file_path.read_bytes()


__all__ = ["LocalFSService"]
