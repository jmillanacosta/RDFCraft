import datetime
import json
import tarfile
from io import BytesIO
from pathlib import Path

from kink import inject

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
from server.services.local.local_source_service import (
    SourceServiceProtocol,
)


@inject
class ExportMappingInWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        mapping_service: MappingServiceProtocol,
        source_service: SourceServiceProtocol,
        file_service: FSServiceProtocol,
        TEMP_DIR: Path,
    ):
        super().__init__()

        self.mapping_service: MappingServiceProtocol = (
            mapping_service
        )
        self.source_service: SourceServiceProtocol = (
            source_service
        )
        self.file_service: FSServiceProtocol = file_service

        self.temp_dir = TEMP_DIR

    @BaseFacade.error_wrapper
    def execute(
        self,
        mapping_id: str,
    ) -> FacadeResponse:
        self.logger.info(f"Exporting mapping {mapping_id}")
        self.logger.info(f"Getting mapping {mapping_id}")
        mapping: MappingGraph = (
            self.mapping_service.get_mapping(mapping_id)
        )
        self.logger.info(
            f"Retrieving source for mapping {mapping_id}"
        )
        source: Source = self.source_service.get_source(
            mapping.source_id
        )
        self.logger.info(
            f"Retrieving source file metadata for mapping {mapping_id}"
        )
        source_file_metadata = (
            self.file_service.get_file_metadata_by_uuid(
                source.file_uuid
            )
        )
        self.logger.info(
            f"Downloading source file for mapping {mapping_id}"
        )
        tar_file_path = (
            self.temp_dir
            / f"export-{mapping.name}-{datetime.datetime.now().isoformat().replace(':', '_')}.tar.gz"
        )

        export_metadata = ExportMetadata(
            type=ExportMetadataType.MAPPING,
            workspace_model=None,
            workspace_metadata=None,
            sources=[source],
            files=[source_file_metadata],
            mappings=[mapping],
        )

        with tarfile.open(tar_file_path, "w:gz") as tar:
            files_folder = tarfile.TarInfo("files/")
            files_folder.type = tarfile.DIRTYPE
            files_folder.mode = 0o777
            tar.addfile(files_folder)
            for file in export_metadata.files:
                _data = self.file_service.download_file_with_uuid(
                    file.uuid
                )
                tarinfo = tarfile.TarInfo(
                    name=f"files/{file.uuid}"
                )
                tarinfo.size = len(_data)
                tarinfo.mode = 0o666
                tar.addfile(
                    tarinfo=tarinfo,
                    fileobj=BytesIO(_data),
                )

            metadata_info = tarfile.TarInfo("metadata.json")
            metadata_content = json.dumps(
                export_metadata.to_dict()
            ).encode()
            metadata_info.size = len(metadata_content)
            metadata_info.mode = 0o666
            tar.addfile(
                tarinfo=metadata_info,
                fileobj=BytesIO(metadata_content),
            )

        return self._success_response(
            data=tar_file_path,
            message="Exported mapping successfully",
        )
