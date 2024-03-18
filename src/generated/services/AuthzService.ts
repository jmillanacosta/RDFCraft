/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorizationDocument } from '../models/AuthorizationDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthzService {
    /**
     * Get Authorization Document
     * @param collection
     * @param document
     * @returns AuthorizationDocument Successful Response
     * @throws ApiError
     */
    public static getAuthorizationDocumentAuthzCollectionDocumentGet(
        collection: string,
        document: string,
    ): CancelablePromise<AuthorizationDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authz/{collection}/{document}',
            path: {
                'collection': collection,
                'document': document,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add User To Resource
     * @param collection
     * @param document
     * @param userId
     * @param accessLevel
     * @returns AuthorizationDocument Successful Response
     * @throws ApiError
     */
    public static addUserToResourceAuthzCollectionDocumentAddUserIdAccessLevelPost(
        collection: string,
        document: string,
        userId: string,
        accessLevel: string,
    ): CancelablePromise<AuthorizationDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authz/{collection}/{document}/add/{user_id}/{access_level}',
            path: {
                'collection': collection,
                'document': document,
                'user_id': userId,
                'access_level': accessLevel,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Remove User From Resource
     * @param collection
     * @param document
     * @param userId
     * @returns AuthorizationDocument Successful Response
     * @throws ApiError
     */
    public static removeUserFromResourceAuthzCollectionDocumentRemoveUserIdPost(
        collection: string,
        document: string,
        userId: string,
    ): CancelablePromise<AuthorizationDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authz/{collection}/{document}/remove/{user_id}',
            path: {
                'collection': collection,
                'document': document,
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
