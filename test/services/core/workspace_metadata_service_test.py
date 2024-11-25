import unittest
from unittest.mock import MagicMock

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.service_protocols.workspace_metadata_service_protocol.models import (
    WorkspaceMetadataModel,
)
from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceType,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataService,
)


class TestWorkspaceMetadataService(unittest.TestCase):
    def setUp(self):
        self.db_service_mock = MagicMock()
        self.workspace_metadata_service = (
            WorkspaceMetadataService(self.db_service_mock)
        )
        self.workspace_metadata_model = (
            WorkspaceMetadataModel(
                uuid="uuid",
                name="name",
                description="description",
                type=WorkspaceType.LOCAL,
                location="location",
                enabled_features=["feature1", "feature2"],
            )
        )
        self.workspace_metadata_model_table = (
            self.workspace_metadata_model.to_table()
        )

    def test_get_workspaces(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.query.return_value.all.return_value = [
            self.workspace_metadata_model_table
        ]

        result = (
            self.workspace_metadata_service.get_workspaces()
        )

        self.assertEqual(len(result), 1)
        self.db_service_mock.get_session.assert_called_once()
        session_mock.query.assert_called_once()
        session_mock.query.return_value.all.assert_called_once()

    def test_create_workspace_metadata(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock

        self.workspace_metadata_service.create_workspace_metadata(
            self.workspace_metadata_model
        )

        self.db_service_mock.get_session.assert_called_once()
        session_mock.add.assert_called_once()
        session_mock.commit.assert_called_once()

    def test_update_workspace_metadata_success(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = self.workspace_metadata_model

        self.workspace_metadata_service.update_workspace_metadata(
            "uuid", self.workspace_metadata_model
        )

        self.db_service_mock.get_session.assert_called_once()
        session_mock.execute.assert_called_once()
        session_mock.merge.assert_called_once()
        session_mock.commit.assert_called_once()

    def test_update_workspace_metadata_not_found(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = None

        with self.assertRaises(ServerException) as context:
            self.workspace_metadata_service.update_workspace_metadata(
                "uuid", self.workspace_metadata_model
            )

        self.assertEqual(
            context.exception.code,
            ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
        )
        self.db_service_mock.get_session.assert_called_once()
        session_mock.execute.assert_called_once()

    def test_update_workspace_metadata_illegal_update(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = self.workspace_metadata_model
        self.workspace_metadata_model.uuid = (
            "different_uuid"
        )

        with self.assertRaises(ServerException) as context:
            self.workspace_metadata_service.update_workspace_metadata(
                "uuid", self.workspace_metadata_model
            )

        self.assertEqual(
            context.exception.code,
            ErrCodes.WORKSPACE_METADATA_ILLEGAL_UPDATE_OPERATION,
        )
        self.db_service_mock.get_session.assert_called_once()
        session_mock.execute.assert_called_once()

    def test_delete_workspace_metadata_success(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = self.workspace_metadata_model

        self.workspace_metadata_service.delete_workspace_metadata(
            "uuid"
        )

        self.db_service_mock.get_session.assert_called_once()
        session_mock.execute.assert_called_once()
        session_mock.delete.assert_called_once()
        session_mock.commit.assert_called_once()

    def test_delete_workspace_metadata_not_found(self):
        session_mock = MagicMock()
        self.db_service_mock.get_session.return_value.__enter__.return_value = session_mock
        session_mock.execute.return_value.one_or_none.return_value = None

        with self.assertRaises(ServerException) as context:
            self.workspace_metadata_service.delete_workspace_metadata(
                "uuid"
            )

        self.assertEqual(
            context.exception.code,
            ErrCodes.WORKSPACE_METADATA_NOT_FOUND,
        )
        self.db_service_mock.get_session.assert_called_once()
        session_mock.execute.assert_called_once()


if __name__ == "__main__":
    unittest.main()
