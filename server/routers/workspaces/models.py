from pydantic import Base64Str, BaseModel, HttpUrl

from server.services.core.sqlite_db_service.tables.workspace_metadata import (
    WorkspaceType,
)


class CreateWorkspaceInput(BaseModel):
    name: str
    description: str
    type: WorkspaceType
    location: str = ""


class UpdateWorkspaceInput(BaseModel):
    name: str | None
    description: str | None


class CreatePrefixInput(BaseModel):
    prefix: str
    uri: HttpUrl


class CreateOntologyInput(BaseModel):
    name: str
    description: str
    base_uri: HttpUrl
    content: Base64Str
