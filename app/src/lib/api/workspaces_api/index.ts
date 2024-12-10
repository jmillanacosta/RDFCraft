import ApiService from '../../services/api_service';
import { CreateWorkspaceMetadata, Workspace } from './types';

class WorkspacesApi {
  private static getApiClient(): ApiService {
    return ApiService.getInstance('default');
  }

  public static async getWorkspaces(): Promise<Workspace[]> {
    const result = await this.getApiClient().callApi<Workspace[]>(
      '/workspaces/',
      {
        method: 'GET',
        parser: data => data as Workspace[],
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get workspaces: ${result.message} (status: ${result.status})`,
    );
  }

  public static async getWorkspace(uuid: string): Promise<Workspace> {
    const result = await this.getApiClient().callApi<Workspace>(
      `/workspaces/${uuid}`,
      {
        method: 'GET',
        parser: data => data as Workspace,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get workspace: ${result.message} (status: ${result.status})`,
    );
  }

  public static async createWorkspace(
    workspace: CreateWorkspaceMetadata,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>('/workspaces/', {
      method: 'POST',
      body: workspace,
      parser: () => true,
    });

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to create workspace: ${result.message} (status: ${result.status})`,
    );
  }

  public static async deleteWorkspace(uuid: string): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${uuid}`,
      {
        method: 'DELETE',
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to delete workspace: ${result.message} (status: ${result.status})`,
    );
  }
}

export default WorkspacesApi;
