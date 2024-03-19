'use client';

import useWorkspaceStore from '@/lib/stores/WorkspaceStore';
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
  const create = useWorkspaceStore(state => state.create);

  const [state, setState] = useState<_WorkspaceCreateDialogueState>({
    name: '',
    description: '',
    nameError: null,
    descriptionError: null,
  });

  const [loading, setLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={props.open} onClose={props.onClose}>
      <DialogTitle>Create a new workspace</DialogTitle>
      <form
        ref={formRef}
        onSubmit={async e => {
          e.preventDefault();
          setLoading(true);
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
            setLoading(false);
            return;
          }
          await create(state.name, state.description);
          setLoading(false);
          props.onClose();
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
            onChange={e => setState({ ...state, description: e.target.value })}
            error={!!state.descriptionError}
            helperText={state.descriptionError}
            disabled={loading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color='primary' disabled={loading}>
            Cancel
          </Button>
          <Button type='submit' color='primary' disabled={loading}>
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default WorkspaceCreateDialogue;
