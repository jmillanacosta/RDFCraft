from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class PluginTable(Base):
    """
    Table for plugin metadata.

    Attributes:
        - name - str
        - description - str
        - version - str
        - author - str
        - repository - str
        - license - str
        - access_name - str - name used when accessing the plugin
    """

    __tablename__ = "plugin"

    name: Mapped[str] = mapped_column(
        String, primary_key=True
    )
    description: Mapped[str] = mapped_column(
        String, nullable=True
    )
    version: Mapped[str] = mapped_column(String)
    repository: Mapped[str] = mapped_column(
        String, nullable=True
    )
    license: Mapped[str] = mapped_column(
        String, nullable=True
    )
    access_name: Mapped[str] = mapped_column(
        String, nullable=True
    )

    def __repr__(self):
        return f"<Plugin(name={self.name}, description={self.description}, version={self.version}, repository={self.repository}, license={self.license}, access_name={self.access_name})>"

    def __str__(self):
        return self.__repr__()
