'use client';

import Baseline from '@/components/general/Baseline';
import DeleteDialog from '@/components/general/DeleteDialog';
import OntologyAddDialog from '@/components/ontology_prefix/OntologyAddDialog';
import OntologyPrefixAppBar from '@/components/ontology_prefix/OntologyPrefixAppBar';
import OntologyTab from '@/components/ontology_prefix/OntologyTab';
import PrefixAddDialog from '@/components/ontology_prefix/PrefixAddDialog';
import PrefixBulkAddDialog from '@/components/ontology_prefix/PrefixBulkAddDialog';
import PrefixTab from '@/components/ontology_prefix/PrefixTab';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceItem from '@/lib/stores/WorkspaceItemStore';
import { Box, Tab, Tabs } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useState,
} from 'react';

const OntologyAndPrefixPage = () => {
    const theme = useLocalTheme();
    const params = useParams();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    useLayoutEffect(() => {
        if (!isAuthenticated()) router.replace('/');
    }, [isAuthenticated, router, token]);

    const workspace = useWorkspaceItem((state) => state.workspace);
    const getWorkspace = useWorkspaceItem((state) => state.fetchById);
    const loading = useWorkspaceItem((state) => state.loading);
    const error = useWorkspaceItem((state) => state.error);
    const status_code = useWorkspaceItem((state) => state.status_code);

    const addPrefix = useWorkspaceItem((state) => state.addPrefix);
    const addBulkPrefix = useWorkspaceItem((state) => state.addBulkPrefix);
    const removePrefix = useWorkspaceItem((state) => state.removePrefix);

    const addOntology = useWorkspaceItem((state) => state.addOntology);
    const deleteOntology = useWorkspaceItem((state) => state.deleteOntology);

    const [activeDialog, setActiveDialog] = useState<
        | 'ontology'
        | 'prefix'
        | 'prefix-bulk'
        | 'prefix-delete'
        | 'ontology-delete'
        | null
    >(null);

    const [objectIdToDelete, setObjectIdToDelete] = useState<string | null>(
        null,
    );

    const activateDialog = useCallback(
        (
            dialog:
                | 'ontology'
                | 'prefix'
                | 'prefix-bulk'
                | 'prefix-delete'
                | 'ontology-delete',
        ) => {
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

    const availablePrefixes = useMemo(() => {
        const prefixes = workspace?.prefixes || [];
        const prefixesUsedByOntologies =
            workspace?.ontologies.map((o) => o.prefix.id) || [];
        return prefixes.filter((p) => !prefixesUsedByOntologies.includes(p.id));
    }, [workspace?.ontologies, workspace?.prefixes]);
    return (
        <Baseline>
            <OntologyAddDialog
                open={activeDialog === 'ontology'}
                onClose={() => setActiveDialog(null)}
                onConfirm={async (
                    name: string,
                    description: string,
                    prefix_id: string,
                    file: File,
                ) => {
                    await addOntology(name, description, prefix_id, file);
                    setActiveDialog(null);
                }}
                loading={loading}
                availablePrefixes={availablePrefixes}
            />
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
            <DeleteDialog
                title='Delete Prefix'
                description={'Are you sure you want to delete the prefix?'}
                open={activeDialog === 'prefix-delete'}
                onClose={() => {
                    setObjectIdToDelete(null);
                    setActiveDialog(null);
                }}
                onConfirm={async () => {
                    if (objectIdToDelete) {
                        await removePrefix(objectIdToDelete);
                        setObjectIdToDelete(null);
                    }
                    setActiveDialog(null);
                }}
            />
            <DeleteDialog
                title='Delete Ontology'
                description={'Are you sure you want to delete the ontology?'}
                open={activeDialog === 'ontology-delete'}
                onClose={() => {
                    setObjectIdToDelete(null);
                    setActiveDialog(null);
                }}
                onConfirm={async () => {
                    if (objectIdToDelete) {
                        await deleteOntology(objectIdToDelete);
                        setObjectIdToDelete(null);
                    }
                    setActiveDialog(null);
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
                <OntologyTab
                    active={activeTab === 0}
                    ontologies={workspace?.ontologies || []}
                    removeOntology={(id: string) => {
                        setObjectIdToDelete(id);
                        setActiveDialog('ontology-delete');
                    }}
                    showOntologyDetails={(id: string) => {
                        router.push(
                            `/workspace/${params.workspaceId}/ontology/${id}`,
                        );
                    }}
                />
                <PrefixTab
                    active={activeTab === 1}
                    prefixes={workspace?.prefixes || []}
                    removePrefix={(id: string) => {
                        setObjectIdToDelete(id);
                        setActiveDialog('prefix-delete');
                    }}
                />
            </Box>
        </Baseline>
    );
};

export default OntologyAndPrefixPage;
