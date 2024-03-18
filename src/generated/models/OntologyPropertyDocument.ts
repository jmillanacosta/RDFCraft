/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PropertyType } from './PropertyType';
export type OntologyPropertyDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    full_uri?: string;
    ontology_id: string;
    label: string;
    description: string;
    is_deprecated: boolean;
    property_type: PropertyType;
    property_range: Array<string>;
    property_domain: Array<string>;
};

