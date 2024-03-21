'use client';

import ConfirmationDialog from '@/components/general/ConfirmationDialog';
import { Button } from '@mui/material';

const WorkspaceDeleteConfirmationDialog = (
  { open, onClose, onConfirm, workspaceName } = {
    open: false,
    onClose: () => {},
    onConfirm: () => {},
    workspaceName: '',
  },
) => {
  return (
    <>
      <ConfirmationDialog
        title='Delete Workspace'
        description={`Are you sure you want to delete ${workspaceName}?`}
        open={open}
        onClose={onClose}
      >
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color='error'>
          Delete
        </Button>
      </ConfirmationDialog>
    </>
  );
};

export default WorkspaceDeleteConfirmationDialog;
