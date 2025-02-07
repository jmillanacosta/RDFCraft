import encodeFileToBase64 from '../../../utils/base64encoder';
import ApiService from '../../services/api_service';
import { MappingGraph } from './types';

class MappingService {
  private static getApiClient(): ApiService {
    return ApiService.getInstance('default');
  }

  public static async getMappingsInWorkspace(
    workspaceUuid: string,
  ): Promise<MappingGraph[]> {
    const result = await this.getApiClient().callApi<MappingGraph[]>(
      `/workspaces/${workspaceUuid}/mapping`,
      {
        method: 'GET',
        parser: data => data as MappingGraph[],
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get mappings: ${result.message} (status: ${result.status})`,
    );
  }

  public static async getMappingInWorkspace(
    workspaceUuid: string,
    mappingUuid: string,
  ): Promise<MappingGraph> {
    const result = await this.getApiClient().callApi<MappingGraph>(
      `/workspaces/${workspaceUuid}/mapping/${mappingUuid}`,
      {
        method: 'GET',
        parser: data => data as MappingGraph,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get mapping: ${result.message} (status: ${result.status})`,
    );
  }

  public static async createMappingInWorkspace(
    workspaceUuid: string,
    name: string,
    description: string,
    content: File,
    sourceType: 'csv' | 'json',
    extra: Record<string, unknown>,
  ): Promise<boolean> {
    const base64EncodedFile = await encodeFileToBase64(content);
    const data = {
      name,
      description,
      content: base64EncodedFile,
      source_type: sourceType,
      extra,
    };

    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/mapping`,
      {
        method: 'POST',
        body: data,
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to create mapping: ${result.message} (status: ${result.status})`,
    );
  }

  public static async deleteMappingInWorkspace(
    workspaceUuid: string,
    mappingUuid: string,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/mapping/${mappingUuid}`,
      {
        method: 'DELETE',
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to delete mapping: ${result.message} (status: ${result.status})`,
    );
  }

  public static async updateMapping(
    workspaceUuid: string,
    mappingUuid: string,
    data: MappingGraph,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/mapping/${mappingUuid}`,
      {
        method: 'PUT',
        body: data,
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to update mapping: ${result.message} (status: ${result.status})`,
    );
  }

  public static async importMapping(
    data: File,
    workspaceUuid: string,
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append('tar', data);
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/mapping/import`,
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
      `Failed to import mapping: ${result.message} (status: ${result.status})`,
    );
  }
}

export default MappingService;
