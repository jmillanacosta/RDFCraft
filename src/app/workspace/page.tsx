'use client';

import WorkspaceCard from '@/components/workspace/WorksapceCard';
import WorkspaceAppBar from '@/components/workspace/WorkspaceAppBar';
import WorkspaceCreateDialogue from '@/components/workspace/WorkspaceCreateDialogue';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceStore from '@/lib/stores/WorkspaceStore';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useEffect, useLayoutEffect, useState } from 'react';

const WorkspacePage = () => {
  const theme = useLocalTheme();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  const logout = useAuthStore(state => state.reset);
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const workspaceError = useWorkspaceStore(state => state.error);
  const workspaces = useWorkspaceStore(state => state.workspaces);
  const fetch = useWorkspaceStore(state => state.fetch);
  const [createWorkspaceDialogOpen, setCreateWorkspaceDialogOpen] =
    useState(false);

  useEffect(() => {
    if (workspaceError) {
      enqueueSnackbar(workspaceError, { variant: 'error' });
    }
  }, [workspaceError]);

  useEffect(() => {
    fetch();
  }, [fetch]);

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
          width='100vw'
          display='flex'
          flexDirection='column'
          alignItems='center' // Add this line to center the content horizontally
        >
          <WorkspaceAppBar
            onLogout={logout}
            onAdd={() => setCreateWorkspaceDialogOpen(true)}
          />

          {workspaces.length === 0 ? (
            <Typography
              variant='h6'
              color='text.secondary'
              sx={{ margin: 'auto' }}
            >
              No projects found
            </Typography>
          ) : (
            <Grid container spacing={2} style={{ padding: 16 }}>
              {workspaces.map(workspace => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={workspace._id}>
                  <WorkspaceCard workspace={workspace} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default WorkspacePage;
