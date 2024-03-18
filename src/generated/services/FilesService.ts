/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_upload_file_files_upload_post } from '../models/Body_upload_file_files_upload_post';
import type { FileDocument } from '../models/FileDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FilesService {
    /**
     * Get File Document
     * @param fileId
     * @returns FileDocument Successful Response
     * @throws ApiError
     */
    public static getFileDocumentFilesFileIdGet(
        fileId: string,
    ): CancelablePromise<FileDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{file_id}',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Download File
     * @param fileId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static downloadFileFilesFileIdDownloadGet(
        fileId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/files/{file_id}/download',
            path: {
                'file_id': fileId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Upload File
     * @param formData
     * @returns FileDocument Successful Response
     * @throws ApiError
     */
    public static uploadFileFilesUploadPost(
        formData: Body_upload_file_files_upload_post,
    ): CancelablePromise<FileDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/files/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
