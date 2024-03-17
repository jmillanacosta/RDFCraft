import logging
from fastapi import HTTPException
from kink import inject


from models.user_document import UserDocument
from utils.password_util import (
    hash_password,
    verify_password,
)


@inject
class UserService:

    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def get_user_by_id(
        self, user_id: str
    ) -> UserDocument:
        self.logger.info(f"Getting user by id {user_id}")
        user = await UserDocument.get(user_id)
        if user is None:
            self.logger.error(
                f"User with id {user_id} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"User with id {user_id} not found",
            )
        # Omit password hash
        user.password = ""
        return user

    async def get_user_by_username(
        self, username: str
    ) -> UserDocument:
        self.logger.info(
            f"Getting user by username {username}"
        )
        user = await UserDocument.find_one(
            UserDocument.username == username
        )
        if user is None:
            self.logger.error(
                f"User with username {username} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"User with username {username} not found",
            )
        # Omit password hash
        user.password = ""
        return user

    async def create_user(
        self, username, password, roles
    ) -> UserDocument:
        self.logger.info(f"Creating user {username}")

        # Check if user already exists
        try:
            await self.get_user_by_username(username)
            self.logger.error(
                f"User with username {username} already exists"
            )
            raise HTTPException(
                status_code=400,
                detail=f"User with username {username} already exists",
            )
        except HTTPException as e:
            if e.status_code != 404:
                raise e

        hashed_password = hash_password(password)
        user = UserDocument(
            username=username,
            password=hashed_password,
            roles=roles,
        )
        try:
            await UserDocument.insert_one(user)
        except Exception as e:
            self.logger.error(
                f"Error creating user {username}: {e}"
            )
            raise HTTPException(
                status_code=500,
                detail=f"Error creating user {username}: {e}",
            )

        # Omit password hash
        user.password = ""
        return user

    async def delete_user(
        self, user_id: str
    ) -> UserDocument:
        self.logger.info(f"Deleting user {user_id}")
        user = await self.get_user_by_id(user_id)
        if user is None:
            self.logger.error(
                f"User with id {user_id} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"User with id {user_id} not found",
            )
        await UserDocument.delete(user)
        return user

    async def update_user(
        self, user_id: str, username, password, roles
    ) -> UserDocument:
        self.logger.info(f"Updating user {user_id}")
        user = await self.get_user_by_id(user_id)

        if not verify_password(password, user.password):
            self.logger.error(
                f"Unsuccessful password verification for user {user_id}"
            )
            raise HTTPException(
                status_code=400,
                detail="Unsuccessful password verification",
            )

        user.username = username
        user.password = hash_password(password)
        user.roles = roles
        return await UserDocument.replace(user)

    async def get_all_users(self):
        self.logger.info(f"Getting all users")
        users = await UserDocument.find_all().to_list()
        # Omit password hashes
        for user in users:
            user.password = ""
        return users

    async def get_user_with_password_by_username(
        self, username: str
    ) -> UserDocument | None:
        self.logger.info(
            f"Getting user with password by username {username}"
        )
        return await UserDocument.find_one(
            UserDocument.username == username
        )

    async def get_user_with_password_by_id(
        self, user_id: str
    ) -> UserDocument | None:
        self.logger.info(
            f"Getting user with password by id {user_id}"
        )
        return await UserDocument.get(user_id)
