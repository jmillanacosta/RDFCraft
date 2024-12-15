import { Edge, Node } from '@xyflow/react';
import {
  MappingEdge,
  MappingNode,
} from '../../../../lib/api/mapping_service/types';

export type EntityNodeType = Node<MappingNode, 'entity'>;
export type LiteralNodeType = Node<MappingNode, 'literal'>;
export type URIRefNodeType = Node<MappingNode, 'uri_ref'>;

export type XYNodeTypes = EntityNodeType | LiteralNodeType | URIRefNodeType;

export type XYEdgeType = Edge<MappingEdge, 'edge'>;
