/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_create_source_sources__post } from '../models/Body_create_source_sources__post';
import type { Body_update_source_file_sources__source_id__file_put } from '../models/Body_update_source_file_sources__source_id__file_put';
import type { SourceDocument } from '../models/SourceDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SourcesService {
    /**
     * Get Sources
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static getSourcesSourcesGet(): CancelablePromise<Array<SourceDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sources/',
        });
    }
    /**
     * Create Source
     * @param name
     * @param description
     * @param formData
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static createSourceSourcesPost(
        name: string,
        description: string,
        formData: Body_create_source_sources__post,
    ): CancelablePromise<SourceDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sources/',
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
     * Get Source
     * @param sourceId
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static getSourceSourcesSourceIdGet(
        sourceId: string,
    ): CancelablePromise<SourceDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sources/{source_id}',
            path: {
                'source_id': sourceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove Source
     * @param sourceId
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static removeSourceSourcesSourceIdDelete(
        sourceId: string,
    ): CancelablePromise<SourceDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/sources/{source_id}',
            path: {
                'source_id': sourceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Source
     * @param sourceId
     * @param name
     * @param description
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static updateSourceSourcesSourceIdPut(
        sourceId: string,
        name: string,
        description: string,
    ): CancelablePromise<SourceDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sources/{source_id}',
            path: {
                'source_id': sourceId,
            },
            query: {
                'name': name,
                'description': description,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Source File
     * @param sourceId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSourceFileSourcesSourceIdFileGet(
        sourceId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sources/{source_id}/file',
            path: {
                'source_id': sourceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Source File
     * @param sourceId
     * @param formData
     * @returns SourceDocument Successful Response
     * @throws ApiError
     */
    public static updateSourceFileSourcesSourceIdFilePut(
        sourceId: string,
        formData: Body_update_source_file_sources__source_id__file_put,
    ): CancelablePromise<SourceDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/sources/{source_id}/file',
            path: {
                'source_id': sourceId,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
