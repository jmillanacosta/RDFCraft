'use client';

import axios from 'axios';

interface ApiCallResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

const client = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/'
      : undefined,
});

async function callApi<T>({
  endpoint,
  body = {},
  query = {},
  method = 'GET',
  formData = false,
  parser = (data: any) => data as T,
  timeout = 10000,
}: {
  endpoint: string;
  body?: any;
  query?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  formData?: boolean;
  parser?: (data: any) => T;
  timeout?: number;
}): Promise<ApiCallResponse<T>> {
  const token = localStorage.getItem('token');
  if (token) {
    client.defaults.headers.common['Authorization'] = token;
  } else {
    delete client.defaults.headers.common['Authorization'];
  }
  if (process.env.NODE_ENV === 'development') {
    endpoint = endpoint.replace('/api', '');
  }
  try {
    let response;
    if (formData) {
      response = await client.postForm(endpoint, body, {
        params: query,
        timeout: timeout,
      });
    } else {
      response = await client.request({
        method,
        url: endpoint,
        data: body,
        timeout: timeout,
        params: query,
      });
    }
    return {
      data: parser(response.data),
      message: 'Success',
      status: 200,
      success: true,
    };
  } catch (error) {
    if (error instanceof axios.AxiosError) {
      return {
        data: null as any,
        message: error.response?.data.detail || error.message,
        status: error.response?.status || -1,
        success: false,
      };
    }
    if (error instanceof Error) {
      return {
        data: null as any,
        message: error.message,
        status: -1,
        success: false,
      };
    }
    return {
      data: null as any,
      message: 'Unknown error',
      status: -1,
      success: false,
    };
  }
}

export { callApi };

export type { ApiCallResponse };
