'use client';

import { FileModel } from '../FileModel';

type SourceType = 'csv' | 'json';

type SourceModel = {
  _id: string;
  name: string;
  description: string;
  source_type: SourceType;
  file: FileModel;
  refs: string[];
};

export type { SourceModel, SourceType };
