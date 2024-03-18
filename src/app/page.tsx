'use client';

import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import LoginBox from '@/components/login/LoginBox';
import { useLayoutEffect } from 'react';
import useAuthStore from '@/lib/stores/AuthStore';
import { useRouter } from 'next/navigation';
import useLocalTheme from '@/lib/hooks/useLocalTheme';

export default function Home() {
  const theme = useLocalTheme();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();

  useLayoutEffect(() => {
    if (isAuthenticated()) router.replace('/workspace');
  }, [isAuthenticated, router, token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider />
      <Box
        color={theme.palette.text.primary}
        bgcolor={theme.palette.background.default}
        height='100vh'
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <LoginBox />
      </Box>
    </ThemeProvider>
  );
}
