import unittest
from unittest.mock import MagicMock, patch

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.services.core.sqlite_db_service import DBService
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceMetadataTable,
    WorkspaceType,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataService,
)


class TestWorkspaceMetadataService(unittest.TestCase):
    def setUp(self):
        self.db_service = MagicMock(spec=DBService)
        self.service = WorkspaceMetadataService(
            self.db_service
        )

    @patch(
        "server.services.core.workspace_metadata_service.uuid4"
    )
    def test_create_workspace_metadata(self, mock_uuid4):
        mock_uuid4.return_value.hex = "test-uuid"
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock

        self.service.create_workspace_metadata(
            name="Test Workspace",
            description="Test Description",
            type=WorkspaceType.LOCAL,
            location="/test/location",
        )

        session_mock.add.assert_called_once()
        session_mock.commit.assert_called_once()

    def test_get_workspaces(self):
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock
        session_mock.query.return_value.all.return_value = []

        result = self.service.get_workspaces()

        self.assertEqual(result, [])
        session_mock.query.assert_called_once_with(
            WorkspaceMetadataTable
        )

    def test_update_workspace_metadata(self):
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = WorkspaceMetadataTable(
            uuid="test-uuid"
        )

        self.service.update_workspace_metadata(
            uuid="test-uuid",
            name="Updated Name",
            description="Updated Description",
        )

        session_mock.commit.assert_called_once()

    def test_update_workspace_metadata_not_found(self):
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = None

        with self.assertRaises(ServerException) as context:
            self.service.update_workspace_metadata(
                uuid="test-uuid",
                name="Updated Name",
                description="Updated Description",
            )

        self.assertEqual(
            context.exception.code,
            ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
        )

    def test_delete_workspace_metadata(self):
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = WorkspaceMetadataTable(
            uuid="test-uuid"
        )

        self.service.delete_workspace_metadata(
            uuid="test-uuid"
        )

        session_mock.execute.assert_called()
        session_mock.commit.assert_called_once()

    def test_delete_workspace_metadata_not_found(self):
        session_mock = MagicMock()
        self.db_service.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = None

        with self.assertRaises(ServerException) as context:
            self.service.delete_workspace_metadata(
                uuid="test-uuid"
            )

        self.assertEqual(
            context.exception.code,
            ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
        )


if __name__ == "__main__":
    unittest.main()
