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
        self.logger.info("Importing mapping from tar")

        self.logger.info(f"Getting workspace {workspace_id}")

        workspace_metadata = self.workspace_metadata_service.get_workspace_metadata(
            workspace_id
        )

        workspace = self.workspace_service.get_workspace(workspace_metadata.location)

        self.logger.info(f"Workspace {workspace_id} retrieved")

        self.logger.info("Extracting tar")

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

        imported_mapping = export_metadata.mappings[0]
        imported_source = export_metadata.sources[0]

        self.logger.info(f"Creating source with file uuid {imported_source.file_uuid}")

        raw_source = tar_f.extractfile(f"files/{imported_source.file_uuid}")

        if raw_source is None:
            raise ServerException(
                "Source file not found in the tar",
                code=ErrCodes.CORRUPTED_TAR,
            )

        source_id = self.source_service.create_source(
            type=imported_source.type,
            extra=imported_source.extra,
            content=raw_source.read(),
        )

        self.logger.info(f"Source {source_id} created")

        self.logger.info(f"Creating mapping {imported_mapping.name}")

        mapping_id = self.mapping_service.create_mapping(
            name=imported_mapping.name,
            description=imported_mapping.description,
            source_uuid=source_id,
        )

        self.logger.info(f"Mapping {mapping_id} created")

        self.logger.info("Importing mapping file")

        mapping_model = self.mapping_service.get_mapping(mapping_id)

        mapping_model.nodes = imported_mapping.nodes
        mapping_model.edges = imported_mapping.edges

        self.mapping_service.update_mapping(mapping_id, mapping_model)

        self.logger.info("Mapping file imported")

        self.logger.info(f"Registering mapping in workspace {workspace_id}")

        workspace.mappings.append(mapping_id)

        self.workspace_service.update_workspace(workspace)

        self.logger.info(
            f"Mapping {imported_mapping.name} registered in workspace {workspace_id}"
        )

        return self._success_response(data=None, message="Mapping imported")
