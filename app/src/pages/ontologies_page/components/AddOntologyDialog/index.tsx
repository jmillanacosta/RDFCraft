import {
  Button,
  Callout,
  Dialog,
  DialogBody,
  DialogFooter,
  FileInput,
  FormGroup,
  InputGroup,
} from '@blueprintjs/core';
import { useRef, useState } from 'react';
import './styles.scss';

interface AddOntologyDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    baseUri: string;
    file: File;
  }) => void;
}

const AddOntologyDialog = (props: AddOntologyDialogProps) => {
  const form_ref = useRef<HTMLFormElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const onClose = () => {
    props.onClose();
    setError(null);
    setFile(null);
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form_ref.current) return;
    setError(null);

    const { ontology_name, description, baseUri } = form_ref.current;

    if (!ontology_name || !description || !baseUri || !file) {
      setError('Please fill all fields');
      return;
    }

    // Check if baseUri is a valid URI
    try {
      new URL(baseUri.value);
    } catch {
      setError('Invalid base URI');
      return;
    }

    props.onCreate({
      name: ontology_name.value,
      description: description.value,
      baseUri: baseUri.value,
      file,
    });
  };

  return (
    <Dialog
      className='bp5-dark'
      isOpen={props.open}
      title='Add Ontology'
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
            label='Name'
            labelFor='ontology_name'
            labelInfo='(required)'
          >
            <InputGroup id='ontology_name' name='ontology_name' required />
          </FormGroup>
          <FormGroup
            label='Description'
            labelFor='description'
            labelInfo='(required)'
          >
            <InputGroup id='description' name='description' required />
          </FormGroup>
          <FormGroup label='Base URI' labelFor='baseUri' labelInfo='(required)'>
            <InputGroup id='baseUri' name='baseUri' type='url' required />
          </FormGroup>
          <FormGroup label='File' labelFor='file' labelInfo='(required)'>
            <FileInput
              text={file?.name || 'Choose file...'}
              onInputChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                  setFile(e.target.files[0]);
                }
              }}
            />
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

export default AddOntologyDialog;
