'use client';

import useLocalTheme from '@/lib/hooks/useLocalTheme';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { ReactNode } from 'react';

const Baseline = ({ children }: { children: ReactNode }) => {
    const theme = useLocalTheme();

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <SnackbarProvider />
                {children}
            </ThemeProvider>
        </>
    );
};

export default Baseline;
