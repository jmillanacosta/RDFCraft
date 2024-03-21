'use client';

import { PrefixModel } from '@/lib/models/PrefixModel';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';

type _OntologyAddDialogProps = {
  open: boolean;
  loading: boolean;
  availablePrefixes: PrefixModel[];
  onClose: () => void;
  onConfirm: (
    name: string,
    description: string,
    prefix_id: string,
    file: File,
  ) => void;
};

type _OntologyAddDialogState = {
  name: string;
  nameError: string | null;
  description: string;
  descriptionError: string | null;
  prefix_id: string;
  prefixError: string | null;
  file: File | null;
  fileError: string | null;
};

const OntologyAddDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
  availablePrefixes,
}: _OntologyAddDialogProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<_OntologyAddDialogState>({
    name: '',
    nameError: null,
    description: '',
    descriptionError: null,
    prefix_id: '',
    prefixError: null,
    file: null,
    fileError: null,
  });

  useEffect(() => {
    if (!open) {
      setState({
        name: '',
        nameError: null,
        description: '',
        descriptionError: null,
        prefix_id: '',
        prefixError: null,
        file: null,
        fileError: null,
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
            let nameError = null,
              descriptionError = null,
              prefixError = null,
              fileError = null;
            if (!state.name) {
              nameError = 'Name is required';
            }
            if (!state.description) {
              descriptionError = 'Description is required';
            }
            if (!state.prefix_id) {
              prefixError = 'Prefix is required';
            }
            if (!state.file) {
              fileError = 'File is required';
            }
            if (nameError || descriptionError || prefixError || fileError) {
              setState({
                ...state,
                nameError,
                descriptionError,
                prefixError,
                fileError,
              });
              return;
            }
            onConfirm(
              state.name,
              state.description,
              state.prefix_id,
              state.file!,
            );
          }}
        >
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              id='name'
              label='Name'
              type='text'
              fullWidth
              onChange={e => setState({ ...state, name: e.target.value })}
              error={!!state.nameError}
              helperText={state.nameError}
              disabled={loading}
            />
            <TextField
              margin='dense'
              id='description'
              label='Description'
              type='text'
              fullWidth
              onChange={e =>
                setState({ ...state, description: e.target.value })
              }
              error={!!state.descriptionError}
              helperText={state.descriptionError}
              disabled={loading}
            />
            <Autocomplete
              options={availablePrefixes}
              getOptionLabel={option => option.prefix}
              getOptionKey={option => option.id}
              onChange={(_, value) => {
                if (!value) return;
                setState({ ...state, prefix_id: value.id });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  margin='dense'
                  id='prefix'
                  label='Prefix'
                  type='text'
                  fullWidth
                  error={!!state.prefixError}
                  helperText={state.prefixError}
                  disabled={loading}
                />
              )}
            />

            <Box display='flex' alignItems='flex-start' flexDirection='column'>
              <TextField
                margin='dense'
                id='file'
                label='File'
                fullWidth
                value={state.file?.name || ''}
                error={!!state.fileError}
                helperText={state.fileError}
                disabled
              />
              <Button variant='contained' component='label' disabled={loading}>
                <input
                  hidden
                  type='file'
                  onChange={e =>
                    setState({ ...state, file: e.target.files?.[0] ?? null })
                  }
                />
                Upload Ontology
              </Button>
            </Box>
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

export default OntologyAddDialog;
