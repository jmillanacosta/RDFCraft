import {
  LiteralNodeDataModel,
  ObjectNodeDataModel,
  UriRefNodeDataModel,
} from '@/lib/models/MappingModel';
import {
  OntologyClassDocument,
  OntologyPropertyDocument,
} from '@/lib/models/OntologyIndexModel';
import useMappingStore from '@/lib/stores/MappingStore';
import useOntologyStore from '@/lib/stores/OntologyStore';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { Node } from 'reactflow';
import usePossibleClassesConnection from '../../hooks/usePossibleClassesConnection';
import usePossiblePropertiesConnection from '../../hooks/usePossiblePropertiesConnection';

export default function OnConnectionMenu({
  open,
  anchorPosition,
  source,
  target,
  enableSubmit,
  onSubmit,
  onClose,
}: {
  open: boolean;
  anchorPosition: [number, number] | null;
  source: Node<ObjectNodeDataModel | UriRefNodeDataModel> | null;
  target: Node<
    ObjectNodeDataModel | UriRefNodeDataModel | LiteralNodeDataModel
  > | null;
  onSubmit: (
    predicate: OntologyPropertyDocument,
    target: OntologyClassDocument,
  ) => void;
  enableSubmit: boolean;
  onClose: () => void;
}) {
  const classes = useOntologyStore(state => state.classes);
  const properties = useOntologyStore(state => state.properties);
  const ontologies = useMappingStore(state => state.workspace?.ontologies);

  const [selectedPredicate, onSelectPredicate] =
    useState<OntologyPropertyDocument | null>(null);

  const [selectedClass, onSelectClass] = useState<string | null>(null);

  useEffect(() => {
    onSelectClass(target?.data.rdf_type || null);
  }, [target]);

  const possiblePredicates = usePossiblePropertiesConnection(
    source?.data.rdf_type || '',
    target?.data.rdf_type || null,
    Object.values(properties).flat() || [],
  );

  const possibleClasses = usePossibleClassesConnection(
    selectedPredicate || null,
  );

  const submit = useCallback(
    (predicate: OntologyPropertyDocument, target: OntologyClassDocument) => {
      onSubmit(predicate, target);
      onClose();
    },
    [onClose, onSubmit],
  );

  return (
    <Popover
      open={open}
      onClose={close}
      anchorReference='anchorPosition'
      anchorPosition={
        anchorPosition !== null
          ? { top: anchorPosition[1], left: anchorPosition[0] }
          : undefined
      }
    >
      <Card sx={{ padding: 2, width: 600 }}>
        <Typography variant='h6'>Add a new connection</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Autocomplete
              key={'predicate'}
              value={selectedPredicate || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  onSelectPredicate(newValue);
                }
              }}
              options={possiblePredicates}
              getOptionLabel={option => option.label}
              groupBy={option =>
                ontologies?.find(
                  o =>
                    o.id === option.ontology_id || o._id === option.ontology_id,
                )?.prefix.prefix || 'no prefix'
              }
              renderInput={params => (
                <TextField {...params} label='Predicate' variant='standard' />
              )}
            />
          </Grid>

          <Grid item xs={6}>
            {possibleClasses !== null ? (
              <Autocomplete
                key={'class'}
                value={selectedClass || null}
                disabled={target !== null}
                onChange={(event, newValue) => {
                  if (newValue) {
                    onSelectClass(newValue);
                  }
                }}
                options={possibleClasses}
                getOptionLabel={option => {
                  if (option.includes('#')) {
                    return option.split('#')[1];
                  } else {
                    return option;
                  }
                }}
                renderInput={params => (
                  <TextField {...params} label='Class' variant='standard' />
                )}
              />
            ) : (
              <TextField
                label='Class'
                variant='standard'
                value={
                  selectedClass !== null
                    ? selectedClass.split('#')[1]
                    : 'Please select a predicate first'
                }
                contentEditable={false}
              />
            )}
          </Grid>
        </Grid>
        <Box margin={2}>
          <Divider />
        </Box>
        <Grid container spacing={2} justifyContent='flex-end'>
          <Grid item>
            <Button variant='outlined' onClick={onClose}>
              <Typography>Cancel</Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='outlined'
              onClick={() => {
                if (selectedPredicate && selectedClass) {
                  submit(
                    selectedPredicate,
                    Object.values(classes)
                      .flat()
                      .find(
                        c => c.full_uri === selectedClass,
                      ) as OntologyClassDocument,
                  );
                }
              }}
              disabled={!enableSubmit || !selectedPredicate || !selectedClass}
            >
              <Typography>Submit</Typography>
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Popover>
  );
}
