'use client';

import { ArrowBack, Grading, ImportExport, Save } from '@mui/icons-material';
import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

type _MappingAppBarProps = {
  name: string;
  isSaved: boolean;
  onSave: () => void;
  onExport: () => void;
  onMappingComplete: () => void;
};

const MappingAppBar = (props: _MappingAppBarProps) => {
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
        <Typography variant='h6'>Mapping: {props.name}</Typography>
        <div style={{ flexGrow: 1 }} />
        <IconButton onClick={props.onExport}>
          <ImportExport />
          <Typography>Import/Export</Typography>
        </IconButton>
        <Tooltip
          title={
            props.isSaved
              ? 'Click to complete mapping'
              : 'You must save the mapping before completing it'
          }
        >
          <>
            <IconButton
              onClick={
                props.isSaved
                  ? props.onMappingComplete
                  : () => {
                      enqueueSnackbar(
                        'You must save the mapping before completing it',
                        {
                          variant: 'warning',
                        },
                      );
                    }
              }
            >
              <Grading />
              <Typography>Complete Mapping</Typography>
            </IconButton>
          </>
        </Tooltip>
        <IconButton onClick={props.onSave}>
          <Save color={props.isSaved ? 'success' : 'warning'} />
          <Typography>Save</Typography>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default MappingAppBar;
