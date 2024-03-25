'use client';

import Baseline from '@/components/general/Baseline';
import WorkspaceCard from '@/components/workspace/WorksapceCard';
import WorkspaceAppBar from '@/components/workspace/WorkspaceAppBar';
import WorkspaceCreateDialogue from '@/components/workspace/WorkspaceCreateDialogue';
import WorkspaceDeleteConfirmationDialog from '@/components/workspace/WorkspaceDeleteConfirmationDialog';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import useWorkspaceStore from '@/lib/stores/WorkspaceStore';
import { Box, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const WorkspacesPage = () => {
    const theme = useLocalTheme();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    const logout = useAuthStore((state) => state.reset);
    useLayoutEffect(() => {
        if (!isAuthenticated()) router.replace('/');
    }, [isAuthenticated, router, token]);

    const workspaceError = useWorkspaceStore((state) => state.error);
    const workspaces = useWorkspaceStore((state) => state.workspaces);
    const fetch = useWorkspaceStore((state) => state.fetchAll);
    const deleteWorkspace = useWorkspaceStore((state) => state.delete);
    const [createWorkspaceDialogOpen, setCreateWorkspaceDialogOpen] =
        useState(false);

    const [toBeDeleted, setToBeDeleted] = useState<string | null>(null);

    const showDeleteConfirmation = useCallback((id: string) => {
        setToBeDeleted(id);
    }, []);

    const onDelete = useCallback(async () => {
        if (toBeDeleted) {
            await deleteWorkspace(toBeDeleted);
            setToBeDeleted(null);
        }
    }, [toBeDeleted, deleteWorkspace]);

    useEffect(() => {
        if (workspaceError) {
            enqueueSnackbar(workspaceError, { variant: 'error' });
        }
    }, [workspaceError]);

    useEffect(() => {
        fetch();
    }, [fetch]);

    return (
        <Baseline>
            <WorkspaceCreateDialogue
                open={createWorkspaceDialogOpen}
                onClose={() => setCreateWorkspaceDialogOpen(false)}
            />
            <WorkspaceDeleteConfirmationDialog
                open={!!toBeDeleted}
                onClose={() => setToBeDeleted(null)}
                onConfirm={onDelete}
                workspaceName={
                    workspaces.find((w) => w._id === toBeDeleted)?.name || ''
                }
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
                        No workspaces found
                    </Typography>
                ) : (
                    <Grid container spacing={2} style={{ padding: 16 }}>
                        {workspaces.map((workspace) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                lg={3}
                                key={workspace._id}
                            >
                                <WorkspaceCard
                                    workspace={workspace}
                                    onDelete={() =>
                                        showDeleteConfirmation(workspace._id)
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Baseline>
    );
};

export default WorkspacesPage;
