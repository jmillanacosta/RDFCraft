import unittest
from pathlib import Path
from unittest.mock import patch

from server.services.core.sqlite_db_service import DBService


class TestDBServiceInit(unittest.TestCase):
    @patch(
        "server.services.core.sqlite_db_service.create_engine"
    )
    @patch(
        "server.services.core.sqlite_db_service.Base.metadata.create_all"
    )
    def test_init(
        self, mock_create_all, mock_create_engine
    ):
        # Arrange
        app_dir = Path("/fake/path")
        expected_db_path = f"sqlite:///{(app_dir / 'data' / 'db.sqlite').absolute()}"

        # Act
        db_service = DBService(APP_DIR=app_dir)

        # Assert
        self.assertEqual(
            db_service._db_path, expected_db_path
        )
        mock_create_engine.assert_called_once_with(
            expected_db_path
        )
        mock_create_all.assert_called_once_with(
            mock_create_engine.return_value
        )


if __name__ == "__main__":
    unittest.main()
