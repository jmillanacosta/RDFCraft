from unittest import TestCase

from server.services.core.config_service import (
    ConfigService,
)
from test import create_in_memory_db_service


class ConfigServiceTestCases(TestCase):
    def setUp(self) -> None:
        self.db_service = create_in_memory_db_service()
        self.config_service = ConfigService(
            db_service=self.db_service
        )

    def tearDown(self) -> None:
        self.db_service.dispose()

    def test_get_none(self):
        self.assertIsNone(self.config_service.get("key"))

    def test_set_get(self):
        self.config_service.set("key", "value")
        self.assertEqual(
            "value", self.config_service.get("key")
        )

    def test_delete(self):
        self.config_service.set("key", "value")
        self.assertEqual(
            "value", self.config_service.get("key")
        )
        self.config_service.delete("key")
        self.assertIsNone(self.config_service.get("key"))
