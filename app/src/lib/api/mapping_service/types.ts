export enum MappingNodeType {
  ENTITY = 'entity',
  LITERAL = 'literal',
  URIRef = 'uri_ref',
}

export interface MappingNode {
  id: string;
  type: MappingNodeType.ENTITY;
  label: string;
  uri_pattern: string;
  rdf_type: string[];
}

export interface MappingLiteral {
  id: string;
  type: MappingNodeType.LITERAL;
  label: string;
  value: string;
  literal_type: string;
}

export interface MappingURIRef {
  id: string;
  type: MappingNodeType.URIRef;
  uri_pattern: string;
}

export interface MappingEdge {
  id: string;
  source: string;
  target: string;
  predicate_uri: string;
}

export interface MappingGraph {
  uuid: string;
  name: string;
  description: string;
  source_id: string;
  nodes: (MappingNode | MappingLiteral | MappingURIRef)[];
  edges: MappingEdge[];
}
