import logging
import subprocess
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, cast

from jinja2 import Environment, FileSystemLoader
from kink import inject

from models.file_document import FileDocument
from models.mapping_document import (
    LiteralNodeDataModel,
    MappingDocument,
    MappingModel,
    NodeType,
    ObjectNodeDataModel,
    UriRefNodeDataModel,
)
from models.prefix_document import PrefixDocument
from models.source_document import (
    SourceDocument,
    SourceType,
)
from models.workspace_document import WorkspaceDocument
from services.mapping_service import MappingService
from services.workspace_service import WorkspaceService


@dataclass
class _Prefix:
    prefix: str
    uri: str


@dataclass
class _SourceShort:
    name: str
    access: str
    reference_formulation: str


@dataclass
class _Source(_SourceShort):
    iterator: str


@dataclass
class _PORefData:
    p: str
    value: str
    datatype: Optional[str] = None
    iri: Optional[bool] = None


@dataclass
class _POShort:
    p: str
    o: str


@dataclass
class _Mapping:
    name: str
    source: str
    s: Optional[str] = None
    blanknode: Optional[bool] = None
    po_short: list[_POShort] = field(default_factory=list)
    po_ref_data: list[_PORefData] = field(
        default_factory=list
    )


@inject
class YarrrmlService:
    def __init__(
        self,
        mapping_service: MappingService,
        workspace_service: WorkspaceService,
        yarrrml_template_path: Path,
        temp_storage: Path,
        rmlmapper_path: Path,
        java_memory: str,
    ):
        self.logger = logging.getLogger(__name__)
        self.mapping_service = mapping_service
        self.workspace_service = workspace_service
        self.yarrrml_template_path = yarrrml_template_path
        self.jinja_env = Environment(
            loader=FileSystemLoader(
                self.yarrrml_template_path
            )
        )
        self.temp_storage = temp_storage
        self.rmlmapper_path = rmlmapper_path
        self.java_memory = java_memory

    async def complete_mapping(
        self,
        workspace_id: str,
        mapping_document_id: str,
    ):
        self.logger.info(
            f"Completing mapping for mapping document with id {mapping_document_id}"
        )
        workspace: WorkspaceDocument = (
            await self.workspace_service.get_workspace(
                workspace_id
            )
        )
        mapping_document: MappingDocument = (
            await self.mapping_service.get_mapping(
                mapping_document_id
            )
        )
        prefixes = [
            _Prefix(prefix=prefix.prefix, uri=prefix.uri)
            for prefix in cast(
                list[PrefixDocument], workspace.prefixes
            )
        ]

        current_mapping = cast(
            MappingModel, mapping_document.current_mapping
        )

        _source = cast(
            SourceDocument, mapping_document.source
        )

        await _source.fetch_link(SourceDocument.file)

        _file: FileDocument = cast(
            FileDocument, _source.file
        )

        sources = []
        sources_short = []

        if _source.source_type == SourceType.CSV:
            sources_short.append(
                _SourceShort(
                    name=_source.name,
                    access=_file.path.absolute().as_posix(),
                    reference_formulation="csv",
                )
            )
        elif _source.source_type == SourceType.JSON:
            sources.append(
                _Source(
                    name=_source.name,
                    access=_file.path.absolute().as_posix(),
                    reference_formulation="jsonpath",
                    iterator="$.[*]",
                )
            )

        outgoing_edge_lookup: dict[str, list[str]] = {
            node.id: [
                edge.id
                for edge in current_mapping.edges
                if edge.source == node.id
            ]
            for node in current_mapping.nodes
        }

        all_mappings: list[_Mapping] = []

        for node in current_mapping.nodes:
            if (
                node.type == NodeType.LITERAL
                or node.type == NodeType.URIREF
            ):
                continue

            if not isinstance(
                node.data, ObjectNodeDataModel
            ):
                self.logger.error(
                    f"Wrong node data type for node {node.id}/ Type-data mismatch"
                )
                raise ValueError(
                    "Wrong node data type for node {node.id}/ Type-data mismatch"
                )
            edges = outgoing_edge_lookup.get(node.id, [])

            data = cast(ObjectNodeDataModel, node.data)
            po_short = [
                _POShort(
                    p="a",
                    o=data.rdf_type,
                )
            ]
            po_ref_data = []

            for edge in edges:
                edge_obj = next(
                    (
                        _edge
                        for _edge in current_mapping.edges
                        if _edge.id == edge
                    ),
                    None,
                )
                if edge_obj is None:
                    self.logger.error(
                        f"Edge not found for edge id {edge}"
                    )
                    raise ValueError(
                        f"Edge not found for edge id {edge}"
                    )
                target_node = next(
                    (
                        _node
                        for _node in current_mapping.nodes
                        if _node.id == edge_obj.target
                    ),
                    None,
                )
                if target_node is None:
                    self.logger.error(
                        f"Target node not found for edge {edge}"
                    )
                    raise ValueError(
                        f"Target node not found for edge {edge}"
                    )

                target_data = target_node.data
                edge_data = edge_obj.data

                if target_node.type == NodeType.LITERAL:
                    target_data = cast(
                        LiteralNodeDataModel,
                        target_node.data,
                    )
                    po_ref_data.append(
                        _PORefData(
                            p=edge_data.full_uri,
                            value=target_data.pattern,
                            datatype=target_data.rdf_type,
                        )
                    )
                else:
                    target_data = cast(
                        UriRefNodeDataModel
                        | ObjectNodeDataModel,
                        target_node.data,
                    )
                    po_ref_data.append(
                        _PORefData(
                            p=edge_data.full_uri,
                            value=target_data.pattern,
                            iri=True,
                        )
                    )

            mapping = _Mapping(
                name=node.id,
                source=_source.name,
                s=data.pattern,
                blanknode=data.is_blank_node,
                po_ref_data=po_ref_data,
                po_short=po_short,
            )
            self.logger.info(f"Mapping: {mapping}")

            all_mappings.append(mapping)

        template = self.jinja_env.get_template(
            "mapping.yaml.j2"
        )
        self.logger.info(f"Rendering template")
        rendered_template = template.render(
            prefixes=prefixes,
            mappings=all_mappings,
            sources=sources,
            sources_short=sources_short,
        )

        yarrrml_file = (
            self.temp_storage
            / mapping_document_id
            / f"mapping.yarrrml"
        )
        self.logger.info(
            f"Writing YARRRML to {yarrrml_file}"
        )
        if yarrrml_file.exists():
            yarrrml_file.unlink()
        yarrrml_file.parent.mkdir(
            parents=True, exist_ok=True
        )
        yarrrml_file.write_text(rendered_template)

        rml_file = (
            self.temp_storage
            / mapping_document_id
            / f"mapping.rml.ttl"
        )
        if rml_file.exists():
            rml_file.unlink()
        rml_file.parent.mkdir(parents=True, exist_ok=True)
        cmd = (
            f"yarrrml-parser -i {str(yarrrml_file.absolute())} -o"
            f" {str(rml_file.absolute())}"
        )

        self.logger.info(f"Executing YARRRML parser")

        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            self.logger.error(
                f"Error while executing YARRRML parser: {result.stderr}"
            )
            raise ValueError(
                f"Error while executing YARRRML parser: {result.stderr}"
            )

        rdf_file = (
            self.temp_storage
            / mapping_document_id
            / f"mapping.ttl"
        )

        if rdf_file.exists():
            rdf_file.unlink()

        cmd = (
            f"java -Xmx{self.java_memory} -jar {self.rmlmapper_path} -m {rml_file} -o {rdf_file} -s"
            " turtle"
        )

        self.logger.info(f"Executing RML mapper")

        result = subprocess.run(
            cmd,
            shell=True,
            capture_output=True,
            text=True,
        )

        if result.returncode != 0:
            self.logger.error(
                f"Error while executing RML mapper: {result.stderr}"
            )
            raise ValueError(
                f"Error while executing RML mapper: {result.stderr}"
            )

        self.logger.info(f"Mapping completed")

        rdf_content = rdf_file.read_text()
        rml_content = rml_file.read_text()

        return {
            "yarrrml": rendered_template,
            "rdf": rdf_content,
            "rml": rml_content,
        }
