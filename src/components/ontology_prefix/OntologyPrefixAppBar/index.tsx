'use client';

import { Add, ArrowBack } from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type _OntologyPrefixAppBarProps = {
  name: string;
  activateDialog: (dialog: 'ontology' | 'prefix' | 'prefix-bulk') => void;
};

const OntologyPrefixAppBar = (props: _OntologyPrefixAppBarProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
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
          <Typography variant='h6'>
            Ontology and Prefixes for workspace: {props.name}
          </Typography>
          <div style={{ flexGrow: 1 }} />
          <IconButton
            title='Add Ontology or Prefix'
            onClick={(
              event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
            ) => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <Add />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className='add-ontology-prefix'
      >
        <MenuItem
          onClick={() => {
            props.activateDialog('ontology');
            setAnchorEl(null);
          }}
        >
          Add Ontology
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.activateDialog('prefix');
            setAnchorEl(null);
          }}
        >
          Add Prefix
        </MenuItem>
        <MenuItem
          onClick={() => {
            props.activateDialog('prefix-bulk');
            setAnchorEl(null);
          }}
        >
          Add prefixes in bulk
        </MenuItem>
      </Menu>
    </>
  );
};

export default OntologyPrefixAppBar;
