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
import { ItemRenderer, Select } from '@blueprintjs/select';
import { useRef, useState } from 'react';
import BasicSelectMenuItem, {
  BasicSelectItem,
} from '../../../../components/BasicSelectMenuItem';

interface CreateMappingDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    description: string;
    sourceType: 'csv' | 'json';
    file: File;
    extra: Record<string, unknown>;
  }) => void;
}

const SOURCE_TYPES = [
  { value: 'csv', text: 'CSV', label: '' },
  { value: 'json', text: 'JSON', label: '' },
];

const CreateMappingDialog = (props: CreateMappingDialogProps) => {
  const form_ref = useRef<HTMLFormElement>(null);

  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState<'csv' | 'json'>('csv');

  const onClose = () => {
    props.onClose();
    setError(null);
    setFile(null);
    setSourceType('csv');
  };

  const renderItem: ItemRenderer<BasicSelectItem> = (
    item,
    { handleClick, modifiers, query },
  ) => {
    return (
      <BasicSelectMenuItem
        key={item.value}
        item={item}
        itemRendererProps={{ handleClick, modifiers, query }}
      />
    );
  };

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form_ref.current) return;
    setError(null);

    const { mapping_name, description, json_path } = form_ref.current;

    if (!mapping_name || !description || !sourceType || !file) {
      setError('Please fill all fields');
      return;
    }

    if (sourceType === 'json' && !json_path) {
      setError('Please fill all fields');
      return;
    }
    // json_path must end with '[*]'
    if (sourceType === 'json' && json_path.value.slice(-3) !== '[*]') {
      setError('JSON Path must end with "[*]"');
      return;
    }

    const extra = sourceType === 'json' ? { json_path: json_path.value } : {};

    props.onCreate({
      name: mapping_name.value,
      description: description.value,
      sourceType,
      file,
      extra: extra,
    });

    onClose();
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
            labelFor='mapping_name'
            labelInfo='(required)'
          >
            <InputGroup id='mapping_name' name='mapping_name' required />
          </FormGroup>
          <FormGroup
            label='Description'
            labelFor='description'
            labelInfo='(required)'
          >
            <InputGroup id='description' name='description' required />
          </FormGroup>
          <FormGroup
            label='Type'
            labelFor='type'
            labelInfo='(required)'
            contentClassName='form-content-do-not-fill'
          >
            <Select<BasicSelectItem>
              popoverProps={{
                minimal: true,
                matchTargetWidth: true,
              }}
              popoverTargetProps={{}}
              filterable={false}
              items={SOURCE_TYPES}
              onItemSelect={item => {
                if (form_ref.current) {
                  form_ref.current.type.value = item.value;
                  setSourceType(item.value as 'csv' | 'json');
                  if (item.value === 'csv') {
                    form_ref.current.json_path.value = '';
                  }
                }
              }}
              itemRenderer={renderItem}
            >
              <input type='text' id='type' name='type' required hidden />
              <Button
                text={sourceType === 'csv' ? 'CSV' : 'JSON'}
                rightIcon='double-caret-vertical'
              />
            </Select>
          </FormGroup>
          {sourceType === 'json' && (
            <FormGroup
              label='JSON Path'
              labelFor='json_path'
              labelInfo='(required)'
            >
              <InputGroup id='json_path' name='json_path' required />
            </FormGroup>
          )}
          <FormGroup label='File' labelFor='file' labelInfo='(required)'>
            <FileInput
              text={file?.name ?? 'Choose file...'}
              inputProps={{
                accept: sourceType === 'csv' ? '.csv' : '.json',
              }}
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

export default CreateMappingDialog;
