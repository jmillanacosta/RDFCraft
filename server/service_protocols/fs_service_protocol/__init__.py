from abc import ABC, abstractmethod
from pathlib import Path

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

    @abstractmethod
    def provide_file_path_of_uuid(self, uuid: str) -> Path:
        """
        Provide the path of a file with UUID. If file does not exist locally, implementation should first download it.

        Args:
            uuid (str): UUID of the file

        Returns:
            pathlib.Path: path of the file
        """

    @abstractmethod
    def get_file_metadata_by_uuid(self, uuid: str) -> FileMetadata:
        """
        Get file metadata by UUID

        Args:
            uuid (str): UUID of the file

        Returns:
            FileMetadata: metadata of the file
        """
        ...
