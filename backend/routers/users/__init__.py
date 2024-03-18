from typing import Annotated, List
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Security,
)
from fastapi.security import OAuth2PasswordBearer
from kink import di

from models.user_document import UserDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
from services.user_service import UserService


router = APIRouter()

UserServiceDep = Annotated[
    UserService, Depends(lambda: di[UserService])
]
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


@router.get("/")
async def get_users(
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> List[UserDocument]:
    return await user_service.get_all_users()


@router.get("/{user_id}")
async def get_user_by_id(
    user_id: str,
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> UserDocument:
    return await user_service.get_user_by_id(user_id)


@router.get("/username/{username}")
async def get_user_by_username(
    username: str,
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> UserDocument:
    return await user_service.get_user_by_username(username)


@router.post("/")
async def create_user(
    username: str,
    password: str,
    roles: list[str],
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin"],
        ),
    ],
) -> UserDocument:
    return await user_service.create_user(
        username, password, roles
    )


@router.put("/{user_id}")
async def update_user(
    user_id: str,
    username: str,
    password: str,
    roles: list[str],
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> UserDocument:
    if (
        current_user.user_id != user_id
        or "admin" not in current_user.scopes
    ):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to update other users",
        )
    return await user_service.update_user(
        user_id, username, password, roles
    )


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    user_service: UserServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin"],
        ),
    ],
) -> UserDocument:
    if (
        current_user.user_id != user_id
        or "admin" not in current_user.scopes
    ):
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to delete other users",
        )
    return await user_service.delete_user(user_id)
