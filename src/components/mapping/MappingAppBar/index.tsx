'use client';

import { ArrowBack } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type _MappingAppBarProps = {
    name: string;
};

const MappingAppBar = (props: _MappingAppBarProps) => {
    const router = useRouter();

    return (
        <AppBar
            position='static'
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                height: 64,
            }}
        >
            <Toolbar>
                <IconButton
                    sx={{
                        marginRight: 2,
                    }}
                    onClick={() => router.back()}
                >
                    <ArrowBack />
                </IconButton>
                <Typography variant='h6'>Ontology: {props.name}</Typography>
                <div style={{ flexGrow: 1 }} />
            </Toolbar>
        </AppBar>
    );
};

export default MappingAppBar;
