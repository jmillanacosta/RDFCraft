/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_add_ontology_workspaces__workspace_id__ontology__post } from '../models/Body_add_ontology_workspaces__workspace_id__ontology__post';
import type { Body_create_mapping_workspaces__workspace_id__mapping_post } from '../models/Body_create_mapping_workspaces__workspace_id__mapping_post';
import type { WorkspaceDocument } from '../models/WorkspaceDocument';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WorkspacesService {
    /**
     * Get All Workspaces
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static getAllWorkspacesWorkspacesGet(): CancelablePromise<Array<WorkspaceDocument>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workspaces/',
        });
    }
    /**
     * Create Workspace
     * @param name
     * @param description
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static createWorkspaceWorkspacesPost(
        name: string,
        description: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/',
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
     * Get Workspace
     * @param workspaceId
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static getWorkspaceWorkspacesWorkspaceIdGet(
        workspaceId: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/workspaces/{workspace_id}',
            path: {
                'workspace_id': workspaceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Workspace
     * @param workspaceId
     * @param name
     * @param description
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static updateWorkspaceWorkspacesWorkspaceIdPut(
        workspaceId: string,
        name: string,
        description: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/workspaces/{workspace_id}',
            path: {
                'workspace_id': workspaceId,
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
     * Delete Workspace
     * @param workspaceId
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static deleteWorkspaceWorkspacesWorkspaceIdDelete(
        workspaceId: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workspaces/{workspace_id}',
            path: {
                'workspace_id': workspaceId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Mapping
     * @param workspaceId
     * @param name
     * @param description
     * @param formData
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static createMappingWorkspacesWorkspaceIdMappingPost(
        workspaceId: string,
        name: string,
        description: string,
        formData: Body_create_mapping_workspaces__workspace_id__mapping_post,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/{workspace_id}/mapping',
            path: {
                'workspace_id': workspaceId,
            },
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
     * Delete Mapping
     * @param workspaceId
     * @param mappingId
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static deleteMappingWorkspacesWorkspaceIdMappingMappingIdDelete(
        workspaceId: string,
        mappingId: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workspaces/{workspace_id}/mapping/{mapping_id}',
            path: {
                'workspace_id': workspaceId,
                'mapping_id': mappingId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Prefix
     * @param workspaceId
     * @param prefix
     * @param uri
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static addPrefixWorkspacesWorkspaceIdPrefixPost(
        workspaceId: string,
        prefix: string,
        uri: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/{workspace_id}/prefix/',
            path: {
                'workspace_id': workspaceId,
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
     * Delete Prefix
     * @param workspaceId
     * @param prefixId
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static deletePrefixWorkspacesWorkspaceIdPrefixPrefixIdDelete(
        workspaceId: string,
        prefixId: string,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workspaces/{workspace_id}/prefix/{prefix_id}',
            path: {
                'workspace_id': workspaceId,
                'prefix_id': prefixId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Ontology
     * @param workspaceId
     * @param prefixId
     * @param name
     * @param description
     * @param formData
     * @returns WorkspaceDocument Successful Response
     * @throws ApiError
     */
    public static addOntologyWorkspacesWorkspaceIdOntologyPost(
        workspaceId: string,
        prefixId: string,
        name: string,
        description: string,
        formData: Body_add_ontology_workspaces__workspace_id__ontology__post,
    ): CancelablePromise<WorkspaceDocument> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/{workspace_id}/ontology/',
            path: {
                'workspace_id': workspaceId,
            },
            query: {
                'prefix_id': prefixId,
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
     * Delete Ontology
     * @param workspaceId
     * @param ontologyId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteOntologyWorkspacesWorkspaceIdOntologyOntologyIdDelete(
        workspaceId: string,
        ontologyId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/workspaces/{workspace_id}/ontology/{ontology_id}',
            path: {
                'workspace_id': workspaceId,
                'ontology_id': ontologyId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Assign Prefix
     * @param workspaceId
     * @param ontologyId
     * @param prefixId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static assignPrefixWorkspacesWorkspaceIdOntologyOntologyIdAssignPrefixPost(
        workspaceId: string,
        ontologyId: string,
        prefixId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/workspaces/{workspace_id}/ontology/{ontology_id}/assign-prefix',
            path: {
                'workspace_id': workspaceId,
                'ontology_id': ontologyId,
            },
            query: {
                'prefix_id': prefixId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
