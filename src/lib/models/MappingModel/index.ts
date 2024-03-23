'use client';

import { SourceModel } from '../SourceModel';

type NodeNoteModel = {
    _id: string;
    note: string;
};

type PositionModel = {
    x: number;
    y: number;
};

type NodeTypes = 'object' | 'literal' | 'uriref';

type ObjectNodeDataModel = {
    label: string;
    rdf_type: string;
    is_blank_node: boolean;
    pattern_prefix: string;
    pattern: string;
};

type LiteralNodeDataModel = {
    rdf_type: string;
    pattern: string;
};

type UriRefNodeDataModel = {
    label: string;
    rdf_type: string;
    pattern: string;
};

type NodeModel = {
    _id: string;
    type: NodeTypes;
    position: PositionModel;
    width: number;
    height: number;
    data: ObjectNodeDataModel | LiteralNodeDataModel | UriRefNodeDataModel;
};

type EdgeTypes = 'data_property' | 'object_property';

type EdgeDataModel = {
    label: string;
    full_uri: string;
    predicate_type: EdgeTypes;
};

type EdgeModel = {
    _id: string;
    source: string;
    target: string;
    data: EdgeDataModel;
};

type MappingModel = {
    _id: string;
    nodes: NodeModel[];
    edges: EdgeModel[];
};

type MappingDocument = {
    _id: string;
    id: string;
    name: string;
    source: SourceModel;
    mappings: MappingModel[];
    current_mapping: MappingModel;
    notes: NodeNoteModel[];
};

export type {
    EdgeDataModel,
    EdgeModel,
    EdgeTypes,
    LiteralNodeDataModel,
    MappingDocument,
    MappingModel,
    NodeModel,
    NodeNoteModel,
    NodeTypes,
    ObjectNodeDataModel,
    PositionModel,
    UriRefNodeDataModel,
};
