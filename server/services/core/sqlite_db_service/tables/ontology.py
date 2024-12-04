from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class OntologyTable(Base):
    __tablename__ = "ontology"

    uuid: Mapped[str] = mapped_column(
        String, primary_key=True
    )
    name: Mapped[str] = mapped_column(String)
    json_file_uuid: Mapped[str] = mapped_column(String)
    ontology_file_uuid: Mapped[str] = mapped_column(String)
