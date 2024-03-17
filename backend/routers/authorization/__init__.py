from typing import Annotated
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Security,
)
from fastapi.security import (
    OAuth2PasswordBearer,
)
from kink import di

from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
from services.authorization_service import (
    AuthorizationService,
)

#### AUTH
AuthServiceDep = Annotated[
    AuthenticationService,
    Depends(lambda: di[AuthenticationService]),
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def verify_token(
    token: Annotated[str, Depends(oauth2_scheme)],
    auth_service: AuthServiceDep,
):
    return await auth_service.verify_token(token)


###

AuthorizationServiceDep = Annotated[
    AuthorizationService,
    Depends(lambda: di[AuthorizationService]),
]

router = APIRouter()


@router.get("/{collection}/{document}")
async def get_authorization_document(
    auth_service: AuthorizationServiceDep,
    collection: str,
    document: str,
    current_user: Annotated[
        JWTData,
        Security(verify_token, scopes=["admin", "curator"]),
    ],
):
    result = await auth_service.get_resource(
        collection=collection, object_id=document
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail=f"Resource {collection}/{document} not found",
        )

    return result


@router.post(
    "/{collection}/{document}/add/{user_id}/{access_level}"
)
async def add_user_to_resource(
    auth_service: AuthorizationServiceDep,
    collection: str,
    document: str,
    user_id: str,
    access_level: str,
    current_user: Annotated[
        JWTData,
        Security(verify_token, scopes=["admin", "curator"]),
    ],
):
    result = await auth_service.authorize_user_for_resource(
        collection=collection,
        object_id=document,
        user_id=user_id,
        access_level=access_level,
    )

    return result


@router.post("/{collection}/{document}/remove/{user_id}")
async def remove_user_from_resource(
    auth_service: AuthorizationServiceDep,
    collection: str,
    document: str,
    user_id: str,
    current_user: Annotated[
        JWTData,
        Security(verify_token, scopes=["admin", "curator"]),
    ],
):
    result = await auth_service.remove_user_access_level_for_resource(
        collection=collection,
        object_id=document,
        user_id=user_id,
    )

    return result
