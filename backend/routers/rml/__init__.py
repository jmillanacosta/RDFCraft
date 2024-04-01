from typing import Annotated, List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Security,
)
from fastapi.security import OAuth2PasswordBearer
from kink import di

from models.prefix_document import PrefixDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
from services.prefix_service import PrefixService
from services.yarrrml_service import YarrrmlService

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


YarrrmlServiceDep = Annotated[
    YarrrmlService, Depends(lambda: di[YarrrmlService])
]

router = APIRouter()


@router.get("/{workspace_id}/{mapping_id}")
async def start_mapping(
    workspace_id: str,
    mapping_id: str,
    yarrrml_service: YarrrmlServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> dict:
    result = await yarrrml_service.complete_mapping(
        workspace_id, mapping_id
    )
    return result
