/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthorizationRecordModel } from './AuthorizationRecordModel';
export type AuthorizationDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    collection?: string;
    object_id?: string;
    records?: Array<AuthorizationRecordModel>;
};

