import ApiService from '../../services/api_service';
import { Source } from './types';

class SourceApi {
  private static getApiClient(): ApiService {
    return ApiService.getInstance('default');
  }

  public static async getSource(sourceUuid: string): Promise<Source> {
    const result = await this.getApiClient().callApi<Source>(
      `/sources/${sourceUuid}`,
      {
        method: 'GET',
        parser: data => data as Source,
      },
    );

    if (result.type === 'success') {
      return result.data;
    }

    throw new Error(
      `Failed to get source: ${result.message} (status: ${result.status})`,
    );
  }
}

export default SourceApi;
