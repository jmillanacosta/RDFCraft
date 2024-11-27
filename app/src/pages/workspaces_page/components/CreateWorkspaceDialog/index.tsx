import { Dialog, DialogBody, FormGroup, InputGroup } from '@blueprintjs/core';
import { useRef } from 'react';
import { CreateWorkspaceMetadata } from '../../../../lib/api/workspaces_api/types';

interface CreateWorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: CreateWorkspaceMetadata) => void;
}

const CreateWorkspaceDialog = ({
  open,
  onClose,
  onConfirm,
}: CreateWorkspaceDialogProps) => {
  const form_ref = useRef<HTMLFormElement>(null);

  return (
    <Dialog
      title='Create Workspace'
      isOpen={open}
      onClose={onClose}
      className='bp5-dark'
    >
      <DialogBody>
        <form ref={form_ref}>
          <FormGroup label='Name' labelFor='name' labelInfo='(required)'>
            <InputGroup id='name' name='name' required className='bp3-dark' />
          </FormGroup>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
