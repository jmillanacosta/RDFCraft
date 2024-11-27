from pydantic import BaseModel

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
