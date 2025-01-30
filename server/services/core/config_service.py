import logging

from kink import inject
from sqlalchemy import delete

from server.service_protocols.config_service_protocol import (
    ConfigServiceProtocol,
)
from server.services.core.sqlite_db_service import DBService
from server.services.core.sqlite_db_service.tables.config import (
    ConfigTable,
)


@inject(alias=ConfigServiceProtocol)
class ConfigService(ConfigServiceProtocol):
    def __init__(self, db_service: DBService):
        self.logger = logging.getLogger(__name__)
        self._db_service = db_service

        self.logger.info("ConfigService initialized")

    def get(self, key: str) -> str | None:
        self.logger.info(f"Getting config: {key}")
        with self._db_service.get_session() as session:
            result: ConfigTable | None = session.get(ConfigTable, key)
            self.logger.info(f"Got config {key}: {result}")
            return result.value if result else None

    def set(self, key: str, value: str):
        self.logger.info(f"Setting config: {key} to {value}")
        with self._db_service.get_session() as session:
            session.merge(ConfigTable(key=key, value=value))
            session.commit()

        self.logger.info(f"Set config {key} to {value}")

    def delete(self, key: str):
        self.logger.info(f"Deleting config: {key}")
        with self._db_service.get_session() as session:
            item = session.get(ConfigTable, key)
            if not item:
                self.logger.info(f"Config {key} not found, ignoring delete")
                return
            session.execute(delete(ConfigTable).where(ConfigTable.key == key))
            session.commit()

        self.logger.info(f"Deleted config {key}")


__all__ = ["ConfigService"]
