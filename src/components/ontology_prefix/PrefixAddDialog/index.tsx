'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type _PrefixAddDialogProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (prefix: string, uri: string) => void;
};

type _PrefixAddDialogState = {
  prefix: string;
  prefixError: string | null;
  uri: string;
  uriError: string | null;
};

const PrefixAddDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: _PrefixAddDialogProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<_PrefixAddDialogState>({
    prefix: '',
    uri: '',
    prefixError: null,
    uriError: null,
  });

  useEffect(() => {
    if (!open) {
      setState({
        prefix: '',
        uri: '',
        prefixError: null,
        uriError: null,
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create new prefix</DialogTitle>
        <form
          ref={ref}
          onSubmit={e => {
            e.preventDefault();
            let prefixError = null,
              uriError = null;
            if (!state.prefix) {
              prefixError = 'Prefix is required';
            }
            if (!state.uri) {
              uriError = 'URI is required';
            }
            // Is uri valid?
            if (state.uri && !state.uri.match(/^http[s]?:\/\/.+/)) {
              uriError = 'URI must be a valid URL';
            }
            // URI should end with a slash or a hash
            if (state.uri && !state.uri.match(/\/$|#/)) {
              uriError = 'URI must end with a slash(/) or a hash(#)';
            }
            if (prefixError || uriError) {
              setState({ ...state, prefixError, uriError });
              return;
            }
            onConfirm(state.prefix, state.uri);
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='prefix'
              label='Prefix'
              type='text'
              fullWidth
              onChange={e => setState({ ...state, prefix: e.target.value })}
              error={!!state.prefixError}
              helperText={state.prefixError}
              disabled={loading}
            />
            <TextField
              margin='dense'
              id='uri'
              label='URI'
              type='text'
              fullWidth
              onChange={e => setState({ ...state, uri: e.target.value })}
              error={!!state.uriError}
              helperText={state.uriError}
              disabled={loading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color='primary' disabled={loading}>
              Cancel
            </Button>
            <Button type='submit' color='primary' disabled={loading}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default PrefixAddDialog;
