/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SourceType } from './SourceType';
export type SourceDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    name: string;
    description: string;
    source_type: SourceType;
    file: {
        id: string;
        collection: string;
    };
    refs: Array<string>;
};

