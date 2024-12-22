import { Edge, Node } from '@xyflow/react';
import {
  MappingEdge,
  MappingLiteral,
  MappingNode,
  MappingURIRef,
} from '../../../../lib/api/mapping_service/types';

export type EntityNodeType = Node<MappingNode, 'entity'>;
export type LiteralNodeType = Node<MappingLiteral, 'literal'>;
export type URIRefNodeType = Node<MappingURIRef, 'uri_ref'>;

export type XYNodeTypes = EntityNodeType | LiteralNodeType | URIRefNodeType;

export type XYEdgeType = Edge<MappingEdge, 'edge'>;
