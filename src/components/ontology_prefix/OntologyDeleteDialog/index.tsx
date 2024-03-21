import ConfirmationDialog from '@/components/general/ConfirmationDialog';
import { Button } from '@mui/material';

type _OntologyDeleteConfirmationProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  prefixName: string;
};

const OntologyDeleteConfirmation = (
  props: _OntologyDeleteConfirmationProps,
) => {
  return (
    <ConfirmationDialog
      open={props.open}
      onClose={props.onClose}
      title='Delete Prefix'
      description={`Are you sure you want to delete ${props.prefixName}?`}
    >
      <Button onClick={props.onClose}>Cancel</Button>
      <Button onClick={props.onConfirm} color='error'>
        Delete
      </Button>
    </ConfirmationDialog>
  );
};

export default OntologyDeleteConfirmation;
