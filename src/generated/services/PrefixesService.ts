/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PrefixDocument } from '../models/PrefixDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PrefixesService {
    /**
     * Get Prefixes
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static getPrefixesPrefixesGet(): CancelablePromise<Array<PrefixDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/prefixes/',
        });
    }
    /**
     * Create Prefix
     * @param prefix
     * @param uri
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static createPrefixPrefixesPost(
        prefix: string,
        uri: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/prefixes/',
            query: {
                'prefix': prefix,
                'uri': uri,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Prefix By Id
     * @param prefixId
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static getPrefixByIdPrefixesPrefixIdGet(
        prefixId: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/prefixes/{prefix_id}',
            path: {
                'prefix_id': prefixId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Prefix
     * @param prefixId
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static deletePrefixPrefixesPrefixIdDelete(
        prefixId: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/prefixes/{prefix_id}',
            path: {
                'prefix_id': prefixId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Prefix
     * @param prefixId
     * @param prefix
     * @param uri
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static updatePrefixPrefixesPrefixIdPut(
        prefixId: string,
        prefix: string,
        uri: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/prefixes/{prefix_id}',
            path: {
                'prefix_id': prefixId,
            },
            query: {
                'prefix': prefix,
                'uri': uri,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Prefix By Prefix
     * @param prefix
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static getPrefixByPrefixPrefixesPrefixPrefixGet(
        prefix: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/prefixes/prefix/{prefix}',
            path: {
                'prefix': prefix,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Prefix By Uri
     * @param uri
     * @returns PrefixDocument Successful Response
     * @throws ApiError
     */
    public static getPrefixByUriPrefixesUriUriGet(
        uri: string,
    ): CancelablePromise<PrefixDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/prefixes/uri/{uri}',
            path: {
                'uri': uri,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
