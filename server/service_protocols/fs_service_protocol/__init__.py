from abc import ABC, abstractmethod

from server.models.file_metadata import (
    FileMetadata,
)


class FSServiceProtocol(ABC):
    @abstractmethod
    def upload_file(
        self,
        name: str,
        content: bytes,
        uuid: str | None = None,
        allow_overwrite: bool = False,
    ) -> FileMetadata:
        """
        Upload a file

        Args:
            name (str): name of the file with extension
            content (bytes): content of the file
            uuid (str | None): UUID of the file, defaults to None. If None, a new UUID will be generated
            allow_overwrite (bool): whether to allow overwriting the file, defaults to False

        Returns:
            FileMetadata: metadata of the file
        """
        ...

    @abstractmethod
    def delete_file_with_uuid(self, uuid: str) -> None:
        """
        Delete a file with UUID

        Args:
            uuid (str): UUID of the file
        """
        ...

    @abstractmethod
    def download_file_with_uuid(self, uuid: str) -> bytes:
        """
        Download a file with UUID

        Args:
            uuid (str): UUID of the file

        Returns:
            bytes: content of the file
        """
        ...
