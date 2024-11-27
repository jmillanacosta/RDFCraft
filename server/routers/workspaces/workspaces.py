from typing import Annotated

from fastapi.params import Depends
from fastapi.routing import APIRouter
from kink.container import di

from server.routers.models import BasicResponse
from server.routers.workspaces.models import (
    CreateWorkspaceInput,
    UpdateWorkspaceInput,
)
from server.services.core.workspace_metadata_service import (
    WorkspaceMetadataService,
)

router = APIRouter()

WorkspaceMetadataServiceDep = Annotated[
    WorkspaceMetadataService,
    Depends(lambda: di[WorkspaceMetadataService]),
]


@router.get("/")
async def get_workspaces(
    workspace_metadata_service: WorkspaceMetadataServiceDep,
):
    return workspace_metadata_service.get_workspaces()


@router.post("/")
async def create_workspace_metadata(
    input: CreateWorkspaceInput,
    workspace_metadata_service: WorkspaceMetadataServiceDep,
):
    workspace_metadata_service.create_workspace_metadata(
        name=input.name,
        description=input.description,
        type=input.type,
        location=input.location,
    )

    return BasicResponse(
        message="Workspace metadata created"
    )


@router.put("/{workspace_id}")
async def update_workspace_metadata(
    workspace_id: str,
    input: UpdateWorkspaceInput,
    workspace_metadata_service: WorkspaceMetadataServiceDep,
) -> BasicResponse:
    workspace_metadata_service.update_workspace_metadata(
        uuid=workspace_id,
        name=input.name,
        description=input.description,
    )

    return BasicResponse(
        message="Workspace metadata updated"
    )


@router.delete("/{workspace_id}")
async def delete_workspace_metadata(
    workspace_id: str,
    workspace_metadata_service: WorkspaceMetadataServiceDep,
) -> BasicResponse:
    workspace_metadata_service.delete_workspace_metadata(
        uuid=workspace_id,
    )

    return BasicResponse(
        message="Workspace metadata deleted"
    )
