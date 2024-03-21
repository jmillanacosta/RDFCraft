'use client';

import { WorkspaceModel } from '@/lib/models/Workspace';
import { ApiCallResponse, callApi } from '../ApiCall';
import { PrefixModel } from '@/lib/models/PrefixModel';

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
    ontologyId: string,
    prefix_id: string,
  ): Promise<ApiCallResponse<WorkspaceModel>> {
    return await callApi<WorkspaceModel>({
      endpoint: `/api/workspaces/${id}/ontology/${ontologyId}/`,
      query: { prefix_id },
      method: 'POST',
    });
  }
}

export default WorkspaceService;
