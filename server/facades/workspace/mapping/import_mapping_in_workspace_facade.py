import datetime
import json
import tarfile
from io import BytesIO
from pathlib import Path

from kink import inject

from server.const.err_enums import ErrCodes
from server.exceptions import ServerException
from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.models.export_metadata import (
    ExportMetadata,
    ExportMetadataType,
)
from server.models.mapping import MappingGraph
from server.models.source import Source
from server.service_protocols.fs_service_protocol import (
    FSServiceProtocol,
)
from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)
from server.service_protocols.source_service_protocol import (
    SourceServiceProtocol,
)
from server.service_protocols.workspace_metadata_service_protocol import (
    WorkspaceMetadataServiceProtocol,
)
from server.service_protocols.workspace_service_protocol import (
    WorkspaceServiceProtocol,
)


@inject
class ImportMappingInWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
        file_service: FSServiceProtocol,
        TEMP_DIR: Path,
    ):
        super().__init__()

        self.workspace_metadata_service: WorkspaceMetadataServiceProtocol = (
            workspace_metadata_service
        )
        self.workspace_service: WorkspaceServiceProtocol = workspace_service
        self.mapping_service: MappingServiceProtocol = mapping_service
        self.source_service: SourceServiceProtocol = source_service
        self.file_service: FSServiceProtocol = file_service

        self.temp_dir = TEMP_DIR

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
        tar: bytes,
    ) -> FacadeResponse:
        self.logger.info(f"Importing mapping from tar")

        self.logger.info(f"Getting workspace {workspace_id}")

        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id
        )

        workspace = self.workspace_service.get_workspace(workspace_metadata.location)

        self.logger.info(f"Workspace {workspace_id} retrieved")

        self.logger.info(f"Extracting tar")

        tar_f: tarfile.TarFile = tarfile.open(fileobj=BytesIO(tar))

        export_metadata_raw = tar_f.extractfile("metadata.json")

        if export_metadata_raw is None:
            raise ServerException(
                "Export metadata not found, the tar is corrupted",
                code=ErrCodes.METADATA_NOT_FOUND,
            )

        export_metadata = ExportMetadata.from_dict(
            json.loads(export_metadata_raw.read().decode("utf-8"))
        )

        if export_metadata.type != ExportMetadataType.MAPPING:
            raise ServerException(
                "The export is not a mapping export",
                code=ErrCodes.WRONG_IMPORT_TYPE,
            )

        self.logger.info(f"Importing mapping {export_metadata.mappings[0].name}")

        self.logger.info("Dumping mapping jsons to files storage")

        mapping = export_metadata.mappings[0]
        source = export_metadata.sources[0]

        self.file_service.upload_file(
            name=source.uuid,
            uuid=source.uuid,
            content=json.dumps(source.to_dict()).encode("utf-8"),
        )
        self.file_service.upload_file(
            name=mapping.uuid,
            uuid=mapping.uuid,
            content=json.dumps(mapping.to_dict()).encode("utf-8"),
        )
        for file in export_metadata.files:
            file_raw = tar_f.extractfile(f"files/{file.uuid}")
            if file_raw is None:
                raise ServerException(
                    "File not found in tar",
                    code=ErrCodes.FILE_NOT_FOUND,
                )
            self.file_service.upload_file(
                name=file.name,
                uuid=file.uuid,
                content=file_raw.read(),
            )

        self.logger.info(f"Mapping {mapping.name} imported, registering in workspace")

        workspace.mappings.append(mapping.uuid)

        self.workspace_service.update_workspace(workspace)

        self.logger.info(
            f"Mapping {mapping.name} registered in workspace {workspace_id}"
        )

        return self._success_response(data=None, message="Mapping imported")
