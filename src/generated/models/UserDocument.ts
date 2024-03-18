/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type UserDocument = {
    /**
     * MongoDB document ObjectID
     */
    _id?: (string | null);
    username?: string;
    password: string;
    roles: Array<string>;
};

