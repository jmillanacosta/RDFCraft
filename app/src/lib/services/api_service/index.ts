import axios, { AxiosInstance } from 'axios';
import { ApiCallOptions, ApiCallResult } from './types';

class ApiService {
  private readonly _baseUrl: string;
  private readonly _client: AxiosInstance;

  private static instances: Record<string, ApiService> = {};

  private constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
    this._client = axios.create({
      baseURL: baseUrl,
    });
  }

  public static registerWithNamespace(
    namespace: string,
    baseUrl: string,
  ): void {
    if (!ApiService.instances[namespace]) {
      ApiService.instances[namespace] = new ApiService(baseUrl);
    }
  }
  public static getInstance(baseUrl: string): ApiService {
    if (!ApiService.instances[baseUrl]) {
      ApiService.instances[baseUrl] = new ApiService(baseUrl);
    }

    return ApiService.instances[baseUrl];
  }

  async callApi<T, D = unknown>(
    endpoint: string,
    options: ApiCallOptions<T, D>,
  ): Promise<ApiCallResult<T>> {
    try {
      const response = await this._client.request({
        url: endpoint,
        method: options.method,
        data: options.body,
        headers: options.headers,
        params: options.queryParams,
        timeout: options.timeout,
      });

      return {
        type: 'success',
        data: options.parser(response.data),
      } as ApiCallResult<T>;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return {
          type: 'failure',
          message: error.message,
          status: error.response?.status || 500,
        } as ApiCallResult<T>;
      } else {
        throw error;
      }
    }
  }
}

export default ApiService;
