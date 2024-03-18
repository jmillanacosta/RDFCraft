/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type WorkspaceDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: string;
    description: string;
    sources?: Array<{
        id: string;
        collection: string;
    }>;
    prefixes?: Array<{
        id: string;
        collection: string;
    }>;
    ontologies?: Array<{
        id: string;
        collection: string;
    }>;
    mappings?: Array<{
        id: string;
        collection: string;
    }>;
};

