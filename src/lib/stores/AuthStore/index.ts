'use client';

import AuthService from '@/lib/api/AuthService';
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
    const response = await AuthService.login(username, password);
    if (response.success) {
      set({
        token: `${response.data.token_type} ${response.data.access_token}`,
      });
      localStorage.setItem(
        'token',
        `${response.data.token_type} ${response.data.access_token}`,
      );
      return '';
    }
    return response.message;
  } catch (error) {
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
          localStorage.removeItem('token');
        },
      }),
      {
        name: 'auth-store',
      },
    ),
  ),
);

export default useAuthStore;
