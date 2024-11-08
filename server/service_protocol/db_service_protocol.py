from typing import Protocol

from sqlalchemy import Engine
from sqlalchemy.orm.session import Session


class DBService(Protocol):
    def get_engine(self) -> Engine: ...

    def get_session(self) -> Session: ...

    def dispose(self): ...
