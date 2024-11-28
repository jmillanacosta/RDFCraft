import { Button, Card, Divider, Elevation, H5 } from '@blueprintjs/core';
import { WorkspaceMetadata } from '../../../../lib/api/workspaces_api/types';

import './styles.scss';

interface WorkspaceCardItemProps {
  workspace: WorkspaceMetadata;
  onDelete: (workspace: WorkspaceMetadata) => void;
  onOpen: (workspace: WorkspaceMetadata) => void;
}

const WorkspaceCardItem = ({
  workspace,
  onDelete,
  onOpen,
}: WorkspaceCardItemProps) => {
  return (
    <Card className='workspace-card' elevation={Elevation.TWO}>
      <H5>{workspace.name}</H5>
      <p>
        <b>Type</b>:{' '}
        {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
      </p>
      <p>
        <b>Description</b>: <br />
        {workspace.description}
      </p>
      <p
        style={
          workspace.type === 'local'
            ? { visibility: 'hidden' }
            : { visibility: 'visible' }
        }
      >
        <b>Connection String</b>: {workspace.location}
      </p>

      <Divider />
      <div className='workspace-card-actions'>
        <Button intent='danger' onClick={() => onDelete(workspace)}>
          Delete
        </Button>
        <Button intent='primary' onClick={() => onOpen(workspace)}>
          Open
        </Button>
      </div>
    </Card>
  );
};

export default WorkspaceCardItem;
