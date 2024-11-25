from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class PluginUIElement(Base):
    """
    Table for plugin UI elements.

    Attributes:
        - id - int
        - plugin_id - int - id of the plugin
        - inject_point - str - point in the UI where the element should be injected
        - uri - str - URI of the element
    """

    __tablename__ = "plugin_ui_element"

    uuid: Mapped[int] = mapped_column(
        String, primary_key=True
    )
    plugin_id: Mapped[String] = mapped_column(
        String,
        ForeignKey("plugin.id", ondelete="CASCADE"),
        nullable=False,
    )
