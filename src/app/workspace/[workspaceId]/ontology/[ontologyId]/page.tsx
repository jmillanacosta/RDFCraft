'use client';

import Baseline from '@/components/general/Baseline';
import AssignPrefixDialog from '@/components/ontology/AssignPrefixDialog';
import OntologyAppBar from '@/components/ontology/OntologyAppBar';
import OntologyClassTab from '@/components/ontology/OntologyClassTab';
import OntologyIndividualTab from '@/components/ontology/OntologyIndividualTab';
import OntologyPropertyTab from '@/components/ontology/OntologyPropertyTab';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import { OntologyModel } from '@/lib/models/OntologyModel';
import useAuthStore from '@/lib/stores/AuthStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import { Edit } from '@mui/icons-material';
import { Box, Button, IconButton, Tab, Tabs, Typography } from '@mui/material';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useLayoutEffect, useState } from 'react';

const OntologyPage = () => {
    const params = useParams();

    const theme = useLocalTheme();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    useLayoutEffect(() => {
        if (!isAuthenticated()) router.replace('/');
    }, [isAuthenticated, router, token]);

    const [ontology, setOntology] = useState<OntologyModel | null>(null);

    const ontologies = useOntologyStore((state) => state.ontologies);
    const allClasses = useOntologyStore((state) => state.classes);
    const allProperties = useOntologyStore((state) => state.properties);
    const allIndividuals = useOntologyStore((state) => state.individual);
    const allClassDomains = useOntologyStore((state) => state.class_domains);
    const allClassRanges = useOntologyStore((state) => state.class_ranges);
    const prefixes = useOntologyStore((state) => state.unassigned_prefixes);
    const loading = useOntologyStore((state) => state.loading);

    const fetchOntologyItems = useOntologyStore(
        (state) => state.fetchOntologyItems,
    );
    const assignPrefix = useOntologyStore((state) => state.assignPrefix);

    useEffect(() => {
        if (!params.ontologyId || typeof params.ontologyId !== 'string') {
            return;
        }
        if (!params.workspaceId || typeof params.workspaceId !== 'string') {
            return;
        }
        const _ontology = ontologies[params.ontologyId];

        if (!_ontology) {
            fetchOntologyItems(params.workspaceId, [params.ontologyId]);
            return;
        }
        setOntology(_ontology);
    }, [params.ontologyId, params.workspaceId, ontologies, fetchOntologyItems]);

    const [assignDialog, setAssignDialog] = useState(false);

    const [selected, setSelected] = useState<string>('');
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (
        event: React.ChangeEvent<{}>,
        newValue: number,
    ) => {
        setActiveTab(newValue);
    };

    const tabProps = (index: number) => ({
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    });

    return (
        <Baseline>
            <AssignPrefixDialog
                open={assignDialog}
                loading={loading}
                onClose={() => setAssignDialog(false)}
                onConfirm={async (prefixId) => {
                    if (
                        !params.workspaceId ||
                        typeof params.workspaceId !== 'string'
                    ) {
                        return;
                    }
                    if (
                        !params.ontologyId ||
                        typeof params.ontologyId !== 'string'
                    ) {
                        return;
                    }
                    await assignPrefix(
                        params.workspaceId,
                        params.ontologyId,
                        prefixId,
                    );
                    setAssignDialog(false);
                }}
                prefixes={prefixes}
            />
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
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant='h5'>
                            <span style={{ fontWeight: 600 }}>Prefix: </span>
                            {ontology?.prefix.prefix}
                        </Typography>
                        <IconButton
                            onClick={() => setAssignDialog(true)}
                            disabled={loading}
                        >
                            <Edit />
                        </IconButton>
                    </div>

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
                        class_domains={
                            allClassDomains[`${params.ontologyId}`] || {}
                        }
                        class_ranges={
                            allClassRanges[`${params.ontologyId}`] || {}
                        }
                        selected={selected}
                        goToProperty={async (uri) => {
                            setActiveTab(1);
                            setSelected(uri);
                            await new Promise((resolve) =>
                                setTimeout(resolve, 100),
                            );
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
                        goToClass={async (uri) => {
                            setActiveTab(0);
                            setSelected(uri);
                            await new Promise((resolve) =>
                                setTimeout(resolve, 100),
                            );
                            const _class = document.getElementById(uri);
                            if (_class) {
                                _class.scrollIntoView();
                            }
                        }}
                    />
                    <OntologyIndividualTab
                        open={activeTab === 2}
                        individuals={
                            allIndividuals[`${params.ontologyId}`] || []
                        }
                    />
                </Box>
            </Box>
        </Baseline>
    );
};

export default OntologyPage;
