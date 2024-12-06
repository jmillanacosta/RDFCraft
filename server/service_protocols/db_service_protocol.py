from abc import ABC, abstractmethod

from sqlalchemy import Engine
from sqlalchemy.orm.session import Session


class DBServiceProtocol(ABC):
    @abstractmethod
    def get_engine(self) -> Engine: ...

    @abstractmethod
    def get_session(self) -> Session: ...

    @abstractmethod
    def dispose(self): ...
