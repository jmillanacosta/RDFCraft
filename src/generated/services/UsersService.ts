/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserDocument } from '../models/UserDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get Users
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static getUsersUsersGet(): CancelablePromise<Array<UserDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/',
        });
    }
    /**
     * Create User
     * @param username
     * @param password
     * @param requestBody
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static createUserUsersPost(
        username: string,
        password: string,
        requestBody: Array<string>,
    ): CancelablePromise<UserDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/',
            query: {
                'username': username,
                'password': password,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Id
     * @param userId
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static getUserByIdUsersUserIdGet(
        userId: string,
    ): CancelablePromise<UserDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * @param userId
     * @param username
     * @param password
     * @param requestBody
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static updateUserUsersUserIdPut(
        userId: string,
        username: string,
        password: string,
        requestBody: Array<string>,
    ): CancelablePromise<UserDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            query: {
                'username': username,
                'password': password,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * @param userId
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static deleteUserUsersUserIdDelete(
        userId: string,
    ): CancelablePromise<UserDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Username
     * @param username
     * @returns UserDocument Successful Response
     * @throws ApiError
     */
    public static getUserByUsernameUsersUsernameUsernameGet(
        username: string,
    ): CancelablePromise<UserDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/username/{username}',
            path: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
