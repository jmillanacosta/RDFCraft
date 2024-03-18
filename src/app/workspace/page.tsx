'use client';

import WorkspaceAppBar from '@/components/workspace/WorkspaceAppBar';
import WorkspaceCreateDialogue from '@/components/workspace/WorkspaceCreateDialogue';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useLayoutEffect, useState } from 'react';

const WorkspacePage = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const logout = useAuthStore(state => state.reset);
  const router = useRouter();
  const theme = useLocalTheme();
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const [createWorkspaceDialogOpen, setCreateWorkspaceDialogOpen] =
    useState(false);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider />
        <WorkspaceCreateDialogue
          open={createWorkspaceDialogOpen}
          onClose={() => setCreateWorkspaceDialogOpen(false)}
        />
        <Box
          color={theme.palette.text.primary}
          bgcolor={theme.palette.background.default}
          height='100vh'
          display='flex'
        >
          <WorkspaceAppBar
            onLogout={logout}
            onAdd={() => setCreateWorkspaceDialogOpen(true)}
          />
        </Box>
      </ThemeProvider>
    </>
  );
};

export default WorkspacePage;
