'use client';

import { ArrowBack, LibraryAdd, ScatterPlot } from '@mui/icons-material';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type _WorkspaceItemAppBarProps = {
  name: string;
  openDialog: (dialog: 'addMapping') => void;
};

const WorkspaceItemAppBar = (props: _WorkspaceItemAppBarProps) => {
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
        <Typography variant='h6'>Workspace: {props.name}</Typography>
        <div style={{ flexGrow: 1 }} />
        <Button
          title='Ontologies and Prefixes'
          onClick={() => {
            router.push(`${window.location.pathname}/ontology-prefix`);
          }}
          variant='text'
          color='inherit'
          sx={{
            textTransform: 'none',
          }}
        >
          <ScatterPlot />
          <Typography>Ontologies and Prefixes</Typography>
        </Button>
        <Button
          title='Add Mapping'
          onClick={() => props.openDialog('addMapping')}
          variant='text'
          color='inherit'
          sx={{
            textTransform: 'none',
          }}
        >
          <LibraryAdd />
          <Typography>Add Mapping</Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default WorkspaceItemAppBar;
