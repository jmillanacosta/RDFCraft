import { UriRefNodeDataModel } from '@/lib/models/MappingModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { Alert, Box } from '@mui/material';
import { useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import useRefValidator from '../../hooks/useRefValidator';
import OneLineMonaco from '../OneLineMonaco';

export default function UriNode({
  id,
  selected,
  data,
}: {
  id: string;
  selected: boolean;
  data: UriRefNodeDataModel;
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
        minHeight={150}
        maxHeight={150}
        maxWidth={1000}
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
          minWidth: 300,
        }}
      >
        <Alert
          severity='warning'
          variant='outlined'
          sx={{ display: valueReferenceError ? 'block' : 'none' }}
        >
          {valueReferenceError}
        </Alert>
        <OneLineMonaco
          value={data.pattern}
          language='extTerminologies'
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
