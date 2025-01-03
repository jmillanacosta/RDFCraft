import datetime
from pathlib import Path
from typing import cast

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
class MappingToYARRRMLService(
    MappingToYARRRMLServiceProtocol
):
    def __init__(self, TEMP_DIR: Path) -> None:
        self.temp_dir = TEMP_DIR

    def convert_mapping_to_yarrrml(
        self,
        prefixes: dict[str, str],
        source: Source,
        mapping: MappingGraph,
        fs_service: FSServiceProtocol,  # Implementation might change depending the environment (local, cloud, etc)
    ) -> str:
        yarrrml_dict: dict = {
            "prefixes": prefixes,
        }

        source_dict: dict = {}

        match source.type:
            case SourceType.CSV:
                source_dict["data"] = {
                    "access": str(
                        fs_service.provide_file_path_of_uuid(
                            source.uuid
                        ).absolute()
                    ),
                    "referenceFormulation": "csv",
                }

            case SourceType.JSON:
                source_dict["data"] = {
                    "access": str(
                        fs_service.provide_file_path_of_uuid(
                            source.uuid
                        ).absolute()
                    ),
                    "referenceFormulation": "json",
                    "iterator": source.extra["json_path"],
                }

        yarrrml_dict["sources"] = source_dict

        # Mappings

        mappings: dict = {}

        entities: list[MappingNode] = [
            cast(MappingNode, node)
            for node in mapping.nodes
            if node.type == MappingNodeType.ENTITY
        ]

        for entity in entities:
            if entity.uri_pattern == "":
                raise ServerException(
                    f"Entity {entity.label} has no URI pattern",
                    code=ErrCodes.ENTITY_URI_PATTERN_NOT_FOUND,
                )
            entity_dict: dict = {
                "source": "data",
                "s": entity.uri_pattern,
            }
            po: list[dict | list] = [
                {
                    "predicate": "http://www.w3.org/1999/02/22-rdf-syntax-ns#label",
                    "object": entity.label,
                }
            ]

            for rdf_type in entity.rdf_type:
                po.append(
                    {
                        "predicate": "a",
                        "object": rdf_type,
                        "type": "iri",
                    }
                )

            outgoing_edges_target_nodes: list[
                tuple[
                    MappingEdge,
                    MappingNode
                    | MappingLiteral
                    | MappingURIRef,
                ]
            ] = self._get_outgoing_edges(entity, mapping)

            for (
                edge,
                target_node,
            ) in outgoing_edges_target_nodes:
                if isinstance(target_node, MappingLiteral):
                    if target_node.value == "":
                        raise ServerException(
                            f"Literal with id {target_node.id} has no value",
                            code=ErrCodes.LITERAL_VALUE_NOT_FOUND,
                        )
                    po.append(
                        {
                            "predicate": edge.source_handle,
                            "object": {
                                "value": target_node.value,
                                "datatype": target_node.literal_type,
                            },
                        }
                    )
                elif isinstance(target_node, MappingURIRef):
                    if target_node.uri_pattern == "":
                        raise ServerException(
                            f"URIRef with id {target_node.id} has no URI pattern",
                            code=ErrCodes.URIREF_URI_PATTERN_NOT_FOUND,
                        )
                    po.append(
                        {
                            "predicate": edge.source_handle,
                            "object": {
                                "value": target_node.uri_pattern,
                                "type": "iri",
                            },
                        }
                    )
                elif isinstance(target_node, MappingNode):
                    if target_node.uri_pattern == "":
                        raise ServerException(
                            f"Node with id {target_node.id} has no URI pattern",
                            code=ErrCodes.ENTITY_URI_PATTERN_NOT_FOUND,
                        )
                    po.append(
                        {
                            "predicate": edge.source_handle,
                            "object": {
                                "value": target_node.uri_pattern,
                                "type": "iri",
                            },
                        }
                    )

            entity_dict["po"] = po

            mappings[entity.id] = entity_dict

        yarrrml_dict["mappings"] = mappings

        yaml_str = yaml.dump(
            yarrrml_dict,
            sort_keys=False,
            default_flow_style=False,
        )

        # Write the YARRRML to a temporary file

        temp_file_path: Path = (
            self.temp_dir
            / f"yarrrml-{mapping.name}-{datetime.datetime.now().isoformat()}.yml"
        )

        temp_file_path.touch()

        temp_file_path.write_text(yaml_str)

        return yaml_str

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
                MappingNode
                | MappingLiteral
                | MappingURIRef,
            ]
        ] = []

        for edge in mapping.edges:
            if edge.source == node.id:
                target_node_iter = filter(
                    lambda n, e=edge: n.id == e.target,
                    mapping.nodes,
                )
                target_node = next(target_node_iter)
                if target_node is not None:
                    outgoing_edges.append(
                        (edge, target_node)
                    )
                else:
                    raise ServerException(
                        f"Target node with id {edge.target} not found",
                        code=ErrCodes.MAPPING_EDGE_ID_NOT_FOUND,
                    )

        return outgoing_edges
