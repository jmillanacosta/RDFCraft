from typing import Annotated
from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Security,
    UploadFile,
)
from fastapi.responses import FileResponse
from fastapi.security import (
    OAuth2PasswordBearer,
)
from kink import di
from pydantic import BaseModel

from models.mapping_document import (
    EdgeModel,
    MappingDocument,
    MappingModel,
    NodeModel,
)
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)


from services.file_service import FileService
from services.mapping_service import MappingService

#### AUTH
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

MappingServiceDep = Annotated[
    MappingService,
    Depends(lambda: di[MappingService]),
]


@router.post("/")
async def create_mapping(
    mapping_service: MappingServiceDep,
    name: str,
    description: str,
    file: UploadFile = File(...),
    auth: JWTData = Security(verify_token),
) -> MappingDocument:
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No file name provided",
        )
    file_name, file_extension = file.filename.rsplit(".", 1)
    file_bytes = await file.read()
    mapping = await mapping_service.create_mapping(
        name,
        description,
        file_name,
        file_extension,
        file_bytes,
    )
    return mapping


@router.get("/{mapping_id}")
async def get_mapping(
    mapping_service: MappingServiceDep,
    mapping_id: str,
    auth: JWTData = Security(verify_token),
) -> MappingDocument:
    mapping = await mapping_service.get_mapping(mapping_id)
    return mapping


@router.post("/{mapping_id}/revert/{mapping_model_id}")
async def revert_mapping(
    mapping_service: MappingServiceDep,
    mapping_id: str,
    mapping_model_id: str,
    auth: JWTData = Security(verify_token),
) -> MappingDocument:
    mapping = await mapping_service.revert_mapping(
        mapping_id, mapping_model_id
    )
    return mapping


class SaveRequest(BaseModel):
    nodes: list[NodeModel]
    edges: list[EdgeModel]


@router.post("/{mapping_id}/save")
async def save_mapping(
    mapping_service: MappingServiceDep,
    mapping_id: str,
    data: SaveRequest,
    auth: JWTData = Security(verify_token),
) -> MappingDocument:
    mapping = await mapping_service.save_mapping(
        mapping_id=mapping_id,
        node_data=data.nodes,
        edge_data=data.edges,
    )
    return mapping


@router.delete("/{mapping_id}")
async def delete_mapping(
    mapping_service: MappingServiceDep,
    mapping_id: str,
    auth: JWTData = Security(verify_token),
) -> dict[str, str]:
    await mapping_service.delete_mapping(mapping_id)
    return {"status": "ok"}


