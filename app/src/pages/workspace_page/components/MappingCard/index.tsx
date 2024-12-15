import { Button } from '@blueprintjs/core';
import CardItem from '../../../../components/CardItem';
import { MappingGraph } from '../../../../lib/api/mapping_service/types';

interface MappingCardItemProps {
  mapping: MappingGraph;
  onSelected: (mapping: MappingGraph) => void;
  onDelete: (mapping: MappingGraph) => void;
}

const MappingCardItem = ({
  mapping,
  onSelected,
  onDelete,
}: MappingCardItemProps) => {
  return (
    <CardItem
      title={mapping.name}
      description={
        <p>
          <b>Description:</b> {mapping.description}
        </p>
      }
      actions={
        <>
          <Button intent='danger' onClick={() => onDelete(mapping)}>
            Delete
          </Button>
          <Button intent='primary' onClick={() => onSelected(mapping)}>
            Open
          </Button>
        </>
      }
    />
  );
};

export default MappingCardItem;
