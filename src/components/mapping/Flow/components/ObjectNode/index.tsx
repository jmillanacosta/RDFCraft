'use client';

import { ObjectNodeDataModel } from '@/lib/models/MappingModel';
import {
  Alert,
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';

import { OntologyClassDocument } from '@/lib/models/OntologyIndexModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { useCallback, useMemo, useState } from 'react';
import { Handle, NodeResizer, Position } from 'reactflow';
import usePossibleClasses from '../../hooks/usePossibleClasses';
import useRefValidator from '../../hooks/useRefValidator';
import OneLineMonaco from '../OneLineMonaco';

export default function ObjectNode({
  id,
  selected,
  data,
}: {
  id: string;
  data: ObjectNodeDataModel;
  selected: boolean;
}) {
  const updateNodeData = useMappingStore(state => state.updateNodeData);
  const ontologies = useMappingStore(state => state.workspace?.ontologies);
  const valueRefs =
    useMappingStore(state => state.mappingDocument?.source.refs) || [];

  const IRIError = useRefValidator(data.pattern, valueRefs);

  const possibleClasses = usePossibleClasses(id);

  const value = useMemo(() => {
    const value = possibleClasses.find(cls => cls.full_uri === data.rdf_type);
    return value;
  }, [data.rdf_type, possibleClasses]);

  const changeLabel = useCallback(
    (label: string) => {
      updateNodeData(id, {
        ...data,
        label,
      });
    },
    [id, data, updateNodeData],
  );

  const [blankNode, setBlankNode] = useState<boolean>(data.is_blank_node); // To stop trigger on other functions

  const changeBlankNode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBlankNode(e.target.checked);
      updateNodeData(id, {
        ...data,
        is_blank_node: e.target.checked,
      });
    },
    [id, data, updateNodeData],
  );

  const changeClass = useCallback(
    (cls: OntologyClassDocument | null) => {
      const prefix =
        ontologies?.find(o => o.id === cls?.ontology_id)?.prefix.prefix || '';
      updateNodeData(id, {
        ...data,
        rdf_type: cls?.full_uri || '',
        pattern_prefix: prefix,
      });
    },
    [id, data, updateNodeData, ontologies],
  );

  const changeIRI = useCallback(
    (IRI: string) => {
      if (blankNode) {
        return; // Do not update if it is a blank node
      }
      updateNodeData(id, {
        ...data,
        pattern: IRI,
      });
    },
    [id, data, updateNodeData, blankNode],
  );

  if (!data) {
    return null;
  }

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
        minHeight={300}
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
          defaultValue={data.label}
          margin='dense'
          id='label'
          label='Label'
          type='text'
          fullWidth
          variant='standard'
          onChange={e => changeLabel(e.target.value)}
        />
        <Box height={10} />
        <Autocomplete
          options={possibleClasses.filter(cls => cls.is_deprecated === false)}
          groupBy={option =>
            ontologies?.find(
              o => o.id === option.ontology_id || o._id === option.ontology_id,
            )?.prefix.prefix || 'no prefix'
          }
          value={value || null}
          className='nodrag'
          getOptionLabel={option => option.label}
          onChange={(event, value) => {
            changeClass(value);
          }}
          renderInput={params => (
            <TextField {...params} label='Class' variant='outlined' />
          )}
        />
        <Box height={10} />
        <FormControlLabel
          control={
            <Checkbox checked={data.is_blank_node} onChange={changeBlankNode} />
          }
          label='Is blank node'
        />

        <Box height={10} />
        <Alert
          severity='warning'
          variant='outlined'
          sx={{ display: IRIError ? 'block' : 'none' }}
        >
          {IRIError}
        </Alert>
        <OneLineMonaco
          value={data.pattern}
          onChange={value => changeIRI(value || '')}
          disabled={data.is_blank_node}
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
