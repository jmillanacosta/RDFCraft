import json
import tarfile
from io import BytesIO
from pathlib import Path

from kink import inject

from server.exceptions import ErrCodes, ServerException
from server.facades import (
    BaseFacade,
    FacadeResponse,
)
from server.models.export_metadata import (
    ExportMetadata,
    ExportMetadataType,
)
from server.models.workspace import WorkspaceModel
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
class ImportWorkspaceFacade(BaseFacade):
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
        data: bytes,
    ) -> FacadeResponse:
        self.logger.info("Importing workspace")
        tar_f = tarfile.open(fileobj=BytesIO(data))

        export_metadata_raw = tar_f.extractfile("metadata.json")

        if export_metadata_raw is None:
            raise ServerException(
                "Export metadata not found, the tar is corrupted",
                code=ErrCodes.METADATA_NOT_FOUND,
            )

        export_metadata: ExportMetadata = ExportMetadata.from_dict(
            json.load(export_metadata_raw)
        )

        if (
            export_metadata.type != ExportMetadataType.WORKSPACE
            or export_metadata.workspace_metadata is None
            or export_metadata.workspace_model is None
            or export_metadata.ontologies is None
        ):
            raise ServerException(
                "The export is not a workspace",
                code=ErrCodes.WRONG_IMPORT_TYPE,
            )

        self.logger.info("Creating workspace with metadata")

        _workspace_metadata = export_metadata.workspace_metadata

        self.logger.info("Creating workspace metadata")

        new_workspace_metadata = (
            self.workspace_metadata_service.create_workspace_metadata(
                name=_workspace_metadata.name,
                description=_workspace_metadata.description,
                type=_workspace_metadata.type,
                location="",  # Ignoring location to avoid conflicts
            )
        )

        self.logger.info("Creating workspace")

        new_workspace = WorkspaceModel.create_with_defaults(
            uuid=new_workspace_metadata.uuid,
            name=new_workspace_metadata.name,
            description=new_workspace_metadata.description,
            type=new_workspace_metadata.type,
            location=new_workspace_metadata.location,
        )

        new_workspace.prefixes = export_metadata.workspace_model.prefixes

        self.logger.info("Workspace created")

        self.logger.info("Importing sources")

        source_mapping: dict[str, str] = {}

        for source in export_metadata.sources:
            file_raw = tar_f.extractfile(f"files/{source.file_uuid}")
            if file_raw is None:
                raise ServerException(
                    f"File {source.file_uuid} not found",
                    code=ErrCodes.CORRUPTED_TAR,
                )
            new_source_id = self.source_service.create_source(
                source.type, file_raw.read(), source.extra
            )

            source_mapping[source.uuid] = new_source_id

        self.logger.info("Importing mappings")

        for mapping in export_metadata.mappings:
            new_mapping_uuid = self.mapping_service.create_mapping(
                mapping.name,
                mapping.description,
                source_mapping[mapping.source_id],
            )
            new_mapping = self.mapping_service.get_mapping(new_mapping_uuid)
            new_mapping.edges = mapping.edges
            new_mapping.nodes = mapping.nodes
            self.mapping_service.update_mapping(new_mapping_uuid, new_mapping)
            new_workspace.mappings.append(new_mapping_uuid)

        self.logger.info("Importing ontologies")

        for ontology in export_metadata.ontologies:
            file_raw = tar_f.extractfile(f"files/{ontology.file_uuid}")
            if file_raw is None:
                raise ServerException(
                    f"File {ontology.file_uuid} not found",
                    code=ErrCodes.CORRUPTED_TAR,
                )
            new_ontology = self.ontology_service.create_ontology(
                name=ontology.name,
                description=ontology.description,
                base_uri=ontology.base_uri,
                content=file_raw.read(),
            )
            new_workspace.ontologies.append(new_ontology.uuid)

        self.logger.info("Importing files")

        self.workspace_service.create_workspace(workspace=new_workspace)

        return self._success_response(
            data=new_workspace.uuid,
            message="Workspace imported",
        )
