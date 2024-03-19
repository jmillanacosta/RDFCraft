'use client'

import { ItemCard } from '@/components/general/ItemCard';
import { WorkspaceModel } from '@/lib/models/Workspace';
import useWorkspaceStore from '@/lib/stores/WorkspaceStore';
import { Button, Typography } from '@mui/material';
import { useCallback } from 'react';

const WorkspaceCard = ({ workspace }: { workspace: WorkspaceModel }) => {
  const deleteWorkspace = useWorkspaceStore(state => state.delete);
  const onSelect = useCallback(() => {
    console.log('Selected workspace', workspace._id);
  }, [workspace._id]);

  const onDelete = useCallback(async () => {
    await deleteWorkspace(workspace._id);
  }, [workspace._id]);

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
