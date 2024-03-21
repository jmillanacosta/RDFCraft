import { PrefixModel } from '@/lib/models/PrefixModel';
import { Box, Grid, Typography } from '@mui/material';
import PrefixCard from '../PrefixCard';
import { OntologyModel } from '@/lib/models/OntologyModel';
import OntologyCard from '../OntologyCard';

type _OntologyTabProps = {
  active: boolean;
  ontologies: OntologyModel[];
  removeOntology: (id: string) => void;
  showOntologyDetails: (id: string) => void;
};

const OntologyTab = ({
  active,
  ontologies,
  removeOntology,
  showOntologyDetails,
}: _OntologyTabProps) => {
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      sx={{ display: active ? 'flex' : 'none' }}
    >
      {ontologies.length === 0 ? (
        <Typography variant='h6'>No ontologies added yet</Typography>
      ) : (
        <Grid container spacing={2} style={{ padding: 16 }}>
          {ontologies.map(ontology => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={ontology.id}>
              <OntologyCard
                ontology={ontology}
                removeOntology={_id => removeOntology(_id)}
                showDetails={_id => showOntologyDetails(_id)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default OntologyTab;
