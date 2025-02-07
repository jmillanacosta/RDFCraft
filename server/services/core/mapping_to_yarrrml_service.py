import datetime
import logging
from pathlib import Path
from typing import Any, cast

import yaml
from kink import inject

from server.exceptions import ErrCodes, ServerException
from server.models.mapping import (
    MappingEdge,
    MappingGraph,
    MappingLiteral,
    MappingNode,
    MappingNodeType,
    MappingURIRef,
)
from server.models.source import Source, SourceType
from server.service_protocols.mapping_to_yarrrml_service_protocol import (
    FSServiceProtocol,
    MappingToYARRRMLServiceProtocol,
)


@inject(alias=MappingToYARRRMLServiceProtocol)
class MappingToYARRRMLService(MappingToYARRRMLServiceProtocol):
    def __init__(self, TEMP_DIR: Path) -> None:
        self.logger = logging.getLogger(__name__)
        self.temp_dir = TEMP_DIR

    def convert_mapping_to_yarrrml(
        self,
        prefixes: dict[str, str],
        source: Source,
        mapping: MappingGraph,
        fs_service: FSServiceProtocol,  # Implementation might change depending the environment (local, cloud, etc)
    ) -> str:
        try:
            self.logger.info(f"Converting mapping {mapping.name} to YARRRML")
            yarrrml_dict: dict = {
                "prefixes": prefixes,
            }

            source_path = self._prepare_source_file(source, fs_service)
            yarrrml_dict["sources"] = self._get_source_dict(source, source_path)

            yarrrml_dict["mappings"] = self._get_mappings_dict(mapping)

            # Delete any empty keys

            yarrrml_dict = {k: v for k, v in yarrrml_dict.items() if len(v) > 0}

            yaml_str = yaml.dump(
                yarrrml_dict,
                sort_keys=False,
                default_flow_style=False,
            )

            # Write the YARRRML to a temporary file

            temp_file_path: Path = (
                self.temp_dir
                / f"yarrrml-{mapping.name}-{datetime.datetime.now().isoformat().replace(':', '_')}.yml"
            )

            temp_file_path.touch()

            temp_file_path.write_text(yaml_str)

            return yaml_str

        except Exception as e:
            self.logger.error(
                "Failed to convert mapping to YARRRML",
                exc_info=e,
            )

            raise e

    def _prepare_source_file(
        self, source: Source, fs_service: FSServiceProtocol
    ) -> Path:
        self.logger.info(
            "Downloading source file content, to workaround a limitation in the RMLMapper (files must have a extension)"
        )
        source_content = fs_service.download_file_with_uuid(source.file_uuid)

        extension = "csv" if source.type == SourceType.CSV else "json"

        source_path = self.temp_dir / f"{source.file_uuid}.{extension}"

        self.logger.info(f"Writing source file content to {source_path}")

        if source_path.exists():
            source_path.unlink()

        source_path.touch()

        source_path.write_bytes(source_content)

        return source_path

    def _get_source_dict(self, source: Source, source_path: Path) -> dict:
        source_dict: dict = {}

        match source.type:
            case SourceType.CSV:
                source_dict["data"] = {
                    "access": str(source_path.absolute()),
                    "referenceFormulation": "csv",
                }

            case SourceType.JSON:
                source_dict["data"] = {
                    "access": str(source_path.absolute()),
                    "referenceFormulation": "jsonpath",
                    "iterator": source.extra["json_path"],
                }

        return source_dict

    def _get_mappings_dict(self, mapping: MappingGraph) -> dict:
        mappings: dict = {}

        entities: list[MappingNode] = [
            cast(MappingNode, node)
            for node in mapping.nodes
            if node.type == MappingNodeType.ENTITY
        ]

        for entity in entities:
            self._validate_entity(entity)
            entity_dict = self._create_entity_dict(entity)
            po = self._create_po_list(entity)
            outgoing_edges_target_nodes = self._get_outgoing_edges(entity, mapping)

            for (
                edge,
                target_node,
            ) in outgoing_edges_target_nodes:
                po.append(self._create_po_entry(edge, target_node))

            entity_dict["po"] = po
            mappings[entity.id] = entity_dict

        return mappings

    def _validate_entity(self, entity: MappingNode) -> None:
        if entity.uri_pattern == "":
            raise ServerException(
                f"Entity {entity.label} has no URI pattern",
                code=ErrCodes.ENTITY_URI_PATTERN_NOT_FOUND,
            )

    def _create_entity_dict(self, entity: MappingNode) -> dict:
        return {
            "source": "data",
            "s": entity.uri_pattern,
        }

    def _create_po_list(self, entity: MappingNode) -> list:
        po: list[dict[str, Any]] = []

        for rdf_type in entity.rdf_type:
            po.append(
                {
                    "predicate": "a",
                    "object": rdf_type,
                    "type": "iri",
                }
            )

        return po

    def _create_po_entry(
        self,
        edge: MappingEdge,
        target_node: MappingNode | MappingLiteral | MappingURIRef,
    ) -> dict:
        if isinstance(target_node, MappingLiteral):
            if target_node.value == "":
                raise ServerException(
                    f"Literal with id {target_node.id} has no value",
                    code=ErrCodes.LITERAL_VALUE_NOT_FOUND,
                )
            return {
                "predicate": edge.source_handle,
                "object": {
                    "value": target_node.value,
                    "datatype": target_node.literal_type,
                },
            }
        elif isinstance(target_node, MappingURIRef):
            if target_node.uri_pattern == "":
                raise ServerException(
                    f"URIRef with id {target_node.id} has no URI pattern",
                    code=ErrCodes.URIREF_URI_PATTERN_NOT_FOUND,
                )
            return {
                "predicate": edge.source_handle,
                "object": {
                    "value": target_node.uri_pattern,
                    "type": "iri",
                },
            }
        elif isinstance(target_node, MappingNode):
            if target_node.uri_pattern == "":
                raise ServerException(
                    f"Node with id {target_node.id} has no URI pattern",
                    code=ErrCodes.ENTITY_URI_PATTERN_NOT_FOUND,
                )
            return {
                "predicate": edge.source_handle,
                "object": {
                    "value": target_node.uri_pattern,
                    "type": "iri",
                },
            }

    def _get_outgoing_edges(
        self, node: MappingNode, mapping: MappingGraph
    ) -> list[
        tuple[
            MappingEdge,
            MappingNode | MappingLiteral | MappingURIRef,
        ]
    ]:
        outgoing_edges: list[
            tuple[
                MappingEdge,
                MappingNode | MappingLiteral | MappingURIRef,
            ]
        ] = []

        for edge in mapping.edges:
            if edge.source == node.id:
                target_node_iter = filter(
                    lambda n, e=edge: n.id == e.target,
                    mapping.nodes,
                )
                target_node = next(target_node_iter, None)
                if target_node is not None:
                    outgoing_edges.append((edge, target_node))
                else:
                    raise ServerException(
                        f"Target node with id {edge.target} not found",
                        code=ErrCodes.MAPPING_EDGE_ID_NOT_FOUND,
                    )

        return outgoing_edges
