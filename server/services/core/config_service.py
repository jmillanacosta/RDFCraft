from kink import inject
from sqlalchemy import delete

from server.services.core.sqlite_db_service import DBService
from server.services.core.sqlite_db_service.tables.config import (
    ConfigTable,
)


@inject
class ConfigService:
    def __init__(self, db_service: DBService):
        self._db_service = db_service

    def get(self, key: str) -> str | None:
        with self._db_service.get_session() as session:
            result: ConfigTable | None = session.get(
                ConfigTable, key
            )
            return result.value if result else None

    def set(self, key: str, value: str):
        with self._db_service.get_session() as session:
            session.merge(ConfigTable(key=key, value=value))
            session.commit()

    def delete(self, key: str):
        with self._db_service.get_session() as session:
            item = session.get(ConfigTable, key)
            if not item:
                return
            session.execute(
                delete(ConfigTable).where(
                    ConfigTable.key == key
                )
            )
            session.commit()


__all__ = ["ConfigService"]
