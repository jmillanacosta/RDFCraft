'use client';

import OntologyPrefixAppBar from '@/components/ontology_prefix/OntologyPrefixAppBar';
import PrefixAddDialog from '@/components/ontology_prefix/PrefixAddDialog';
import PrefixBulkAddDialog from '@/components/ontology_prefix/PrefixBulkAddDialog';
import PrefixCard from '@/components/ontology_prefix/PrefixCard';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceItem from '@/lib/stores/WorkspaceItemStore';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline, Grid, Tab, Tabs, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const OntologyAndPrefixPage = () => {
  const theme = useLocalTheme();
  const params = useParams();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const workspace = useWorkspaceItem(state => state.workspace);
  const getWorkspace = useWorkspaceItem(state => state.fetchById);
  const loading = useWorkspaceItem(state => state.loading);
  const error = useWorkspaceItem(state => state.error);
  const status_code = useWorkspaceItem(state => state.status_code);

  const addPrefix = useWorkspaceItem(state => state.addPrefix);
  const addBulkPrefix = useWorkspaceItem(state => state.addBulkPrefix);
  const removePrefix = useWorkspaceItem(state => state.removePrefix);

  const [activeDialog, setActiveDialog] = useState<
    'ontology' | 'prefix' | 'prefix-bulk' | null
  >(null);

  const activateDialog = useCallback(
    (dialog: 'ontology' | 'prefix' | 'prefix-bulk') => {
      setActiveDialog(dialog);
    },
    [],
  );

  const addPrefixHandler = useCallback(
    (prefix: string, uri: string) => {
      addPrefix(prefix, uri);
    },
    [addPrefix],
  );

  useEffect(() => {
    if (
      workspace == null &&
      loading === false &&
      params.workspaceId &&
      typeof params.workspaceId === 'string'
    ) {
      getWorkspace(params.workspaceId);
    }
  }, [getWorkspace, params.workspaceId, workspace, loading]);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error',
      });
    }
  }, [error]);

  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const tabProps = (index: number) => ({
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider />
        <PrefixAddDialog
          open={activeDialog === 'prefix'}
          onClose={() => setActiveDialog(null)}
          onConfirm={async (prefix: string, uri: string) => {
            await addPrefixHandler(prefix, uri);
            setActiveDialog(null);
          }}
          loading={loading}
        />
        <PrefixBulkAddDialog
          open={activeDialog === 'prefix-bulk'}
          onClose={() => setActiveDialog(null)}
          onConfirm={async (models: any) => {
            await addBulkPrefix(models);
            setActiveDialog(null);
          }}
          loading={loading}
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
          <OntologyPrefixAppBar
            name={workspace?.name || ''}
            activateDialog={activateDialog}
          />
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              width: '100%',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant='fullWidth'
            >
              <Tab label='Ontology' {...tabProps(0)} />
              <Tab label='Prefix' {...tabProps(1)} />
            </Tabs>
          </Box>
          <Box
            width='100%'
            display='flex'
            flexDirection='column'
            alignItems='center'
            sx={{ display: activeTab === 0 ? 'flex' : 'none' }}
          >
            Ontology
          </Box>
          <Box
            width='100%'
            display='flex'
            flexDirection='column'
            alignItems='center'
            sx={{ display: activeTab === 1 ? 'flex' : 'none' }}
          >
            {workspace?.prefixes.length === 0 ? (
              <Typography variant='h6'>No prefixes added yet</Typography>
            ) : (
              <Grid container spacing={2} style={{ padding: 16 }}>
                {workspace?.prefixes.map(prefix => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={prefix._id}>
                    <PrefixCard
                      prefix={prefix}
                      removePrefix={_id => removePrefix(_id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OntologyAndPrefixPage;
