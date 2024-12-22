export type MappingNodeType = 'entity' | 'literal' | 'uri_ref';

export type MappingNode = {
  id: string;
  type: 'entity';
  label: string;
  uri_pattern: string;
  rdf_type: string[];
  properties: string[];
};

export type MappingLiteral = {
  id: string;
  type: 'literal';
  label: string;
  value: string;
  literal_type: string;
};

export type MappingURIRef = {
  id: string;
  type: 'uri_ref';
  uri_pattern: string;
};

export type MappingEdge = {
  id: string;
  source: string;
  target: string;
  source_handle: string;
  target_handle: string;
};

export type MappingGraph = {
  uuid: string;
  name: string;
  description: string;
  source_id: string;
  nodes: (MappingNode | MappingLiteral | MappingURIRef)[];
  edges: MappingEdge[];
};
