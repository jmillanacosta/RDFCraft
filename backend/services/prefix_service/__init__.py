import logging
from fastapi import HTTPException
from kink import inject

from helpers.pydantic_uri import PydanticUriRef
from models.prefix_document import PrefixDocument


@inject
class PrefixService:
    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)

    async def create_prefix(self, prefix: str, uri: str):
        """
        Create Prefix
        Allows for duplicate prefixes as they might be used in different workspaces
        """
        self.logger.info(
            f"Creating prefix {prefix} with uri {uri}"
        )
        # Create document
        document = PrefixDocument(
            prefix=prefix,
            uri=PydanticUriRef(uri),
            ontology=None,
        )
        document = await PrefixDocument.insert_one(document)

        if document is None:
            self.logger.error(
                f"Prefix {prefix} not created"
            )
            raise HTTPException(
                status_code=500,
                detail=f"Prefix {prefix} not created",
            )

        self.logger.info(f"Prefix {prefix} created")
        return document

    async def get_prefix_by_id(self, prefix_id: str):
        """
        Get Prefix by ID
        """
        self.logger.info(
            f"Getting prefix by id {prefix_id}"
        )
        document = await PrefixDocument.get(prefix_id)

        if document is None:
            self.logger.error(
                f"Prefix with id {prefix_id} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"Prefix with id {prefix_id} not found",
            )

        self.logger.info(
            f"Prefix with id {prefix_id} found"
        )
        return document

    async def get_prefix_by_prefix(self, prefix: str):
        """
        Get Prefix
        """
        self.logger.info(f"Getting prefix {prefix}")
        document = await PrefixDocument.find_one(
            PrefixDocument.prefix == prefix
        )

        if document is None:
            self.logger.error(f"Prefix {prefix} not found")
            raise HTTPException(
                status_code=404,
                detail=f"Prefix {prefix} not found",
            )

        self.logger.info(f"Prefix {prefix} found")
        return document

    async def get_prefix_by_uri(self, uri: str):
        """
        Get Prefix by URI
        """
        self.logger.info(f"Getting prefix by uri {uri}")
        document = await PrefixDocument.find_one(
            PrefixDocument.uri == PydanticUriRef(uri)
        )

        if document is None:
            self.logger.error(
                f"Prefix with uri {uri} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"Prefix with uri {uri} not found",
            )

        self.logger.info(f"Prefix with uri {uri} found")
        return document

    async def update_prefix(
        self, prefix: str, uri: str, prefix_id: str
    ):
        """
        Update Prefix
        """
        self.logger.info(
            f"Updating object with id {prefix_id} to prefix {prefix} with uri {uri}"
        )
        document = await PrefixDocument.get(prefix_id)

        if document is None:
            self.logger.error(f"Prefix {prefix} not found")
            raise HTTPException(
                status_code=404,
                detail=f"Prefix {prefix} not found",
            )

        document.prefix = prefix
        document.uri = PydanticUriRef(uri)
        document = await PrefixDocument.replace(document)

        self.logger.info(f"Prefix {prefix} updated")
        return document

    async def delete_prefix(self, prefix_id: str):
        """
        Delete Prefix
        """
        self.logger.info(
            f"Deleting prefix with id {prefix_id}"
        )
        document = await PrefixDocument.get(prefix_id)

        if document is None:
            self.logger.error(
                f"Prefix with id {prefix_id} not found"
            )
            raise HTTPException(
                status_code=404,
                detail=f"Prefix with id {prefix_id} not found",
            )

        await PrefixDocument.delete(document)

        self.logger.info(
            f"Prefix with id {prefix_id} deleted"
        )
        return document

    async def get_all_prefixes(self):
        """
        Get All Prefixes
        """
        self.logger.info("Getting all prefixes")
        documents = await PrefixDocument.find().to_list()

        self.logger.info("All prefixes found")
        return documents

    async def get_prefixes_by_ontology_id(
        self, ontology_id: str
    ):
        """
        Get Prefixes by Ontology ID
        """
        self.logger.info(
            f"Getting prefixes by ontology id {ontology_id}"
        )
        documents = await PrefixDocument.find(
            PrefixDocument.ontology.id == ontology_id,  # type: ignore
            fetch_links=True,
        ).to_list()

        self.logger.info(
            f"Prefixes by ontology id {ontology_id} found"
        )
        return documents
