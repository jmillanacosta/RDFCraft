export interface Source {
  uuid: string;
  type: 'csv' | 'json';
  references: string[];
  file_uuid: string;
  extra: Record<string, unknown>;
}
