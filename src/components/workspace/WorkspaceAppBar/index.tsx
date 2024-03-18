'use client';

import { Add, Logout } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';

type _WorkspaceAppBarProps = {
  onLogout: () => void;
  onAdd: () => void;
};

const WorkspaceAppBar = (props: _WorkspaceAppBarProps) => {
  return (
    <AppBar
      position='static'
      sx={{
        zIndex: theme => theme.zIndex.drawer + 1,
        height: 64,
      }}
    >
      <Toolbar>
        <Typography variant='h6'>Workspaces</Typography>
        <div style={{ flexGrow: 1 }} />
        <IconButton color='inherit' onClick={props.onAdd}>
          <Add />
        </IconButton>
        <IconButton color='inherit' onClick={props.onLogout}>
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default WorkspaceAppBar;
