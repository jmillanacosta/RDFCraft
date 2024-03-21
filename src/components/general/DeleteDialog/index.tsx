import ConfirmationDialog from '@/components/general/ConfirmationDialog';
import { Button } from '@mui/material';

type _DeleteDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
};

const DeleteDialog = (props: _DeleteDialogProps) => {
  return (
    <ConfirmationDialog
      open={props.open}
      onClose={props.onClose}
      title={props.title}
      description={props.description}
    >
      <Button onClick={props.onClose}>Cancel</Button>
      <Button onClick={props.onConfirm} color='error'>
        Delete
      </Button>
    </ConfirmationDialog>
  );
};

export default DeleteDialog;
