/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodeNoteModel } from './NodeNoteModel';
export type MappingDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: string;
    source: {
        id: string;
        collection: string;
    };
    mappings: Array<{
        id: string;
        collection: string;
    }>;
    current_mapping: {
        id: string;
        collection: string;
    };
    notes?: Array<NodeNoteModel>;
};

