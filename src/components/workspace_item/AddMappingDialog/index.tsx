'use client';

import { SourceType } from '@/lib/models/SourceModel';
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
import { JSONPath } from 'jsonpath-plus';
import { useEffect, useRef, useState } from 'react';

type _WorkspaceAddMappingProps = {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: (
    name: string,
    description: string,
    json_path: string,
    file: File,
  ) => void;
};

type _WorkspaceAddMappingState = {
  name: string;
  nameError: string | null;
  description: string;
  descriptionError: string | null;
  sourceType: SourceType | null;
  sourceTypeError: string | null;
  jsonPath: string | null;
  jsonPathError: string | null;
  file: File | null;
  fileError: string | null;
};

const WorkspaceAddMapping = ({
  open,
  onClose,
  onConfirm,
  loading,
}: _WorkspaceAddMappingProps) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<_WorkspaceAddMappingState>({
    name: '',
    nameError: null,
    description: '',
    descriptionError: null,
    sourceType: null,
    sourceTypeError: null,
    jsonPath: null,
    jsonPathError: null,
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
        sourceType: null,
        sourceTypeError: null,
        jsonPath: null,
        jsonPathError: null,
        file: null,
        fileError: null,
      });
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create new mapping</DialogTitle>
        <form
          ref={ref}
          onSubmit={async e => {
            e.preventDefault();
            let nameError = null,
              descriptionError = null,
              sourceTypeError = null,
              jsonPathError = null,
              fileError = null;
            setState({
              ...state,
              nameError,
              descriptionError,
              fileError,
              sourceTypeError,
              jsonPathError,
            });
            if (!state.name) {
              nameError = 'Name is required';
            }
            if (!state.description) {
              descriptionError = 'Description is required';
            }
            if (!state.sourceType) {
              sourceTypeError = 'Source type is required';
            }
            if (state.sourceType === 'json' && !state.jsonPath) {
              jsonPathError = 'Json path is required';
            }

            if (!state.file) {
              fileError = 'File is required';
            }
            if (nameError || descriptionError || fileError) {
              setState({
                ...state,
                nameError,
                descriptionError,
                fileError,
                sourceTypeError,
                jsonPathError,
              });
              return;
            }
            let file = state.file;
            try {
              if (state.sourceType === 'json') {
                const text = await state.file!.text();
                let json = JSON.parse(text);
                json = JSONPath({
                  path: state.jsonPath!,
                  json,
                });
                if (json.length === 0) {
                  setState({
                    ...state,
                    jsonPathError: 'Json path must point to an array',
                  });
                  return;
                }
                json = json[0];
                if (!(json instanceof Array)) {
                  setState({
                    ...state,
                    jsonPathError: 'Json path must point to an array',
                  });
                  return;
                }

                const blob = new Blob([JSON.stringify(json)], {
                  type: 'application/json',
                });
                file = new File([blob], state.file!.name, {
                  type: 'application/json',
                });
              }
            } catch (e) {
              setState({
                ...state,
                jsonPathError: 'Invalid json path: ' + e,
              });
              return;
            }
            onConfirm(
              state.name,
              state.description,
              state.jsonPath || '',
              file!,
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
                setState({
                  ...state,
                  description: e.target.value,
                })
              }
              error={!!state.descriptionError}
              helperText={state.descriptionError}
              disabled={loading}
            />
            <Autocomplete
              options={['csv', 'json'] as SourceType[]}
              getOptionLabel={option => option.toUpperCase()}
              onChange={(_, value) => {
                setState({ ...state, sourceType: value });
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  margin='dense'
                  id='sourceType'
                  label='Source Type'
                  type='text'
                  fullWidth
                  error={!!state.sourceTypeError}
                  helperText={state.sourceTypeError}
                  disabled={loading}
                />
              )}
            />
            <TextField
              margin='dense'
              id='jsonPath'
              label='Json Path'
              type='text'
              fullWidth
              onChange={e => setState({ ...state, jsonPath: e.target.value })}
              error={!!state.jsonPathError}
              helperText={state.jsonPathError}
              disabled={loading}
              sx={{
                display: state.sourceType === 'json' ? 'block' : 'none',
              }}
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
                    setState({
                      ...state,
                      file: e.target.files?.[0] ?? null,
                    })
                  }
                />
                Upload Source File
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

export default WorkspaceAddMapping;
