from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel


class AuthorizationRecordModel(BaseModel):
    user_id: PydanticObjectId = Indexed(
        PydanticObjectId, unique=False
    )
    access_level: str


class AuthorizationDocument(Document):
    collection: str = Indexed(str, unique=False)
    object_id: PydanticObjectId = Indexed(
        PydanticObjectId, unique=False
    )
    records: list[AuthorizationRecordModel] = Indexed(
        list[AuthorizationRecordModel], unique=False
    )


__all__ = [
    "AuthorizationDocument",
    "AuthorizationRecordModel",
]
