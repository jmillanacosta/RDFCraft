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

from models.file_document import FileDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)


from services.file_service import FileService

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


FileServiceDep = Annotated[
    FileService,
    Depends(lambda: di[FileService]),
]


router = APIRouter()


@router.get("/{file_id}")
async def get_file_document(
    file_id: str,
    file_service: FileServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator", "reader"],
        ),
    ],
) -> FileDocument:
    result = await file_service.get_file_document(file_id)
    if result is None:
        raise HTTPException(
            status_code=404, detail="File not found"
        )
    return result


@router.get("/{file_id}/download")
async def download_file(
    file_id: str,
    file_service: FileServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator", "reader"],
        ),
    ],
) -> FileResponse:
    document = await file_service.get_file_document(file_id)
    if document is None:
        raise HTTPException(
            status_code=404, detail="File not found"
        )
    return FileResponse(
        path=document.path,
        filename="f{document.name}.{document.extension}",
        media_type="application/octet-stream",  # TODO: create a ext->mime type map
    )


@router.post("/upload")
async def upload_file(
    file_service: FileServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=[
                "admin",
            ],
        ),
    ],
    file: UploadFile = File(...),
) -> FileDocument:
    if file.filename is None:
        raise HTTPException(
            status_code=400, detail="No file name provided"
        )
    bytes = await file.read()
    filename, extension = file.filename.rsplit(".", 1)
    return await file_service.create_file(
        name=filename, extension=extension, bytes=bytes
    )
