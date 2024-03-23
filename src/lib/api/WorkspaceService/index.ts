'use client';

import { PrefixModel } from '@/lib/models/PrefixModel';
import { WorkspaceModel } from '@/lib/models/Workspace';
import { ApiCallResponse, callApi } from '../ApiCall';

class WorkspaceService {
    static async fetchAllWorkspaces(): Promise<
        ApiCallResponse<WorkspaceModel[]>
    > {
        return await callApi<WorkspaceModel[]>({
            endpoint: '/api/workspaces',
        });
    }

    static async fetchWorkspaceById(
        id: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}`,
        });
    }

    static async createWorkspace(
        name: string,
        description: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: '/api/workspaces',
            method: 'POST',
            query: { name, description },
        });
    }

    static async deleteWorkspace(
        id: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}`,
            method: 'DELETE',
        });
    }

    static async addPrefixToWorkspace(
        id: string,
        prefixModel: PrefixModel,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}/prefix`,
            method: 'POST',
            query: {
                prefix: prefixModel.prefix,
                uri: prefixModel.uri,
            },
        });
    }

    static async removePrefixFromWorkspace(
        id: string,
        prefixId: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}/prefix/${prefixId}`,
            method: 'DELETE',
        });
    }

    static async addOntologyToWorkspace(
        id: string,
        name: string,
        description: string,
        prefix_id: string,
        file: File,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        const formData = new FormData();
        formData.append('file', file);
        const query = { name, description, prefix_id };
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}/ontology/`,
            method: 'POST',
            body: formData,
            query: query,
            formData: true,
            timeout: 0, // no timeout
        });
    }

    static async removeOntologyFromWorkspace(
        id: string,
        ontologyId: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}/ontology/${ontologyId}`,
            method: 'DELETE',
        });
    }

    static async assignPrefixToOntology(
        id: string,
        ontology_Id: string,
        prefix_id: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${id}/ontology/${ontology_Id}/assign-prefix`,
            query: { prefix_id },
            method: 'POST',
        });
    }

    static async addMappingToWorkspace(
        workspaceId: string,
        name: string,
        description: string,
        file: File,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        const formData = new FormData();
        formData.append('file', file);
        const query = { name, description };
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${workspaceId}/mapping/`,
            method: 'POST',
            body: formData,
            query: query,
            formData: true,
            timeout: 0, // no timeout
        });
    }

    static async removeMappingFromWorkspace(
        workspaceId: string,
        mappingId: string,
    ): Promise<ApiCallResponse<WorkspaceModel>> {
        return await callApi<WorkspaceModel>({
            endpoint: `/api/workspaces/${workspaceId}/mapping/${mappingId}`,
            method: 'DELETE',
        });
    }
}

export default WorkspaceService;
