from typing import Protocol

from kink import inject

from server.services.db_service import DBService
from server.services.db_service.tables.config import Config


class ConfigService(Protocol):

    def get(self, key: str) -> str | None: ...

    def set(self, key: str, value: str): ...

    def delete(self, key: str): ...


@inject(alias=ConfigService)
class _ConfigService:
    def __init__(self, db_service: DBService):
        self._db_service = db_service

    def get(self, key: str) -> str | None:
        with self._db_service.get_session() as session:
            result: Config | None = session.get(Config, key)
            return result.value if result else None

    def set(self, key: str, value: str):
        with self._db_service.get_session() as session:
            session.merge(Config(key=key, value=value))
            session.commit()

    def delete(self, key: str):
        with self._db_service.get_session() as session:
            session.delete(session.get(Config, key))
            session.commit()
