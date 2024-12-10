import { Button } from '@blueprintjs/core';
import CardItem from '../../../../components/CardItem';
import { Ontology } from '../../../../lib/api/ontology_api/types';

interface OntologyCardItemProps {
  ontology: Ontology;
  onDelete: (ontology: Ontology) => void;
  onOpen: (ontology: Ontology) => void;
}

const OntologyCardItem = ({
  ontology,
  onDelete,
  onOpen,
}: OntologyCardItemProps) => {
  return (
    <CardItem
      title={ontology.name}
      description={
        <>
          <p>
            <b>Description</b>: <br />
            {ontology.description}
          </p>
          <p>
            <b>URL</b>: {ontology.base_uri}
          </p>
        </>
      }
      actions={
        <>
          <Button intent='danger' onClick={() => onDelete(ontology)}>
            Delete
          </Button>
          <Button intent='primary' onClick={() => onOpen(ontology)}>
            Details
          </Button>
        </>
      }
    />
  );
};

export default OntologyCardItem;
