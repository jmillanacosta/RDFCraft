'use client';

import WorkspaceAddMapping from '@/components/workspace_item/AddMappingDialog';
import WorkspaceItemAppBar from '@/components/workspace_item/WorkspaceItemAppBar';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import { WorkspaceModel } from '@/lib/models/Workspace';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceItem from '@/lib/stores/WorkspaceItemStore';
import useWorkspaceStore from '@/lib/stores/WorkspaceStore';
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import Error from 'next/error';
import { useParams, useRouter } from 'next/navigation';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useEffect, useLayoutEffect, useState } from 'react';

type _WorkspaceState = {
  workspace: WorkspaceModel | null;
  notFound: boolean;
  loading: boolean;
};

const WorkspacePage = () => {
  const params = useParams();

  const theme = useLocalTheme();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const fetchById = useWorkspaceItem(state => state.fetchById);
  const clear = useWorkspaceItem(state => state.clear);
  const workspace = useWorkspaceItem(state => state.workspace);
  const loading = useWorkspaceItem(state => state.loading);
  const error = useWorkspaceItem(state => state.error);
  const status_code = useWorkspaceItem(state => state.status_code);

  const [activeDialog, setActiveDialog] = useState<'addMapping' | null>(null);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error]);

  useEffect(() => {
    if (!params.workspaceId || typeof params.workspaceId !== 'string') {
      return;
    }
    clear();
    fetchById(params.workspaceId);
  }, [fetchById, params.workspaceId, clear]);

  if (params.workspaceId === undefined || params.workspaceId === null) {
    return (
      <>
        <Error statusCode={500}>
          <Typography variant='h1'>Workspace not found</Typography>
        </Error>
      </>
    );
  }

  if (!workspace && status_code) {
    return (
      <>
        <SnackbarProvider />
        <Error statusCode={status_code}>
          <Typography variant='h1'>Workspace not found</Typography>
        </Error>
      </>
    );
  }

  if (workspace)
    return (
      <>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider />
          <WorkspaceAddMapping
            open={activeDialog === 'addMapping'}
            onClose={() => setActiveDialog(null)}
            loading={loading}
            onConfirm={async (name, description, file) => {
              console.log(name, description, file);
              const data = await file.text();
              const json = JSON.parse(data);

              console.log(json);
              console.log(json.length);
            }}
          />
          <Box
            color={theme.palette.text.primary}
            bgcolor={theme.palette.background.default}
            height='100vh'
            width='100vw'
            display='flex'
            flexDirection='column'
            alignItems='center'
          >
            <WorkspaceItemAppBar
              name={workspace.name || ''}
              openDialog={(dialog: 'addMapping') => setActiveDialog(dialog)}
            />
            {loading && <Typography variant='h6'>Loading...</Typography>}
          </Box>
        </ThemeProvider>
      </>
    );

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          color={theme.palette.text.primary}
          bgcolor={theme.palette.background.default}
          height='100vh'
          width='100vw'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <WorkspaceItemAppBar
            name=''
            openDialog={dialog => setActiveDialog(dialog)}
          />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default WorkspacePage;
