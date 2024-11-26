import unittest
from hashlib import sha1
from pathlib import Path

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocols.fs_service_protocol import (
    FileMetadata,
)
from server.services.local.local_fs_service import (
    LocalFSService,
)


class TestLocalFSService(unittest.TestCase):
    def setUp(self):
        self.app_dir = Path("./tmp")
        if self.app_dir.exists():
            raise Exception(
                "The temporary directory already exists"
            )
        self.app_dir.mkdir(parents=True, exist_ok=True)
        self.service = LocalFSService(APP_DIR=self.app_dir)
        self.service._FILE_DIR = self.app_dir / "files"
        self.service._FILE_DIR.mkdir(
            parents=True, exist_ok=True
        )

    def tearDown(self):
        for file in self.service._FILE_DIR.iterdir():
            file.unlink()
        self.service._FILE_DIR.rmdir()
        self.app_dir.rmdir()

    def test_upload_file(self):
        name = "test.txt"
        content = b"Hello, World!"
        metadata = self.service.upload_file(name, content)

        self.assertEqual(metadata.name, name)
        self.assertEqual(metadata.stem, "test")
        self.assertEqual(metadata.suffix, "txt")
        self.assertEqual(
            metadata.hash, sha1(content).hexdigest()
        )
        self.assertTrue(
            (
                self.service._FILE_DIR / metadata.uuid
            ).exists()
        )

    def test_delete_file_with_uuid(self):
        name = "test.txt"
        content = b"Hello, World!"
        metadata = self.service.upload_file(name, content)

        self.service.delete_file_with_uuid(metadata.uuid)
        self.assertFalse(
            (
                self.service._FILE_DIR / metadata.uuid
            ).exists()
        )

    def test_delete_file_with_uuid_not_found(self):
        with self.assertRaises(ServerException) as context:
            self.service.delete_file_with_uuid(
                "nonexistent_uuid"
            )
        self.assertEqual(
            context.exception.code, ErrCodes.FILE_NOT_FOUND
        )

    def test_download_file_with_uuid(self):
        name = "test.txt"
        content = b"Hello, World!"
        metadata = self.service.upload_file(name, content)

        downloaded_content = (
            self.service.download_file_with_uuid(
                metadata.uuid
            )
        )
        self.assertEqual(downloaded_content, content)

    def test_download_file_with_uuid_not_found(self):
        with self.assertRaises(ServerException) as context:
            self.service.download_file_with_uuid(
                "nonexistent_uuid"
            )
        self.assertEqual(
            context.exception.code, ErrCodes.FILE_NOT_FOUND
        )

    def test_download_file_with_metadata(self):
        name = "test.txt"
        content = b"Hello, World!"
        metadata = self.service.upload_file(name, content)

        downloaded_content = (
            self.service.download_file_with_metadata(
                metadata
            )
        )
        self.assertEqual(downloaded_content, content)

    def test_download_file_with_metadata_not_found(
        self,
    ):
        metadata = FileMetadata(
            uuid="nonexistent_uuid",
            name="test.txt",
            stem="test",
            suffix="txt",
            hash="dummyhash",
        )
        with self.assertRaises(ServerException) as context:
            self.service.download_file_with_metadata(
                metadata
            )
        self.assertEqual(
            context.exception.code,
            ErrCodes.FILE_NOT_FOUND,
        )

    def test_download_file_with_metadata_corrupted(
        self,
    ):
        name = "test.txt"
        content = b"Hello, World!"
        metadata = self.service.upload_file(name, content)

        # Corrupt the file
        with open(
            self.service._FILE_DIR / metadata.uuid, "wb"
        ) as f:
            f.write(b"Corrupted content")

        with self.assertRaises(ServerException) as context:
            self.service.download_file_with_metadata(
                metadata
            )
        self.assertEqual(
            context.exception.code,
            ErrCodes.FILE_CORRUPTED,
        )


if __name__ == "__main__":
    unittest.main()
