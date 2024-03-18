import hashlib
import logging
from pathlib import Path
from fastapi import HTTPException
from kink import inject

from models.file_document import FileDocument


@inject
class FileService:
    def __init__(self, file_storage: Path):
        self.logger = logging.getLogger(__name__)
        self.file_storage = file_storage

    async def create_file(
        self, name: str, extension: str, bytes: bytes
    ) -> FileDocument:
        self.logger.info(
            f"Creating file {name} with mime type {extension}"
        )
        # Calculate md5 hash
        md5 = hashlib.md5(bytes).hexdigest()

        byte_size = len(bytes)

        # Create document

        document = FileDocument(
            name=name,
            byte_size=byte_size,
            extension=extension,
            md5=md5,
            path=Path("/dev/null"),
        )

        document = await FileDocument.insert_one(document)

        if document is None:
            self.logger.error(f"File {name} not created")
            raise HTTPException(
                status_code=500,
                detail=f"File {name} not created",
            )

        # Create final path

        path = (
            self.file_storage
            / str(document.id)
            / f"{name}.{extension}"
        )

        # Save file

        path.parent.mkdir(parents=True, exist_ok=True)

        with open(path, "wb") as file:
            file.write(bytes)

        self.logger.info(f"File {name} on path {path}")

        # Update document path

        document.path = path

        document = await FileDocument.replace(document)

        if document is None:
            self.logger.error(f"File {name} not updated")
            self.logger.error(
                f"Removing entries for file {name}"
            )

            await FileDocument.delete(
                FileDocument.id == document.id
            )
            path.unlink()

            raise HTTPException(
                status_code=500,
                detail=f"File {name} not updated",
            )

        self.logger.info(f"File {name} created")
        return document

    async def get_file_document(self, file_id: str) -> FileDocument:
        self.logger.info(f"Getting file {file_id}")

        document = await FileDocument.get(file_id)

        if document is None:
            self.logger.error(f"File {file_id} not found")
            raise HTTPException(
                status_code=404,
                detail=f"File {file_id} not found",
            )

        self.logger.info(f"File {file_id} found")
        return document

    async def get_file(self, file_id: str) -> bytes:
        self.logger.info(f"Getting file {file_id}")

        document: FileDocument | None = (
            await FileDocument.get(file_id)
        )

        if document is None:
            self.logger.error(f"File {file_id} not found")
            raise HTTPException(
                status_code=404,
                detail=f"File {file_id} not found",
            )

        self.logger.info(f"File {file_id} found")
        return document.path.read_bytes()

    async def delete_file(self, file_id: str) -> FileDocument:
        # TODO: Add Reference counting to avoid deleting files that are still in use
        self.logger.info(f"Deleting file {file_id}")

        document = await FileDocument.get(file_id)

        if document is None:
            self.logger.error(f"File {file_id} not found")
            raise HTTPException(
                status_code=404,
                detail=f"File {file_id} not found",
            )

        await FileDocument.delete(document)

        document.path.unlink()

        self.logger.info(f"File {file_id} deleted")
        return document
