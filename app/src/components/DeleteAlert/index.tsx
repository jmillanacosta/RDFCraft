import { Alert, H4 } from '@blueprintjs/core';

import './styles.scss';

interface DeleteAlertProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}
const DeleteAlert = (props: DeleteAlertProps) => {
  return (
    <Alert
      isOpen={props.open}
      icon='trash'
      intent='danger'
      onClose={props.onClose}
      cancelButtonText='Cancel'
      confirmButtonText='Delete'
      onConfirm={props.onConfirm}
      className='bp5-dark'
    >
      <H4>{props.title}</H4>
      <p>{props.message}</p>
    </Alert>
  );
};

export default DeleteAlert;
