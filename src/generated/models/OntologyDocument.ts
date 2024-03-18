/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type OntologyDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: string;
    description: string;
    file: {
        id: string;
        collection: string;
    };
    prefix: {
        id: string;
        collection: string;
    };
};

