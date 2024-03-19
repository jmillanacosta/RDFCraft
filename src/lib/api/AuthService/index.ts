'use client';

import { JWT } from '@/lib/models/AuthModel';
import { ApiCallResponse, callApi } from '../ApiCall';

class AuthService {
  static async login(
    username: string,
    password: string,
  ): Promise<ApiCallResponse<JWT>> {
    return await callApi<JWT>({
      endpoint: '/api/auth/login',
      body: { username, password },
      method: 'POST',
      formData: true,
    });
  }
}

export default AuthService;
