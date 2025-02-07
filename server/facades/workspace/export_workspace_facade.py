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
    OntologyExportMetadata,
)
from server.models.file_metadata import FileMetadata
from server.models.mapping import MappingGraph
from server.models.ontology import Ontology
from server.models.workspace import WorkspaceModel
from server.models.workspace_metadata import (
    WorkspaceMetadata,
)
from server.service_protocols.fs_service_protocol import (
    FSServiceProtocol,
)
from server.service_protocols.mapping_service_protocol import (
    MappingServiceProtocol,
)
from server.service_protocols.ontology_service_protocol import (
    OntologyServiceProtocol,
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
class ExportWorkspaceFacade(BaseFacade):
    def __init__(
        self,
        workspace_metadata_service: WorkspaceMetadataServiceProtocol,
        workspace_service: WorkspaceServiceProtocol,
        ontology_service: OntologyServiceProtocol,
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
        self.ontology_service: OntologyServiceProtocol = ontology_service
        self.mapping_service: MappingServiceProtocol = mapping_service
        self.source_service: SourceServiceProtocol = source_service
        self.file_service: FSServiceProtocol = file_service

        self.temp_dir = TEMP_DIR

    @BaseFacade.error_wrapper
    def execute(
        self,
        workspace_id: str,
    ) -> FacadeResponse:
        self.logger.info(f"Exporting workspace {workspace_id}")

        self.logger.info(f"Getting workspace metadata {workspace_id}")

        workspace_metadata: WorkspaceMetadata = (
            self.workspace_metadata_service.get_workspace_metadata(workspace_id)
        )

        self.logger.info(f"Getting workspace {workspace_id}")

        workspace: WorkspaceModel = self.workspace_service.get_workspace(
            workspace_metadata.location
        )

        self.logger.info(f"Retrieved workspace {workspace_id}")

        self.logger.info(f"Getting mappings for workspace {workspace_id}")

        mappings: list[MappingGraph] = [
            self.mapping_service.get_mapping(mapping_id)
            for mapping_id in workspace.mappings
        ]

        self.logger.info(f"Getting sources for workspace {workspace_id}")

        sources = [
            self.source_service.get_source(mapping.source_id) for mapping in mappings
        ]

        self.logger.info(f"Getting ontologies for workspace {workspace_id}")

        ontologies: list[Ontology] = [
            self.ontology_service.get_ontology(ontology_id)
            for ontology_id in workspace.ontologies
        ]

        self.logger.info(f"Getting files for workspace {workspace_id}")

        files: list[FileMetadata] = []

        files.extend(
            [
                self.file_service.get_file_metadata_by_uuid(source.file_uuid)
                for source in sources
            ]
        )

        files.extend(
            [
                self.file_service.get_file_metadata_by_uuid(ontology.file_uuid)
                for ontology in ontologies
            ]
        )

        self.logger.info(f"Creating export metadata for workspace {workspace_id}")

        export_metadata = ExportMetadata(
            type=ExportMetadataType.WORKSPACE,
            workspace_metadata=workspace_metadata,
            workspace_model=workspace,
            sources=sources,
            files=files,
            mappings=mappings,
            ontologies=[
                OntologyExportMetadata(
                    name=ontology.name,
                    description=ontology.description,
                    base_uri=ontology.base_uri,
                    file_uuid=ontology.file_uuid,
                )
                for ontology in ontologies
            ],
        )

        self.logger.info(f"Creating tar file for workspace {workspace_id}")

        tar_file_path = (
            self.temp_dir
            / f"rc-workspace-export-{workspace.name}-{datetime.datetime.now().isoformat().replace(':', '_')}.tar.gz"
        )

        self.logger.info(f"Tar file path for mapping {workspace_id}: {tar_file_path}")

        with tarfile.open(tar_file_path, "w:gz") as tar:
            self.logger.info(f"Creating tar file for workspace {workspace_id}")

            tarinfo = tarfile.TarInfo("metadata.json")
            export_metadata_dumps = json.dumps(export_metadata.to_dict()).encode(
                "utf-8"
            )
            tarinfo.size = len(export_metadata_dumps)
            tarinfo.mode = 0o666

            tar.addfile(
                tarinfo,
                BytesIO(export_metadata_dumps),
            )

            files_folder = tarfile.TarInfo("files/")
            files_folder.type = tarfile.DIRTYPE
            files_folder.mode = 0o777
            tar.addfile(files_folder)

            for file in files:
                self.logger.info(
                    f"Downloading file {file.uuid} for workspace {workspace_id}"
                )

                _data = self.file_service.download_file_with_uuid(file.uuid)

                self.logger.info(
                    f"Adding file {file.uuid} to tar for workspace {workspace_id}"
                )

                _file_tarinfo = tarfile.TarInfo(name=f"files/{file.uuid}")
                _file_tarinfo.size = len(_data)
                _file_tarinfo.mode = 0o666

                tar.addfile(
                    _file_tarinfo,
                    BytesIO(_data),
                )

        self.logger.info(
            f"Successfully created tar file for workspace {workspace_id} at {tar_file_path}"
        )

        return self._success_response(
            data=tar_file_path,
            message="Exported workspace successfully",
        )
