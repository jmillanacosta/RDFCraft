interface WorkspaceMetadata {
  uuid: string;
  name: string;
  description: string;
  type: 'local' | 'remote';
  location: string;
  enabled_features: string[];
}

interface CreateWorkspaceMetadata {
  name: string;
  description: string;
  type: 'local' | 'remote';
  location: string;
}

export type { CreateWorkspaceMetadata, WorkspaceMetadata };
