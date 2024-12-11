import {
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { useRef, useState } from 'react';
import { Prefix } from '../../../../lib/api/prefix_api/types';

interface AddPrefixDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: Prefix) => void;
}

const AddPrefixDialog = (props: AddPrefixDialogProps) => {
  const form_ref = useRef<HTMLFormElement>(null);

  const [error, setError] = useState<string | null>(null);

  const onClose = () => {
    props.onClose();
    setError(null);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form_ref.current) return;
    setError(null);

    const { prefix_value, uri } = form_ref.current;

    if (!prefix_value || !uri) {
      setError('Please fill all fields');
      return;
    }

    // Check if baseUri is a valid URI
    try {
      new URL(uri.value);
    } catch {
      setError('Invalid base URI');
      return;
    }

    props.onCreate({
      prefix: prefix_value.value,
      uri: uri.value,
    });
  };

  return (
    <Dialog
      className='bp5-dark'
      isOpen={props.open}
      title='Add Prefix'
      onClose={onClose}
    >
      <form ref={form_ref} onSubmit={submit}>
        <DialogBody>
          {error && (
            <Callout className='error-callout' intent='danger'>
              {error}
            </Callout>
          )}
          <FormGroup
            label='Prefix'
            labelFor='prefix_value'
            labelInfo='(required)'
          >
            <InputGroup id='prefix_value' name='prefix_value' required />
          </FormGroup>
          <FormGroup label='URI' labelFor='uri' labelInfo='(required)'>
            <InputGroup id='uri' name='uri' type='url' required />
          </FormGroup>
        </DialogBody>
        <DialogFooter
          actions={
            <>
              <Button text='Cancel' onClick={onClose} />
              <Button
                text='Create'
                intent='primary'
                onClick={() =>
                  form_ref.current?.dispatchEvent(
                    new Event('submit', { cancelable: true, bubbles: true }),
                  )
                }
              />
            </>
          }
        />
      </form>
    </Dialog>
  );
};

export default AddPrefixDialog;
