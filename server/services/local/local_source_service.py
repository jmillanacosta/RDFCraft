import json
import logging
from uuid import uuid4

import jsonpath_ng
from kink import inject

from server.exceptions import ErrCodes
from server.facades import ServerException
from server.models.source import Source, SourceType
from server.service_protocols.source_service_protocol import (
    SourceServiceProtocol,
)
from server.services.local.local_fs_service import (
    LocalFSService,
)
from server.utils.schema_extractor import SchemaExtractor


@inject(alias=SourceServiceProtocol)
class LocalSourceService(SourceServiceProtocol):
    def __init__(
        self,
        fs_service: LocalFSService,
        schema_extractor: SchemaExtractor,
    ) -> None:
        self.schema_extractor = schema_extractor
        self.fs_service = fs_service
        self.logger = logging.getLogger(__name__)

        self.logger.info("LocalSourceService initialized")

    def get_source(self, source_id: str) -> Source:
        self.logger.info(f"Getting source {source_id}")

        try:
            source_file_raw = self.fs_service.download_file_with_uuid(source_id)
        except ServerException as e:
            if e.code == ErrCodes.FILE_NOT_FOUND:
                self.logger.error(f"Source {source_id} not found")
                raise ServerException(
                    f"Source {source_id} not found",
                    code=ErrCodes.SOURCE_NOT_FOUND,
                )
            self.logger.error(f"Failed to get source {source_id}")
            raise e
        except Exception as e:
            self.logger.error(
                f"Unexpected error while getting source {source_id}",
                exc_info=e,
            )
            raise ServerException(
                "Unexpected error",
                ErrCodes.UNKNOWN_ERROR,
            )

        return Source.from_dict(json.loads(source_file_raw.decode("utf-8")))

    def download_source(self, source_id: str) -> bytes:
        self.logger.info(f"Getting source {source_id}")
        source = self.get_source(source_id)
        source_file_raw = self.fs_service.download_file_with_uuid(source.file_uuid)
        return source_file_raw

    def adjust_json_source(self, content: bytes, json_path: str) -> bytes:
        try:
            json_path_exp = jsonpath_ng.parse(json_path)
            json_data = json.loads(content.decode("utf-8"))
            # This should match to single array element
            matches = json_path_exp.find(json_data)
            if len(matches) == 0:
                raise ServerException(
                    "No matches found for the given json path",
                    ErrCodes.JSON_PATH_DATA_NOT_FOUND,
                )

            if not isinstance(matches[0].value, list):
                return json.dumps([matches[0].value]).encode("utf-8")
            return json.dumps(matches[0].value).encode("utf-8")
        except json.JSONDecodeError as e:
            self.logger.error(
                "Failed to decode the json content",
                exc_info=e,
            )
            raise ServerException(
                "Failed to decode the json content",
                ErrCodes.FILE_CORRUPTED,
            )

    def create_source(
        self,
        type: SourceType,
        content: bytes,
        extra: dict = {},
    ) -> str:
        self.logger.info(f"Creating source of type {type}")

        schema_content = content

        if type == SourceType.JSON:
            if "json_path" not in extra:
                raise ServerException(
                    "JSON path is required for JSON source",
                    ErrCodes.JSON_PATH_NOT_PROVIDED,
                )
            schema_content = self.adjust_json_source(content, extra["json_path"])

        try:
            references = self.schema_extractor.extract_schema(schema_content, type)
        except KeyError:
            self.logger.error(
                f"Unsupported file type {type}",
            )
            raise ServerException(
                "Unsupported file type",
                ErrCodes.UNSUPPORTED_FILE_TYPE,
            )
        except Exception as e:
            self.logger.error(
                "Unexpected error while extracting schema",
                exc_info=e,
            )
            raise ServerException(
                "Unexpected error",
                ErrCodes.UNKNOWN_ERROR,
            )
        self.logger.info(f"Extracted references: {references}")
        source_uuid = str(uuid4())
        file_metadata = self.fs_service.upload_file(
            f"{source_uuid}_file",
            content,
        )
        self.logger.info(f"Uploaded file with uuid {file_metadata.uuid}")

        source = Source(
            uuid=source_uuid,
            type=type,
            references=references,
            file_uuid=file_metadata.uuid,
            extra=extra,
        )

        self.fs_service.upload_file(
            source_uuid,
            json.dumps(source.to_dict()).encode("utf-8"),
            uuid=source_uuid,
        )

        self.logger.info(f"Created source {source_uuid}")

        return source_uuid

    def update_source(self, source_id: str, source: Source) -> None:
        raise NotImplementedError()

    def delete_source(self, source_id: str) -> None:
        self.logger.info(f"Deleting source {source_id}")
        source = self.get_source(source_id)
        self.fs_service.delete_file_with_uuid(source.file_uuid)
        self.fs_service.delete_file_with_uuid(source_id)
        self.logger.info(f"Deleted source {source_id}")
