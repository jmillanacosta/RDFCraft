/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_mapping_mappings__post } from '../models/Body_create_mapping_mappings__post';
import type { MappingDocument } from '../models/MappingDocument';
import type { SaveRequest } from '../models/SaveRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MappingsService {
    /**
     * Create Mapping
     * @param name
     * @param description
     * @param formData
     * @returns MappingDocument Successful Response
     * @throws ApiError
     */
    public static createMappingMappingsPost(
        name: string,
        description: string,
        formData: Body_create_mapping_mappings__post,
    ): CancelablePromise<MappingDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mappings/',
            query: {
                'name': name,
                'description': description,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Mapping
     * @param mappingId
     * @returns MappingDocument Successful Response
     * @throws ApiError
     */
    public static getMappingMappingsMappingIdGet(
        mappingId: string,
    ): CancelablePromise<MappingDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/mappings/{mapping_id}',
            path: {
                'mapping_id': mappingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Mapping
     * @param mappingId
     * @returns string Successful Response
     * @throws ApiError
     */
    public static deleteMappingMappingsMappingIdDelete(
        mappingId: string,
    ): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/mappings/{mapping_id}',
            path: {
                'mapping_id': mappingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Revert Mapping
     * @param mappingId
     * @param mappingModelId
     * @returns MappingDocument Successful Response
     * @throws ApiError
     */
    public static revertMappingMappingsMappingIdRevertMappingModelIdPost(
        mappingId: string,
        mappingModelId: string,
    ): CancelablePromise<MappingDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mappings/{mapping_id}/revert/{mapping_model_id}',
            path: {
                'mapping_id': mappingId,
                'mapping_model_id': mappingModelId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Save Mapping
     * @param mappingId
     * @param requestBody
     * @returns MappingDocument Successful Response
     * @throws ApiError
     */
    public static saveMappingMappingsMappingIdSavePost(
        mappingId: string,
        requestBody: SaveRequest,
    ): CancelablePromise<MappingDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/mappings/{mapping_id}/save',
            path: {
                'mapping_id': mappingId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
