'use client';

import MappingAppBar from '@/components/mapping/MappingAppBar';
import useLocalTheme from '@/lib/hooks/useLocalTheme';
import useAuthStore from '@/lib/stores/AuthStore';
import { ThemeProvider } from '@emotion/react';
import { Box, CssBaseline } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { SnackbarProvider } from 'notistack';
import { useLayoutEffect } from 'react';

const MappingPage = () => {
    const params = useParams<{ mappingId: string; workspaceId: string }>();

    const theme = useLocalTheme();

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const token = useAuthStore((state) => state.token);
    const router = useRouter();
    useLayoutEffect(() => {
        if (!isAuthenticated()) router.replace('/');
    }, [isAuthenticated, router, token]);

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
                    alignItems='center'
                >
                    <MappingAppBar name='Mapping' />
                </Box>
            </ThemeProvider>
        </>
    );
};

export default MappingPage;
