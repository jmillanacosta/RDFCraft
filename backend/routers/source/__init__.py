from typing import Annotated, List
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

from models.source_document import SourceDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)

from services.source_service import SourceService

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

SourceServiceDep = Annotated[
    SourceService,
    Depends(lambda: di[SourceService]),
]


@router.get("/")
async def get_sources(
    source_service: SourceServiceDep,
    auth: JWTData = Security(verify_token),
) -> List[SourceDocument]:
    return await source_service.get_sources()


@router.get("/{source_id}")
async def get_source(
    source_id: str,
    source_service: SourceServiceDep,
    auth: JWTData = Security(verify_token),
) -> SourceDocument:
    return await source_service.get_source_by_id(source_id)


@router.post("/")
async def create_source(
    name: str,
    description: str,
    source_service: SourceServiceDep,
    file: UploadFile = File(...),
    auth: JWTData = Security(verify_token),
) -> SourceDocument:
    if file.filename is None:
        raise HTTPException(
            detail="File does not have a name",
            status_code=404,
        )

    file_name, file_extension = file.filename.rsplit(".", 1)
    file_bytes = await file.read()
    return await source_service.create_source(
        name=name,
        description=description,
        file_name=file_name,
        file_extension=file_extension,
        bytes=file_bytes,
    )


@router.get("/{source_id}/file")
async def get_source_file(
    source_id: str,
    source_service: SourceServiceDep,
    auth: JWTData = Security(verify_token),
) -> FileResponse:
    source = await source_service.get_source_by_id(
        source_id
    )
    return FileResponse(
        path=source.file.path,  # type: ignore
        media_type="application/octet-stream",
        filename="f{source.file.name}.{source.file.extension}",  # type: ignore
    )


@router.delete("/{source_id}")
async def remove_source(
    source_id: str,
    source_service: SourceServiceDep,
    auth: JWTData = Security(verify_token),
) -> SourceDocument:
    return await source_service.remove_source(source_id)


@router.put("/{source_id}")
async def update_source(
    source_id: str,
    name: str,
    description: str,
    source_service: SourceServiceDep,
    auth: JWTData = Security(verify_token),
) -> SourceDocument:
    return await source_service.update_source(
        source_id, name, description
    )


@router.put("/{source_id}/file")
async def update_source_file(
    source_id: str,
    source_service: SourceServiceDep,
    file: UploadFile = File(...),
    auth: JWTData = Security(verify_token),
) -> SourceDocument:
    if file.filename is None:
        raise HTTPException(
            detail="File does not have a name",
            status_code=404,
        )

    file_name, file_extension = file.filename.rsplit(".", 1)
    file_bytes = await file.read()
    return await source_service.update_source_file(
        source_id, file_name, file_extension, file_bytes
    )
