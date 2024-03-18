from typing import Annotated, List
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

from models.prefix_document import PrefixDocument
from services.authentication_service import (
    AuthenticationService,
    JWTData,
)
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

PrefixServiceDep = Annotated[
    PrefixService, Depends(lambda: di[PrefixService])
]


router = APIRouter()


@router.get("/")
async def get_prefixes(
    prefix_service: PrefixServiceDep,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> List[PrefixDocument]:
    result = await prefix_service.get_all_prefixes()
    return result


@router.post("/")
async def create_prefix(
    prefix_service: PrefixServiceDep,
    prefix: str,
    uri: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.create_prefix(prefix, uri)
    return result


@router.get("/{prefix_id}")
async def get_prefix_by_id(
    prefix_service: PrefixServiceDep,
    prefix_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.get_prefix_by_id(
        prefix_id
    )
    return result


@router.get("/prefix/{prefix}")
async def get_prefix_by_prefix(
    prefix_service: PrefixServiceDep,
    prefix: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.get_prefix_by_prefix(
        prefix
    )
    return result


@router.get("/uri/{uri}")
async def get_prefix_by_uri(
    prefix_service: PrefixServiceDep,
    uri: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.get_prefix_by_uri(uri)
    return result


@router.delete("/{prefix_id}")
async def delete_prefix(
    prefix_service: PrefixServiceDep,
    prefix_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.delete_prefix(prefix_id)
    return result


@router.put("/{prefix_id}")
async def update_prefix(
    prefix_service: PrefixServiceDep,
    prefix: str,
    uri: str,
    prefix_id: str,
    current_user: Annotated[
        JWTData,
        Security(
            verify_token,
            scopes=["admin", "curator"],
        ),
    ],
) -> PrefixDocument:
    result = await prefix_service.update_prefix(
        prefix, uri, prefix_id
    )
    return result
