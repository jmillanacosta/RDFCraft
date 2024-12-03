from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class FileMetadataTable(Base):
    __tablename__ = "file_metadata"

    uuid: Mapped[str] = mapped_column(
        String, primary_key=True
    )
    name: Mapped[str] = mapped_column(String)
    stem: Mapped[str] = mapped_column(String)
    suffix: Mapped[str] = mapped_column(String)
    hash: Mapped[str] = mapped_column(String, index=True)

    def __repr__(self):
        return f"<FileMetadata(uuid={self.uuid}, name={self.name}, stem={self.stem}, suffix={self.suffix}, hash={self.hash})>"

    def __str__(self):
        return self.__repr__()
