from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class ConfigTable(Base):
    __tablename__ = "config"

    key: Mapped[str] = mapped_column(
        String, primary_key=True
    )
    value: Mapped[str] = mapped_column(String)

    def __repr__(self):
        return (
            f"<Config(key={self.key}, value={self.value})>"
        )

    def __str__(self):
        return self.__repr__()
