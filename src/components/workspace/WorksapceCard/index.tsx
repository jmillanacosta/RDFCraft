'use client';

import { ItemCard } from '@/components/general/ItemCard';
import { WorkspaceModel } from '@/lib/models/Workspace';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const WorkspaceCard = ({
  workspace,
  onDelete,
}: {
  workspace: WorkspaceModel;
  onDelete: () => void;
}) => {
  const router = useRouter();
  const onSelect = useCallback(() => {
    router.push(`/workspace/${workspace._id}`);
  }, [workspace._id, router]);

  return (
    <>
      <ItemCard
        name={workspace.name}
        description={workspace.description}
        secondaryDescription={`ID: ${workspace._id}`}
      >
        <Button variant='contained' onClick={onSelect}>
          <Typography>Select</Typography>
        </Button>
        <Button variant='contained' color='error' onClick={onDelete}>
          <Typography>Delete</Typography>
        </Button>
      </ItemCard>
    </>
  );
};

export default WorkspaceCard;
