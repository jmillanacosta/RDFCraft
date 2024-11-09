
from pathlib import Path
from typing import Protocol

from server.service_protocol.fs_service_protocol.models import Directory


class FSService(Protocol):

    def ls_app_dir(self) -> Directory:
        """
        List files and directories in the APP_DIR
        """
        ...

    def ls(self, path: Path) -> Directory:
        """
        List files and directories in a directory
        """
        ...

    def cat(self, path: Path) -> str:
        """
        Read a file as a string
        """
        ...

    def echo_to_file(self, path: Path, content: str) -> None:
        """
        Write string content to a file
        """
        ...

    def read_file(self, path: Path) -> bytes:
        """
        Read a file as bytes
        """
        ...

    def write_file(self, path: Path, content: bytes) -> None:
        """
        Write bytes content to a file
        """
        ...

    def mkdir(self, path: Path) -> None:
        """
        Create a directory
        """
        ...

    def rm(self, path: Path) -> None:
        """
        Remove a file or directory
        """
        ...

    def mv(self, src: Path, dest: Path) -> None:
        """
        Move a file or directory
        """
        ...

    def cp(self, src: Path, dest: Path) -> None:
        """
        Copy a file or directory
        """
        ...

    def touch(self, path: Path) -> None:
        """
        Create a file
        """
        ...

    def exists(self, path: Path) -> bool:
        """
        Check if a file or directory exists
        """
        ...


__all__ = [
    "FSService",
    "Directory",
]
