'use client';

import Baseline from '@/components/general/Baseline';
import Flow from '@/components/mapping/Flow';
import ImportExportDialog from '@/components/mapping/Flow/components/ImportExportDialog';
import MappingCompleteDialog from '@/components/mapping/Flow/components/MappingCompleteDialog';
import registerLanguage from '@/components/mapping/Flow/functions/registerLanguage';
import MappingAppBar from '@/components/mapping/MappingAppBar';
import MappingService from '@/lib/api/MappingService';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useMappingStore from '@/lib/stores/MappingStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import { useMonaco } from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useLayoutEffect, useState } from 'react';
import { ReactFlowProvider } from 'reactflow';

const MappingPage = () => {
  const params = useParams<{ mappingId: string; workspaceId: string }>();

  const theme = useLocalTheme();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const fetch = useMappingStore(state => state.fetch);
  const save = useMappingStore(state => state.save);
  const importMappingModel = useMappingStore(state => state.importMappingModel);
  const error = useMappingStore(state => state.error);
  const workspace = useMappingStore(state => state.workspace);
  const mappingDocument = useMappingStore(state => state.mappingDocument);
  const workingCopy = useMappingStore(state => state.workingCopy);
  const loading = useMappingStore(state => state.loading);
  const isSaved = useMappingStore(state => state.isSaved);
  const monaco = useMonaco();

  const valueRefs = useMappingStore(
    state => state.mappingDocument?.source.refs,
  );
  const extTerminologies = useOntologyStore(state => state.individual);

  const fetchOntology = useOntologyStore(state => state.fetchOntologyItems);

  const [openDialog, setOpenDialog] = useState<
    'importexport' | 'complete' | null
  >(null);

  const [yarrrml, setYarrrml] = useState('');
  const [rml, setRml] = useState('');
  const [rdf, setRdf] = useState('');

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
    }
  }, [error]);

  useEffect(() => {
    if (!params.mappingId || !params.workspaceId) {
      return;
    }
    fetch(params.workspaceId, params.mappingId);
  }, [params.mappingId, params.workspaceId, fetch]);

  useEffect(() => {
    if (!workspace) {
      return;
    }
    const allIds = workspace.ontologies.map(o => o.id);
    fetchOntology(workspace._id || workspace.id, allIds);
  }, [workspace, fetchOntology, params.workspaceId]);

  useEffect(() => {
    if (!monaco) {
      return;
    }
    const dispose = registerLanguage(
      monaco,
      workspace?.prefixes?.map(o => `${o.prefix}:`) || [],
      valueRefs || [],
      Object.values(extTerminologies || {}).flat() || [],
    );
    monaco?.editor.defineTheme('default', {
      base: 'vs-dark',
      inherit: true,
      encodedTokensColors: [],
      colors: {},
      rules: [
        { token: 'prefix', foreground: 'FFA500' }, // Orange for prefixes
        { token: 'ref', foreground: 'FF00FF' }, // Purple for references
        { token: 'protocol', foreground: '00FF00' }, // Green for protocols
        { token: 'domain', foreground: 'FF0000' }, // Red for domains
        { token: 'path', foreground: '0000FF' }, // Blue for paths
      ],
    });
    monaco?.editor.setTheme('default');

    return () => {
      dispose();
    };
  }, [monaco, valueRefs, workspace?.prefixes, extTerminologies]);

  if (loading) {
    return (
      <Baseline>
        <Box
          color={theme.palette.text.primary}
          bgcolor={theme.palette.background.default}
          height='100vh'
          width='100vw'
          display='flex'
          flexDirection='column'
          alignItems='center'
        >
          <MappingAppBar
            name={mappingDocument?.name || ''}
            isSaved={false}
            onSave={() => {}}
            onExport={() => {}}
            onMappingComplete={() => {}}
          />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </Baseline>
    );
  }

  return (
    <ReactFlowProvider>
      <Baseline>
        <MappingAppBar
          name={mappingDocument?.name || ''}
          isSaved={isSaved}
          onSave={save}
          onExport={() => {
            setOpenDialog('importexport');
          }}
          onMappingComplete={async () => {
            try {
              const response = await MappingService.completeMapping(
                params.workspaceId,
                params.mappingId,
              );
              if (response.success) {
                setYarrrml(response.data.yarrrml);
                setRml(response.data.rml);
                setRdf(response.data.rdf);
                setOpenDialog('complete');
              } else {
                enqueueSnackbar(response.message, { variant: 'error' });
              }
            } catch (e) {
              enqueueSnackbar(`${e}`, { variant: 'error' });
            }
          }}
        />
        <ImportExportDialog
          open={openDialog === 'importexport'}
          onClose={() => setOpenDialog(null)}
          data={
            workingCopy || {
              nodes: [],
              edges: [],
            }
          }
          onImport={importMappingModel}
        />
        <MappingCompleteDialog
          open={openDialog === 'complete'}
          onClose={() => {
            setOpenDialog(null);
          }}
          yarrrml={yarrrml}
          rml={rml}
          rdf={rdf}
        />
        <Flow />
      </Baseline>
    </ReactFlowProvider>
  );
};

export default MappingPage;
