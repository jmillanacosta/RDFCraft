import { LiteralNodeDataModel } from '@/lib/models/MappingModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { Alert, Box, TextField } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import useRefValidator from '../../hooks/useRefValidator';
import OneLineMonaco from '../OneLineMonaco';

export default function DataNode({
  id,
  selected,
  data,
}: {
  id: string;
  selected: boolean;
  data: LiteralNodeDataModel;
}) {
  const [valueError, setValueError] = useState<string | null>(null);

  const updateNodeData = useMappingStore(state => state.updateNodeData);
  const valueRefs =
    useMappingStore(state => state.mappingDocument?.source.refs) || [];

  const valueReferenceError = useRefValidator(data.pattern, valueRefs);

  if (!data) return null;

  return (
    <>
      <NodeResizer
        color='#ff0071'
        isVisible={selected}
        handleStyle={{
          background: '#ff0071',
          width: 15,
          height: 15,
          borderRadius: '50%',
        }}
        minWidth={300}
        minHeight={200}
        maxHeight={200}
        maxWidth={500}
      />

      <Handle
        type='source'
        className='source_handle'
        position={Position.Top}
        id='a'
      />
      <Handle
        type='source'
        className='source_handle'
        position={Position.Left}
        id='b'
        style={{ rotate: '-90deg' }}
      />
      <Box
        padding={5}
        bgcolor='#201e1e'
        borderRadius={5}
        sx={{
          height: '100%',
        }}
      >
        <TextField
          autoFocus
          className='nodrag'
          disabled
          defaultValue={
            data.rdf_type.includes('#')
              ? data.rdf_type.split('#')[1]
              : data.rdf_type
          }
          margin='dense'
          id='valueType'
          label='Value Type'
          type='text'
          fullWidth
          variant='standard'
        />

        <Box height={10} />
        <Alert
          severity='warning'
          variant='outlined'
          sx={{ display: valueReferenceError ? 'block' : 'none' }}
        >
          {valueReferenceError}
        </Alert>
        <OneLineMonaco
          value={data.pattern}
          onChange={value => {
            updateNodeData(id, { pattern: value });
          }}
          error={valueReferenceError}
          key={id}
        />
      </Box>
      <Handle
        className='source_handle'
        type='source'
        position={Position.Right}
        id='c'
        style={{ rotate: '90deg' }}
      />
      <Handle
        type='source'
        className='source_handle'
        position={Position.Bottom}
        id='d'
      />
    </>
  );
}
