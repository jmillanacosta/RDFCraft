'use client';

import { ArrowBack, ScatterPlot } from '@mui/icons-material';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type _OntologyAppBarProps = {
  name: string;
};

const OntologyAppBar = (props: _OntologyAppBarProps) => {
  const router = useRouter();

  return (
    <AppBar
      position='static'
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
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

export default OntologyAppBar;
