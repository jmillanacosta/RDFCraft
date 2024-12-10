interface Workspace {
  uuid: string;
  name: string;
  description: string;
  type: 'local' | 'remote';
  location: string;
  sources: string[];
  mappings: string[];
  prefixes: Record<string, string>[];
  ontologies: string[];
  used_uri_patterns: string[];
  enabled_features: string[];
}

interface CreateWorkspaceMetadata {
  name: string;
  description: string;
  type: 'local' | 'remote';
  location: string;
}

export type { CreateWorkspaceMetadata, Workspace };
