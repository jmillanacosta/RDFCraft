'use client';

import { PrefixModel } from '@/lib/models/PrefixModel';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type _PrefixBulkAddDialogProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (models: PrefixModel[]) => void;
};

type _PrefixBulkAddDialogState = {
  json: string;
  jsonError: string | null;
};

const PrefixBulkAddDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: _PrefixBulkAddDialogProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<_PrefixBulkAddDialogState>({
    json: '',
    jsonError: null,
  });

  useEffect(() => {
    if (!open) {
      setState({
        json: '',
        jsonError: null,
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
        <DialogTitle>Create new prefix</DialogTitle>
        <form
          ref={ref}
          onSubmit={e => {
            e.preventDefault();
            let jsonError = null;
            try {
              const models = JSON.parse(state.json);
              if (!Array.isArray(models)) {
                jsonError = 'JSON must be an array';
              }
              // Check if all elements are PrefixModel
              if (models.some((model: any) => !(model.prefix && model.uri))) {
                jsonError = 'All elements must have a prefix and a uri';
              }
              if (jsonError) {
                setState({ ...state, jsonError });
                return;
              }
              onConfirm(models);
            } catch (e) {
              setState({ ...state, jsonError: 'Invalid JSON' });
            }
          }}
        >
          <DialogContent>
            <TextField
              value={state.json}
              onChange={e => setState({ ...state, json: e.target.value })}
              placeholder='Paste JSON here'
              style={{ width: '100%' }}
              disabled={loading}
              minRows={10}
              maxRows={20}
              multiline
              error={!!state.jsonError}
              helperText={state.jsonError}
            ></TextField>
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

export default PrefixBulkAddDialog;
