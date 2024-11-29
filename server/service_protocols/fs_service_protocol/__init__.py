from typing import Protocol

from server.models.file_metadata import (
    FileMetadata,
)


class FSServiceProtocol(Protocol):
    def upload_file(
        self,
        name: str,
        content: bytes,
        uuid: str | None = None,
    ) -> FileMetadata:
        """
        Upload a file

        Args:
            name (str): name of the file with extension
            content (bytes): content of the file
            uuid (str | None): UUID of the file, defaults to None. If None, a new UUID will be generated

        Returns:
            FileMetadata: metadata of the file
        """
        ...

    def delete_file_with_uuid(self, uuid: str) -> None:
        """
        Delete a file with UUID

        Args:
            uuid (str): UUID of the file
        """
        ...

    def download_file_with_uuid(self, uuid: str) -> bytes:
        """
        Download a file with UUID

        Args:
            uuid (str): UUID of the file

        Returns:
            bytes: content of the file
        """
        ...
