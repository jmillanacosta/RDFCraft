/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_ontology_ontologies__post } from '../models/Body_create_ontology_ontologies__post';
import type { OntologyClassDocument } from '../models/OntologyClassDocument';
import type { OntologyDocument } from '../models/OntologyDocument';
import type { OntologyIndividualModel } from '../models/OntologyIndividualModel';
import type { OntologyPropertyDocument } from '../models/OntologyPropertyDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OntologiesService {
    /**
     * Get Ontologies
     * @param ontologyId
     * @returns OntologyDocument Successful Response
     * @throws ApiError
     */
    public static getOntologiesOntologiesOntologyIdGet(
        ontologyId: string,
    ): CancelablePromise<OntologyDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontologies/{ontology_id}',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Ontology
     * @param ontologyId
     * @returns OntologyDocument Successful Response
     * @throws ApiError
     */
    public static deleteOntologyOntologiesOntologyIdDelete(
        ontologyId: string,
    ): CancelablePromise<OntologyDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/ontologies/{ontology_id}',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Ontology
     * @param name
     * @param description
     * @param prefixId
     * @param formData
     * @returns OntologyDocument Successful Response
     * @throws ApiError
     */
    public static createOntologyOntologiesPost(
        name: string,
        description: string,
        prefixId: string,
        formData: Body_create_ontology_ontologies__post,
    ): CancelablePromise<OntologyDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/ontologies/',
            query: {
                'name': name,
                'description': description,
                'prefix_id': prefixId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download Ontology File
     * @param ontologyId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadOntologyFileOntologiesOntologyIdFileDownloadGet(
        ontologyId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontologies/{ontology_id}/file/download',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ontology Classes
     * @param ontologyId
     * @returns OntologyClassDocument Successful Response
     * @throws ApiError
     */
    public static getOntologyClassesOntologiesOntologyIdClassesGet(
        ontologyId: string,
    ): CancelablePromise<Array<OntologyClassDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontologies/{ontology_id}/classes',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ontology Data Properties
     * @param ontologyId
     * @returns OntologyPropertyDocument Successful Response
     * @throws ApiError
     */
    public static getOntologyDataPropertiesOntologiesOntologyIdPropertiesGet(
        ontologyId: string,
    ): CancelablePromise<Array<OntologyPropertyDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontologies/{ontology_id}/properties',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Ontology Individuals
     * @param ontologyId
     * @returns OntologyIndividualModel Successful Response
     * @throws ApiError
     */
    public static getOntologyIndividualsOntologiesOntologyIdIndividualsGet(
        ontologyId: string,
    ): CancelablePromise<Array<OntologyIndividualModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/ontologies/{ontology_id}/individuals',
            path: {
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
