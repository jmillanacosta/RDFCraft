import { ItemCard } from '@/components/general/ItemCard';
import { PrefixModel } from '@/lib/models/PrefixModel';
import { Button, Typography } from '@mui/material';
import { useCallback } from 'react';

type _PrefixCardProps = {
  prefix: PrefixModel;
  removePrefix: (_id: string) => void;
};

const PrefixCard = ({ prefix, removePrefix }: _PrefixCardProps) => {
  const onDelete = useCallback(() => {
    if (prefix._id) {
      removePrefix(prefix.id);
      return;
    }

    if (prefix.id) {
      removePrefix(prefix.id);
      return;
    }

    throw new Error('No ID found');
  }, [prefix._id, prefix.id, removePrefix]);

  return (
    <>
      <ItemCard name={prefix.prefix} description={`URI: ${prefix.uri}`}>
        <Button variant='contained' color='error' onClick={onDelete}>
          <Typography>Delete</Typography>
        </Button>
      </ItemCard>
    </>
  );
};

export default PrefixCard;
