import { ItemCard } from '@/components/general/ItemCard';
import { OntologyModel } from '@/lib/models/OntologyModel';
import { PrefixModel } from '@/lib/models/PrefixModel';
import { Button, Typography } from '@mui/material';
import { useCallback } from 'react';

type _OntologyCardProps = {
  ontology: OntologyModel;
  removeOntology: (_id: string) => void;
  showDetails: (_id: string) => void;
};

const OntologyCard = ({
  ontology,
  removeOntology,
  showDetails,
}: _OntologyCardProps) => {
  const onDelete = useCallback(() => {
    if (ontology._id) {
      removeOntology(ontology.id);
      return;
    }
    if (ontology.id) {
      removeOntology(ontology.id);
      return;
    }

    throw new Error('No ID found');
  }, [ontology, removeOntology]);

  const onDetails = useCallback(() => {
    if (ontology._id) {
      showDetails(ontology.id);
      return;
    }
    if (ontology.id) {
      showDetails(ontology.id);
      return;
    }

    throw new Error('No ID found');
  }, [ontology, showDetails]);

  return (
    <>
      <ItemCard
        name={ontology.name}
        description={ontology.description}
        secondaryDescription={`${ontology.prefix.prefix}: ${ontology.prefix.uri}`}
      >
        <Button variant='contained' color='primary' onClick={onDetails}>
          <Typography>Details</Typography>
        </Button>
        <Button variant='contained' color='error' onClick={onDelete}>
          <Typography>Delete</Typography>
        </Button>
      </ItemCard>
    </>
  );
};

export default OntologyCard;
