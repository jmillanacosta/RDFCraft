'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRef, useState } from 'react';

type _WorkspaceCreateDialogueProps = {
  open: boolean;
  onClose: () => void;
};

type _WorkspaceCreateDialogueState = {
  name: string;
  nameError: string | null;
  description: string;
  descriptionError: string | null;
};

const WorkspaceCreateDialogue = (props: _WorkspaceCreateDialogueProps) => {
  const [state, setState] = useState<_WorkspaceCreateDialogueState>({
    name: '',
    description: '',
    nameError: null,
    descriptionError: null,
  });

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Create a new workspace</DialogTitle>
      <form
        ref={formRef}
        onSubmit={e => {
          e.preventDefault();
          let nameError = null,
            descriptionError = null;
          if (!state.name) {
            nameError = 'Name is required';
          }
          if (!state.description) {
            descriptionError = 'Description is required';
          }
          if (!state.name || !state.description) {
            setState({ ...state, nameError, descriptionError });
            return;
          }
          console.log('Create workspace', state);
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
          />
          <TextField
            margin='dense'
            id='description'
            label='Description'
            type='text'
            fullWidth
            onChange={e => setState({ ...state, description: e.target.value })}
            error={!!state.descriptionError}
            helperText={state.descriptionError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color='primary'>
            Cancel
          </Button>
          <Button type='submit' color='primary'>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkspaceCreateDialogue;
