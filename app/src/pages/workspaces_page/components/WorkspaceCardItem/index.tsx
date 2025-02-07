import { Workspace } from '../../../../lib/api/workspaces_api/types';

import { Button } from '@blueprintjs/core';
import CardItem from '../../../../components/CardItem';
import './styles.scss';

interface WorkspaceCardItemProps {
  workspace: Workspace;
  onDelete: (workspace: Workspace) => void;
  onOpen: (workspace: Workspace) => void;
  onExport: (workspace: Workspace) => void;
}

const WorkspaceCardItem = ({
  workspace,
  onDelete,
  onOpen,
  onExport,
}: WorkspaceCardItemProps) => {
  return (
    <CardItem
      title={workspace.name}
      description={
        <>
          <p>
            <b>Type</b>:{' '}
            {workspace.type.charAt(0).toUpperCase() + workspace.type.slice(1)}
          </p>
          <p>
            <b>Description</b>: <br />
            {workspace.description || 'No description'}
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
        </>
      }
      actions={
        <>
          <Button intent='danger' onClick={() => onDelete(workspace)}>
            Delete
          </Button>
          <Button intent='primary' onClick={() => onExport(workspace)}>
            Export
          </Button>
          <Button intent='primary' onClick={() => onOpen(workspace)}>
            Open
          </Button>
        </>
      }
    />
  );
};

export default WorkspaceCardItem;
