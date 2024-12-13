import { Button } from '@blueprintjs/core';
import CardItem from '../../../../components/CardItem';
import { Prefix } from '../../../../lib/api/prefix_api/types';

interface PrefixCardItemProps {
  prefix: Prefix;
  onDelete: (Prefix: Prefix) => void;
}

const PrefixCardItem = ({ prefix, onDelete }: PrefixCardItemProps) => {
  return (
    <CardItem
      title={prefix.prefix}
      description={
        <p>
          <b>URI</b>: {prefix.uri}
        </p>
      }
      actions={
        <Button intent='danger' onClick={() => onDelete(prefix)}>
          Delete
        </Button>
      }
    />
  );
};

export default PrefixCardItem;
