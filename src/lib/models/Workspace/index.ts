'use client';

import { MappingModel } from '../MappingModel';
import { OntologyModel } from '../OntologyModel';
import { PrefixModel } from '../PrefixModel';
import { SourceModel } from '../SourceModel';

/**
 * class WorkspaceDocument(Document):
    name: str
    description: str
    sources: list[Link[SourceDocument]] = []
    prefixes: list[Link[PrefixDocument]] = []
    ontologies: list[Link[OntologyDocument]] = []
    mappings: list[Link[MappingDocument]] = []
 */

export type WorkspaceModel = {
  _id: string;
  name: string;
  description: string;
  sources: SourceModel[];
  prefixes: PrefixModel[];
  ontologies: OntologyModel[];
  mappings: MappingModel[];
};
