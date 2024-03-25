'use client';

import Baseline from '@/components/general/Baseline';
import Flow from '@/components/mapping/Flow';
import registerLanguage from '@/components/mapping/Flow/functions/registerLanguage';
import MappingAppBar from '@/components/mapping/MappingAppBar';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useMappingStore from '@/lib/stores/MappingStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import { useMonaco } from '@monaco-editor/react';
import { Box, Typography } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
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
  const workspace = useMappingStore(state => state.workspace);
  const mappingDocument = useMappingStore(state => state.mappingDocument);
  const workingCopy = useMappingStore(state => state.workingCopy);
  const ontologies = useMappingStore(
    state => state.workspace?.ontologies || [],
  );
  const loading = useMappingStore(state => state.loading);
  const monaco = useMonaco();
  const valueRefs = useMappingStore(
    state => state.mappingDocument?.source.refs,
  );

  const fetchOntology = useOntologyStore(state => state.fetchOntologyItems);

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
    const dispose = registerLanguage(
      monaco,
      ontologies?.map(o => `${o.prefix.prefix}:`) || [],
      valueRefs || [],
    );
    monaco?.editor.defineTheme('default', {
      base: 'vs-dark',
      inherit: true,
      encodedTokensColors: [],
      colors: {},
      rules: [
        { token: 'prefix', foreground: 'FFA500' }, // Orange for prefixes
        { token: 'ref', foreground: 'FF00FF' }, // Purple for references
      ],
    });
    monaco?.editor.setTheme('default');

    return () => {
      dispose();
    };
  }, [monaco, valueRefs, ontologies]);

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
          <MappingAppBar name={mappingDocument?.name || ''} />
          <Typography variant='h6'>Loading...</Typography>
        </Box>
      </Baseline>
    );
  }

  return (
    <ReactFlowProvider>
      <Baseline>
        <MappingAppBar name={mappingDocument?.name || ''} />
        <Flow />
      </Baseline>
    </ReactFlowProvider>
  );
};

export default MappingPage;
