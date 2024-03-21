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
}

export default WorkspaceService;
