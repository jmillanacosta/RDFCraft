'use client';

import { createTheme } from '@mui/material';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type ThemeState = {
  isDark: boolean;
  theme: typeof brightTheme | typeof darkTheme;
};

const brightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

type ThemeActions = {
  toggle: () => void;
};

const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    persist(
      (set, get) => {
        return {
          isDark: false,
          theme: brightTheme,
          toggle: () => {
            set({
              isDark: !get().isDark,
              theme: get().isDark ? brightTheme : darkTheme,
            });
          },
        };
      },
      { name: 'theme-store' },
    ),
  ),
);

export default useThemeStore;
