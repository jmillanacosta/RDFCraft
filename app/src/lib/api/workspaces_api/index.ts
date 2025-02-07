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

  public static async exportWorkspace(uuid: string): Promise<{
    blob: Blob;
    fileName: string;
  }> {
    const result = await this.getApiClient().callApi<{
      blob: Blob;
      fileName: string
    }>(
      `/workspaces/${uuid}/export`,
      {
        method: 'GET',
        parser: (data) => data as { blob: Blob; fileName: string },
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to export workspace: ${result.message} (status: ${result.status})`,
    );
  }

  public static async importWorkspace(
    file: File,
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append('tar', file);

    const result = await this.getApiClient().callApi<boolean>(
      '/workspaces/import',
      {
        method: 'POST',
        body: formData,
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to import workspace: ${result.message} (status: ${result.status})`,
    );
  }
}

export default WorkspacesApi;
