import ApiService from '../../services/api_service';
import { Prefix } from './types';

class PrefixApi {
  private static getApiClient(): ApiService {
    return ApiService.getInstance('default');
  }

  public static async getPrefixesInWorkspace(
    workspaceUuid: string,
  ): Promise<Prefix[]> {
    const result = await this.getApiClient().callApi<Prefix[], object>(
      `/workspaces/${workspaceUuid}/prefix`,
      {
        method: 'GET',
        parser: data => {
          // key: prefix, value: uri
          return Object.entries(data).map(([prefix, uri]) => ({ prefix, uri }));
        },
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get prefixes: ${result.message} (status: ${result.status})`,
    );
  }

  public static async addPrefixToWorkspace(
    workspaceUuid: string,
    prefix: Prefix,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/prefix`,
      {
        method: 'POST',
        body: prefix,
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to add prefix: ${result.message} (status: ${result.status})`,
    );
  }

  public static async removePrefixFromWorkspace(
    workspaceUuid: string,
    prefix: string,
  ): Promise<boolean> {
    const result = await this.getApiClient().callApi<boolean>(
      `/workspaces/${workspaceUuid}/prefix/${prefix}`,
      {
        method: 'DELETE',
        parser: () => true,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to remove prefix: ${result.message} (status: ${result.status})`,
    );
  }
}

export default PrefixApi;
