from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import (
    OAuth2PasswordRequestForm,
)
from kink import di

from services.authentication_service import (
    AuthenticationService,
)


router = APIRouter()



AuthenticationServiceDep = Annotated[
    AuthenticationService,
    Depends(lambda: di[AuthenticationService]),
]


@router.post("/login")
async def login(
    login_data: Annotated[
        OAuth2PasswordRequestForm, Depends()
    ],
    auth_service: AuthenticationServiceDep,
):
    return await auth_service.authenticate_user(
        login_data.username, login_data.password
    )
