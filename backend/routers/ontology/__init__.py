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

from models.ontology_document import OntologyClassDocument, OntologyDocument, OntologyIndividualModel, OntologyPropertyDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
from services.ontology_service import OntologyService
from services.prefix_service import PrefixService

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


OntologyServiceDep = Annotated[
    OntologyService, Depends(lambda: di[OntologyService])
]


router = APIRouter()


@router.get("/{ontology_id}")
async def get_ontologies(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> OntologyDocument:
    result = await ontology_service.get_ontology_by_id(
        ontology_id
    )
    return result


@router.post("/")
async def create_ontology(
    ontology_service: OntologyServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
    name: str,
    description: str,
    prefix_id: str,
    file: UploadFile = File(...),
) -> OntologyDocument:
    if file.filename is None:
        raise HTTPException(
            status_code=400,
            detail="No filename provided",
        )

    file_name, file_extension = file.filename.rsplit(".", 1)
    bytes = await file.read()

    result = await ontology_service.upload_ontology(
        file_name,
        file_extension,
        bytes,
        name,
        description,
        prefix_id,
    )
    return result


@router.get("/{ontology_id}/file/download")
async def download_ontology_file(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> FileResponse:
    result = await ontology_service.get_ontology_by_id(
        ontology_id
    )
    return FileResponse(
        result.file.path,  # type: ignore
        filename="f{result.file.name}.{result.file.extension}",
        media_type="application/octet-stream",
    )


@router.get("/{ontology_id}/classes")
async def get_ontology_classes(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> List[OntologyClassDocument]:
    result = await ontology_service.get_ontology_classes(
        ontology_id
    )
    return result


@router.get("/{ontology_id}/properties")
async def get_ontology_data_properties(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> List[OntologyPropertyDocument]:
    result = await ontology_service.get_ontology_properties(
        ontology_id
    )
    return result


@router.get("/{ontology_id}/individuals")
async def get_ontology_individuals(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> List[OntologyIndividualModel]:
    result = (
        await ontology_service.get_ontology_individuals(
            ontology_id
        )
    )
    return result


@router.delete("/{ontology_id}")
async def delete_ontology(
    ontology_service: OntologyServiceDep,
    ontology_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> OntologyDocument:
    result = await ontology_service.delete_ontology(
        ontology_id
    )
    return result
