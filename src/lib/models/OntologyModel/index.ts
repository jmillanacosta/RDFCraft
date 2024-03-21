'use client';

import { FileModel } from '../FileModel';
import { PrefixModel } from '../PrefixModel';

export type OntologyModel = {
  _id: string;
  id: string;
  name: string;
  description: string;
  prefix: PrefixModel;
  file: FileModel;
};
