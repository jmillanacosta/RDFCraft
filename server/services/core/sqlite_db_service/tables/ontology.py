from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from server.services.core.sqlite_db_service.base import (
    Base,
)


class OntologyTable(Base):
    __tablename__ = "ontology"

    uuid: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String)
    json_file_uuid: Mapped[str] = mapped_column(String)
    ontology_file_uuid: Mapped[str] = mapped_column(String)

    def to_dict(self):
        return {
            "uuid": self.uuid,
            "name": self.name,
            "json_file_uuid": self.json_file_uuid,
            "ontology_file_uuid": self.ontology_file_uuid,
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            uuid=data["uuid"],
            name=data["name"],
            json_file_uuid=data["json_file_uuid"],
            ontology_file_uuid=data["ontology_file_uuid"],
        )
