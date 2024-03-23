'use client';

import DeleteDialog from '@/components/general/DeleteDialog';
import WorkspaceAddMapping from '@/components/workspace_item/AddMappingDialog';
import MappingItem from '@/components/workspace_item/MappingItem';
import WorkspaceItemAppBar from '@/components/workspace_item/WorkspaceItemAppBar';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceItem from '@/lib/stores/WorkspaceItemStore';
import {
    Box,
    CssBaseline,
    Grid,
    ThemeProvider,
    Typography,
} from '@mui/material';
import Error from 'next/error';
import { useParams, useRouter } from 'next/navigation';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useEffect, useLayoutEffect, useState } from 'react';

const WorkspacePage = () => {
    const params = useParams();

    const theme = useLocalTheme();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    useLayoutEffect(() => {
        if (!isAuthenticated()) router.replace('/');
    }, [isAuthenticated, router, token]);

    const fetchById = useWorkspaceItem((state) => state.fetchById);
    const addMapping = useWorkspaceItem((state) => state.addMapping);
    const deleteMapping = useWorkspaceItem((state) => state.deleteMapping);
    const clear = useWorkspaceItem((state) => state.clear);
    const workspace = useWorkspaceItem((state) => state.workspace);
    const loading = useWorkspaceItem((state) => state.loading);
    const error = useWorkspaceItem((state) => state.error);
    const status_code = useWorkspaceItem((state) => state.status_code);

    const [activeDialog, setActiveDialog] = useState<
        'addMapping' | 'deleteMapping' | null
    >(null);

    const [toBeDeleted, setToBeDeleted] = useState<string | null>(null);

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
                            await addMapping(name, description, file);
                            setActiveDialog(null);
                        }}
                    />
                    <DeleteDialog
                        title='Delete mapping'
                        description='Are you sure you want to delete this mapping?'
                        open={activeDialog === 'deleteMapping'}
                        onClose={() => setActiveDialog(null)}
                        onConfirm={async () => {
                            if (!toBeDeleted) return;
                            await deleteMapping(toBeDeleted);
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
                        <WorkspaceItemAppBar
                            name={workspace.name || ''}
                            openDialog={(dialog: 'addMapping') =>
                                setActiveDialog(dialog)
                            }
                        />
                        {loading && (
                            <Typography variant='h6'>Loading...</Typography>
                        )}
                        <Grid container spacing={2} style={{ padding: 16 }}>
                            {workspace.mappings.length === 0 ? (
                                <Typography
                                    variant='h6'
                                    color='text.secondary'
                                    sx={{ margin: 'auto' }}
                                >
                                    No mappings found
                                </Typography>
                            ) : (
                                workspace.mappings.map((mapping) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        lg={3}
                                        key={mapping._id || mapping.id}
                                    >
                                        <MappingItem
                                            workspaceID={
                                                workspace._id || workspace.id
                                            }
                                            mapping={mapping}
                                            onDelete={() => {
                                                setActiveDialog(
                                                    'deleteMapping',
                                                );
                                                setToBeDeleted(
                                                    mapping._id || mapping.id,
                                                );
                                            }}
                                        />
                                    </Grid>
                                ))
                            )}
                        </Grid>
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
                        openDialog={(dialog) => setActiveDialog(dialog)}
                    />
                    <Typography variant='h6'>Loading...</Typography>
                </Box>
            </ThemeProvider>
        </>
    );
};

export default WorkspacePage;
