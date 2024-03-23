import logging
from typing import List

from fastapi import HTTPException
from kink import inject

from models.source_document import (
    SourceDocument,
    SourceType,
)
from services.file_service import FileService
from utils.schema_extractor import SchemaExtractor


@inject
class SourceService:
    def __init__(
        self,
        file_service: FileService,
        schema_extractor: SchemaExtractor,
    ):
        self.logger = logging.getLogger(__name__)
        self.file_service = file_service
        self.schema_extractor = schema_extractor

    async def create_source(
        self,
        name: str,
        description: str,
        file_name: str,
        file_extension: str,
        bytes: bytes,
    ) -> SourceDocument:
        self.logger.info(
            f"Creating source with name {file_name} and extension {file_extension}"
        )
        self.logger.info(
            f"Creating refs for source with name {file_name} and extension {file_extension}"
        )

        refs = self.schema_extractor.extract_schema(
            bytes, file_extension
        )

        if len(refs) == 0:
            self.logger.error(
                f"No refs found in the schema, aborting source creation"
            )
            raise HTTPException(
                detail="No refs found in the schema, please check the file",
                status_code=400,
            )

        try:
            source = SourceDocument(
                name=name,
                description=description,
                source_type=SourceType.from_extension(
                    file_extension
                ),
                file=await self.file_service.create_file(
                    file_name, file_extension, bytes  # type: ignore
                ),
                refs=refs,
            )

            source = await SourceDocument.insert(source)
            return source
        except ValueError as e:
            self.logger.error(f"Error creating source: {e}")
            raise HTTPException(
                detail=f"Error creating source: {e}",
                status_code=400,
            )

    async def get_source_by_id(
        self, source_id: str
    ) -> SourceDocument:
        source = await SourceDocument.get(
            source_id, fetch_links=True
        )
        if source is None:
            raise HTTPException(
                detail="Source not found",
                status_code=404,
            )
        return source

    async def get_sources(self) -> List[SourceDocument]:
        sources = await SourceDocument.find({}).to_list()
        return sources

    async def remove_source(
        self, source_id: str
    ) -> SourceDocument:
        source = await SourceDocument.get(
            source_id, fetch_links=True
        )
        if source is None:
            raise HTTPException(
                detail="Source not found",
                status_code=404,
            )
        await self.file_service.delete_file(source.file.id)  # type: ignore
        await SourceDocument.delete(source)
        return source

    async def update_source(
        self,
        source_id: str,
        name: str,
        description: str,
    ) -> SourceDocument:
        source = await SourceDocument.get(
            source_id, fetch_links=True
        )
        if source is None:
            raise HTTPException(
                detail="Source not found",
                status_code=404,
            )

        if source.name != name:
            source.name = name
            file = await self.file_service.get_file(source.file.id)  # type: ignore
            source.refs = (
                self.schema_extractor.extract_schema(
                    file,
                    source.source_type.value,
                )
            )
        source.name = name
        source.description = description

        await SourceDocument.replace(source)
        return source

    async def update_source_file(
        self,
        source_id: str,
        file_name: str,
        file_extension: str,
        bytes: bytes,
    ) -> SourceDocument:
        source = await SourceDocument.get(
            source_id, fetch_links=True
        )
        if source is None:
            raise HTTPException(
                detail="Source not found",
                status_code=404,
            )
        old_file_id = source.file.id  # type: ignore
        source.source_type = SourceType.from_extension(
            file_extension
        )
        source.file = await self.file_service.create_file(
            file_name, file_extension, bytes  # type: ignore
        )
        source.refs = self.schema_extractor.extract_schema(
            bytes, file_extension
        )

        # Delete old file
        await self.file_service.delete_file(old_file_id)
        await SourceDocument.replace(source)
        return source
