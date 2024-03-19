'use client';

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
}

export default WorkspaceService;
