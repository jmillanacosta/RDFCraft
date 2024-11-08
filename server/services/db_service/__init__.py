from pathlib import Path

from kink import inject
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.session import Session

from server.service_protocol.db_service_protocol import DBService
from server.services.db_service.base import Base


@inject(alias=DBService)
class _DBService:
    def __init__(self, APP_DIR: Path):
        self._db_path = APP_DIR / "db.sqlite3"
        self._engine = create_engine(
            f"sqlite:///{self._db_path}",
        )
        Base.metadata.create_all(self._engine)

    def get_engine(self) -> Engine:
        return self._engine

    def get_session(self) -> Session:
        return sessionmaker(bind=self._engine)()

    def dispose(self):
        self._engine.dispose()
