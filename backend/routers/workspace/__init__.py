#### AUTH
from typing import Annotated, List

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Security,
    UploadFile,
)
from fastapi.security import OAuth2PasswordBearer
from kink import di
from pydantic import BaseModel

from models.prefix_document import PrefixDocument
from models.workspace_document import WorkspaceDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
from services.workspace_service import WorkspaceService

AuthServiceDep = Annotated[
    AuthenticationService,
    Depends(lambda: di[AuthenticationService]),
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def verify_token(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
) -> JWTData:
    return await auth_service.verify_token(token)


###


router = APIRouter()

WorkspaceServiceDep = Annotated[
    WorkspaceService,
    Depends(lambda: di[WorkspaceService]),
]


@router.get("/")
async def get_all_workspaces(
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> List[WorkspaceDocument]:
    return await workspace_service.get_workspaces()


@router.get("/{workspace_id}")
async def get_workspace(
    workspace_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.get_workspace(
        workspace_id
    )


@router.post("/")
async def create_workspace(
    name: str,
    description: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.create_workspace(
        name, description
    )


@router.put("/{workspace_id}")
async def update_workspace(
    workspace_id: str,
    name: str,
    description: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.update_workspace(
        workspace_id, name, description
    )


@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.delete_workspace(
        workspace_id
    )


@router.post("/{workspace_id}/mapping")
async def create_mapping(
    workspace_id: str,
    name: str,
    description: str,
    workspace_service: WorkspaceServiceDep,
    file: UploadFile = File(...),
    json_path: str = "",
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No file provided",
        )
    file_name, file_extension = file.filename.rsplit(".", 1)
    file_bytes = await file.read()
    return await workspace_service.add_mapping_to_workspace(
        workspace_id,
        name,
        description,
        file_name,
        file_extension,
        json_path,
        file_bytes,
    )


@router.delete("/{workspace_id}/mapping/{mapping_id}")
async def delete_mapping(
    workspace_id: str,
    mapping_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.delete_mapping_from_workspace(
        workspace_id, mapping_id
    )


@router.post("/{workspace_id}/prefix/")
async def add_prefix(
    workspace_id: str,
    prefix: str,
    uri: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.add_prefix_to_workspace(
        workspace_id, prefix, uri
    )


@router.delete("/{workspace_id}/prefix/{prefix_id}")
async def delete_prefix(
    workspace_id: str,
    prefix_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    return await workspace_service.delete_prefix_from_workspace(
        workspace_id, prefix_id
    )


@router.get("/{workspace_id}/prefix/unassigned")
async def get_unassigned_prefixes(
    workspace_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
) -> List[PrefixDocument]:
    return await workspace_service.get_unassigned_prefixes(
        workspace_id
    )


@router.post("/{workspace_id}/ontology/")
async def add_ontology(
    workspace_id: str,
    prefix_id: str,
    name: str,
    description: str,
    workspace_service: WorkspaceServiceDep,
    file: UploadFile = File(...),
    auth: JWTData = Security(verify_token),
) -> WorkspaceDocument:
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No file provided",
        )
    file_name, file_extension = file.filename.rsplit(".", 1)
    file_bytes = await file.read()
    return (
        await workspace_service.add_ontology_to_workspace(
            workspace_id,
            name,
            description,
            prefix_id,
            file_name,
            file_extension,
            file_bytes,
        )
    )


@router.delete("/{workspace_id}/ontology/{ontology_id}")
async def delete_ontology(
    workspace_id: str,
    ontology_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
):
    return await workspace_service.delete_ontology_from_workspace(
        workspace_id, ontology_id
    )


@router.post(
    "/{workspace_id}/ontology/{ontology_id}/assign-prefix"
)
async def assign_prefix(
    workspace_id: str,
    ontology_id: str,
    prefix_id: str,
    workspace_service: WorkspaceServiceDep,
    auth: JWTData = Security(verify_token),
):
    return (
        await workspace_service.assign_prefix_to_ontology(
            workspace_id, ontology_id, prefix_id
        )
    )
