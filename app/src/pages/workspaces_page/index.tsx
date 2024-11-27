import { Button, Navbar, NonIdealState } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import useWorkspacesPageState from './state';

import CreateWorkspaceDialog from './components/CreateWorkspaceDialog';

import './styles.scss';

const WorkspacesPage = () => {
  const workspaces = useWorkspacesPageState(state => state.workspaces);
  const isLoading = useWorkspacesPageState(state => state.isLoading);
  const error = useWorkspacesPageState(state => state.error);
  const pull = useWorkspacesPageState(state => state.refreshWorkspaces);
  const create = useWorkspacesPageState(state => state.createWorkspace);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    pull();
  }, [pull]);

  return (
    <div>
      <CreateWorkspaceDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={data => {
          create(data);
          setOpen(false);
        }}
      />
      <Navbar fixedToTop>
        <Navbar.Group>
          <Navbar.Heading>Workspaces</Navbar.Heading>
          <Navbar.Divider />
          <Navbar.Heading>
            {isLoading ? 'Loading...' : error ?? ''}
          </Navbar.Heading>
        </Navbar.Group>
      </Navbar>
      <div className='workspaces-content'>
        {workspaces.length === 0 && (
          <div className='no-workspaces'>
            <NonIdealState
              icon='folder-open'
              iconSize={32}
              title={'No workspaces'}
              description='Create a workspace to get started'
              layout='vertical'
              action={
                <Button intent='primary' onClick={() => setOpen(true)}>
                  Create Workspace
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacesPage;
