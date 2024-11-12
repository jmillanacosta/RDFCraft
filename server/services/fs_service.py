import logging
import shutil
from pathlib import Path

from kink import inject

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocol.fs_service_protocol import (
    Directory,
    FSService,
)


@inject(alias=FSService)
class _FSService:
    def __init__(self, APP_DIR: Path):
        self.logger = logging.getLogger(
            "rdfcraft.services.fs_service"
        )
        self._APP_DIR = APP_DIR

    def ls_app_dir(self) -> Directory:
        return self.ls(self._APP_DIR)

    def ls(self, path: Path) -> Directory:
        _path = self._is_dir_and_exists(path)
        all_items = list(_path.iterdir())
        files = [
            item for item in all_items if item.is_file()
        ]
        directories = [
            item for item in all_items if item.is_dir()
        ]

        return Directory(
            name=_path.name,
            path=_path,
            files=files,
            directories=directories,
        )

    def cat(self, path: Path) -> str:
        _path = self._is_file_and_exists(path)

        return _path.read_text()

    def echo_to_file(
        self, path: Path, content: str
    ) -> None:
        _path = self._is_file_and_exists(path)

        _path.write_text(content)

    def read_file(self, path: Path) -> bytes:
        _path = self._is_file_and_exists(path)

        return _path.read_bytes()

    def write_file(
        self, path: Path, content: bytes
    ) -> None:
        _path = self._is_file_and_exists(path)

        _path.write_bytes(content)

    def mkdir(self, path: Path) -> None:
        _path = self._check_path(path)

        if not _path.exists():
            _path.mkdir(parents=True)
        else:
            error_msg = f'Path "{path}" already exists'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DIR_EXISTS
            )

    def rm(self, path: Path) -> None:
        _path: Path = self._is_dir_and_exists(path)
        shutil.rmtree(_path)

    def mv(self, src: Path, dest: Path) -> None:
        _src = self._check_path(src)
        _dest = self._check_path(dest)

        if not _src.exists():
            error_msg = (
                f'Source path "{src}" does not exist'
            )
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DOES_NOT_EXIST
            )

        if _dest.exists():
            error_msg = (
                f'Destination path "{dest}" already exists'
            )
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DIR_EXISTS
            )

        _src.rename(_dest)

    def cp(self, src: Path, dest: Path) -> None:
        _src = self._check_path(src)
        _dest = self._check_path(dest)

        if not _src.exists():
            error_msg = (
                f'Source path "{src}" does not exist'
            )
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DOES_NOT_EXIST
            )

        if _dest.exists():
            error_msg = (
                f'Destination path "{dest}" already exists'
            )
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DIR_EXISTS
            )

        if _src.is_dir():
            shutil.copytree(_src, _dest)
        else:
            shutil.copy2(_src, _dest)

    def touch(self, path: Path) -> None:
        _path = self._check_path(path)

        if not _path.exists():
            _path.touch()
        else:
            error_msg = f'Path "{path}" already exists'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.FILE_EXISTS
            )

    def exists(self, path: Path) -> bool:
        _path = self._check_path(path)

        return _path.exists()

    def _check_path(self, path: Path):
        "Check if path is within APP_DIR"
        _abs_path = path.resolve()
        if not _abs_path.is_absolute():
            error_msg = (
                f'Given path "{path}" is not absolute'
            )
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DANGEROUS_PATH
            )

        if (
            _abs_path.parts[: len(self._APP_DIR.parts)]
            != self._APP_DIR.parts
        ):
            error_msg = f'Given path "{ path}" is not within APP_DIR which is "{self._APP_DIR}"'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DANGEROUS_PATH
            )

        return _abs_path

    def _is_file_and_exists(self, path: Path):
        _path = self._check_path(path)
        if not _path.exists():
            error_msg = f'Path "{path}" does not exist'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DOES_NOT_EXIST
            )
        if not _path.is_file():
            error_msg = f'Path "{path}" is not a file'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.NOT_A_FILE
            )
        return _path

    def _is_dir_and_exists(self, path: Path):
        _path = self._check_path(path)
        if not _path.exists():
            error_msg = f'Path "{path}" does not exist'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.DOES_NOT_EXIST
            )
        if not _path.is_dir():
            error_msg = f'Path "{path}" is not a directory'
            self.logger.error(error_msg)
            raise ServerException(
                error_msg, ErrCodes.NOT_A_DIR
            )
        return _path


__all__ = ["FSService"]
