from datetime import UTC, datetime, timedelta
import logging
from fastapi import HTTPException
from kink import inject
from pydantic import BaseModel
from jose import JWTError, jwt

from models.user_document import UserDocument
from utils.password_util import (
    hash_password,
    verify_password,
)


class JWT(BaseModel):
    access_token: str
    token_type: str = "Bearer"


class JWTData(BaseModel):
    user_id: str
    scopes: list[str]
    expire: float


@inject
class AuthenticationService:
    def __init__(
        self,
        jwt_secret: str,
        jwt_algorithm: str,
        jwt_expiration: int,
    ):
        self.logger = logging.getLogger(__name__)
        self.jwt_secret = jwt_secret
        self.jwt_algorithm = jwt_algorithm
        self.jwt_expiration = jwt_expiration

    async def authenticate_user(
        self, username: str, password: str
    ) -> JWT:
        self.logger.info(f"Authenticating user {username}")
        user = await UserDocument.find_one(
            UserDocument.username == username
        )
        if user is None:
            self.logger.error(
                f"User with username {username} not found"
            )
            raise HTTPException(
                status_code=400,
                detail=f"Username or password incorrect",
            )

        if not verify_password(password, user.password):
            self.logger.error(
                f"Password incorrect for user {username}"
            )
            raise HTTPException(
                status_code=400,
                detail=f"Username or password incorrect",
            )

        data = JWTData(
            user_id=str(user.id),
            scopes=user.roles,
            # Get unix timestamp for expiration
            expire=(
                datetime.now(UTC)
                + timedelta(seconds=self.jwt_expiration)
            ).timestamp(),
        )

        access_token = jwt.encode(
            data.model_dump(),
            self.jwt_secret,
            algorithm=self.jwt_algorithm,
        )

        return JWT(access_token=access_token)

    async def verify_token(self, token: str) -> JWTData:
        try:
            payload = jwt.decode(
                token,
                self.jwt_secret,
                algorithms=[self.jwt_algorithm],
            )

            # Check if token is expired
            # TODO: Enable later
            # if (
            #     datetime.now(UTC).timestamp()
            #     > payload["expire"]
            # ):
            #     raise HTTPException(
            #         status_code=401,
            #         detail="Token expired, please login again",
            #     )

            return JWTData(**payload)
        except JWTError:
            raise HTTPException(
                status_code=401, detail="Invalid token"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500, detail=str(e)
            )
