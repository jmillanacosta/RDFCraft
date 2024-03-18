'use client';

import { ApiError, AuthService, OpenAPI } from '@/generated';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type AuthState = {
  token: string | null;
};

type AuthActions = {
  isAuthenticated: () => boolean;
  login: (username: string, password: string) => Promise<string>;
  reset: () => void;
};

const defaultState: AuthState = {
  token: null,
};

const _login = async (
  set: (state: Partial<AuthState>) => void,
  username: string,
  password: string,
): Promise<string> => {
  try {
    const response = await AuthService.loginAuthLoginPost({
      username,
      password,
    });
    set({ token: `${response.token_type} ${response.access_token}` });
    OpenAPI.TOKEN = `${response.token_type} ${response.access_token}`;
    return '';
  } catch (error) {
    if (error instanceof ApiError) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
};

const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...defaultState,
        isAuthenticated: () => !!get().token,
        login: (username, password) => _login(set, username, password),
        reset: () => {
          set(defaultState);
          OpenAPI.TOKEN = '';
        },
      }),
      {
        name: 'auth-store',
      },
    ),
  ),
);

export default useAuthStore;
