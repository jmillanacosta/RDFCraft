interface ApiCallSuccess<T> {
  type: 'success';
  data: T;
}

interface ApiCallFailure {
  type: 'failure';
  message: string;
  status: number;
}

interface ApiCallOptions<T, D = unknown> {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: object | string | FormData | null;
  headers?: Record<string, string>;
  queryParams?: Record<string, string>;
  isFormData?: boolean;
  parser: (data: D) => T;
  timeout?: number;
}

export type ApiCallResult<T> = ApiCallSuccess<T> | ApiCallFailure;

export type { ApiCallOptions };
