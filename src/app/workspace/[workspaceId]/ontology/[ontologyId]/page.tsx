'use client';

import OntologyAppBar from '@/components/ontology/OntologyAppBar';
import OntologyClassTab from '@/components/ontology/OntologyClassTab';
import OntologyIndividualTab from '@/components/ontology/OntologyIndividualTab';
import OntologyPropertyTab from '@/components/ontology/OntologyPropertyTab';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import { OntologyModel } from '@/lib/models/OntologyModel';
import useAuthStore from '@/lib/stores/AuthStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import { ThemeProvider } from '@emotion/react';
import { Box, Button, CssBaseline, Tab, Tabs, Typography } from '@mui/material';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useEffect, useLayoutEffect, useState } from 'react';

const OntologyPage = () => {
  const params = useParams();

  const theme = useLocalTheme();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const token = useAuthStore(state => state.token);
  const router = useRouter();
  useLayoutEffect(() => {
    if (!isAuthenticated()) router.replace('/');
  }, [isAuthenticated, router, token]);

  const [ontology, setOntology] = useState<OntologyModel | null>(null);

  const ontologies = useOntologyStore(state => state.ontologies);
  const allClasses = useOntologyStore(state => state.classes);
  const allProperties = useOntologyStore(state => state.properties);
  const allIndividuals = useOntologyStore(state => state.individual);
  const allClassDomains = useOntologyStore(state => state.class_domains);
  const allClassRanges = useOntologyStore(state => state.class_ranges);

  const fetchOntologyItems = useOntologyStore(
    state => state.fetchOntologyItems,
  );

  useEffect(() => {
    if (!params.ontologyId || typeof params.ontologyId !== 'string') {
      return;
    }
    const _ontology = ontologies[params.ontologyId];

    if (!_ontology) {
      fetchOntologyItems([params.ontologyId]);
      return;
    }
    setOntology(_ontology);
  }, [params.ontologyId, ontologies, fetchOntologyItems]);

  const [selected, setSelected] = useState<string>('');
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
        <Box
          color={theme.palette.text.primary}
          bgcolor={theme.palette.background.default}
          height='100vh'
          width='100vw'
          display='flex'
          flexDirection='column'
        >
          <OntologyAppBar name={ontology?.name || ''} />
          <Box
            sx={{
              margin: 2,
            }}
          >
            <Typography variant='h5'>
              <span style={{ fontWeight: 600 }}>Ontology Name: </span>
              {ontology?.name}
            </Typography>
            <Typography variant='h5'>
              <span style={{ fontWeight: 600 }}>Description: </span>
              {ontology?.description}
            </Typography>
            <Typography variant='h5'>
              <span style={{ fontWeight: 600 }}>MD5: </span>
              {ontology?.file.md5}
            </Typography>
            <Button
              variant='contained'
              onClick={async () => {
                const response = await axios.get(
                  `api/files/${ontology?.file.id}/download`,
                  {
                    responseType: 'blob',
                    headers: {
                      Authorization: `${token}`,
                    },
                  },
                );
                const url = window.URL.createObjectURL(
                  new Blob([response.data]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', ontology!.file.name);
                document.body.appendChild(link);
                link.click();
              }}
            >
              Download File
            </Button>
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
                <Tab label='Classes' {...tabProps(0)} />
                <Tab label='Properties' {...tabProps(1)} />
                <Tab label='Individuals' {...tabProps(2)} />
              </Tabs>
            </Box>
            <OntologyClassTab
              open={activeTab === 0}
              classes={allClasses[`${params.ontologyId}`] || []}
              class_domains={allClassDomains[`${params.ontologyId}`] || {}}
              class_ranges={allClassRanges[`${params.ontologyId}`] || {}}
              selected={selected}
              goToProperty={async uri => {
                setActiveTab(1);
                setSelected(uri);
                await new Promise(resolve => setTimeout(resolve, 100));
                const property = document.getElementById(uri);
                if (property) {
                  property.scrollIntoView();
                }
              }}
            />
            <OntologyPropertyTab
              open={activeTab === 1}
              properties={allProperties[`${params.ontologyId}`] || []}
              selected={selected}
              goToClass={async uri => {
                setActiveTab(0);
                setSelected(uri);
                await new Promise(resolve => setTimeout(resolve, 100));
                const _class = document.getElementById(uri);
                if (_class) {
                  _class.scrollIntoView();
                }
              }}
            />
            <OntologyIndividualTab
              open={activeTab === 2}
              individuals={allIndividuals[`${params.ontologyId}`] || []}
            />
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
};

export default OntologyPage;
