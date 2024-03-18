import logging
from beanie import PydanticObjectId
from fastapi import HTTPException
from kink import inject

from models.authorization_document import (
    AuthorizationDocument,
    AuthorizationRecordModel,
)


@inject
class AuthorizationService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)

    async def authorize_user_for_resource(
        self,
        user_id: str,
        collection: str,
        object_id: str,
        access_level: str,
    ) -> AuthorizationDocument:
        self.logger.info(
            f"Authorizing user {user_id} for resource {collection}/{object_id} with access level {access_level}"
        )

        record = AuthorizationRecordModel(
            user_id=PydanticObjectId(user_id),
            access_level=access_level,
        )
        self.logger.info(
            f"Retrieving authorization document for {collection}/{object_id}"
        )
        document = await AuthorizationDocument.find_one(
            AuthorizationDocument.collection == collection,
            AuthorizationDocument.object_id
            == PydanticObjectId(object_id),
        )

        if document is not None:
            self.logger.info(
                f"Authorization document for {collection}/{object_id} found"
            )
            existing_record = next(
                (
                    record
                    for record in document.records
                    if record.user_id
                    == PydanticObjectId(user_id)
                ),
                None,
            )

            if existing_record:
                self.logger.info(
                    f"Updating access level for user {user_id} to {access_level}"
                )
                existing_record.access_level = access_level
            else:
                self.logger.info(
                    f"Adding new record for user {user_id} with access level {access_level}"
                )
                document.records.append(record)

            await AuthorizationDocument.replace(document)
        else:
            self.logger.info(
                f"Authorization document for {collection}/{object_id} not found, creating new document"
            )
            document = (
                await AuthorizationDocument.insert_one(
                    AuthorizationDocument(
                        collection=collection,
                        object_id=PydanticObjectId(
                            object_id
                        ),
                        records=[
                            record,
                        ],
                    )
                )
            )
            self.logger.info(
                f"Authorization document for {collection}/{object_id} created"
            )
            if document is None:
                self.logger.error(
                    f"Failed to create authorization document for {collection}/{object_id}"
                )
                raise HTTPException(
                    status_code=500,
                    detail="Failed to authorize user for resource",
                )

        self.logger.info(
            f"User {user_id} authorized for resource {collection}/{object_id} with access level {access_level}"
        )
        return document

    async def get_user_access_level_for_resource(
        self, user_id: str, collection: str, object_id: str
    ) -> str | None:
        self.logger.info(
            f"Retrieving access level for user {user_id} for resource {collection}/{object_id}"
        )
        document = await AuthorizationDocument.find_one(
            AuthorizationDocument.collection == collection,
            AuthorizationDocument.object_id
            == PydanticObjectId(object_id),
        )

        if document is None:
            self.logger.info(
                f"There is no authorization document for {collection}/{object_id}, returning None"
            )
            return None

        self.logger.info(
            f"Authorization document for {collection}/{object_id} found"
        )

        record = next(
            (
                record
                for record in document.records
                if record.user_id
                == PydanticObjectId(user_id)
            ),
            None,
        )

        if record is None:
            self.logger.info(
                f"User {user_id} is not authorized for resource {collection}/{object_id}, returning None"
            )
            return None

        self.logger.info(
            f"User {user_id} is authorized for resource {collection}/{object_id} with access level {record.access_level}"
        )

        return record.access_level

    async def remove_user_access_level_for_resource(
        self, user_id: str, collection: str, object_id: str
    ) -> AuthorizationDocument:
        self.logger.info(
            f"Removing access level for user {user_id} for resource {collection}/{object_id}"
        )
        document = await AuthorizationDocument.find_one(
            AuthorizationDocument.collection == collection,
            AuthorizationDocument.object_id
            == PydanticObjectId(object_id),
        )

        if document is None:
            self.logger.error(
                f"There is no authorization document for {collection}/{object_id}, returning None"
            )
            raise HTTPException(
                status_code=404,
                detail="Authorization document not found",
            )

        self.logger.info(
            f"Authorization document for {collection}/{object_id} found"
        )

        document.records = [
            record
            for record in document.records
            if record.user_id != PydanticObjectId(user_id)
        ]

        await AuthorizationDocument.replace(document)

        self.logger.info(
            f"User {user_id} removed from resource {collection}/{object_id}"
        )

        return document

    async def remove_resource(
        self, collection: str, object_id: str
    ) -> dict:
        self.logger.info(
            f"Removing resource {collection}/{object_id}"
        )
        document = await AuthorizationDocument.find_one(
            AuthorizationDocument.collection == collection,
            AuthorizationDocument.object_id
            == PydanticObjectId(object_id),
        )

        if document is None:
            self.logger.error(
                f"There is no authorization document for {collection}/{object_id}, returning None"
            )
            raise HTTPException(
                status_code=404,
                detail="Authorization document not found",
            )

        await AuthorizationDocument.delete(document)

        self.logger.info(
            f"Resource {collection}/{object_id} removed"
        )
        return {"message": "Resource removed successfully"}

    async def get_resource(
        self, collection: str, object_id: str
    ) -> None | AuthorizationDocument:
        self.logger.info(
            f"Retrieving resource for {collection}/{object_id}"
        )
        document = await AuthorizationDocument.find_one(
            AuthorizationDocument.collection == collection,
            AuthorizationDocument.object_id
            == PydanticObjectId(object_id),
        )

        if document is None:
            self.logger.info(
                f"There are no authorization document for collection {collection}, returning None"
            )
            return None

        self.logger.info(
            f"Authorization document for {collection}/{object_id} found"
        )

        return document
