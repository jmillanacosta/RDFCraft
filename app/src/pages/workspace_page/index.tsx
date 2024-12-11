import { Button, ButtonGroup, Navbar } from '@blueprintjs/core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWorkspacePageState from './state';

import useErrorToast from '../../hooks/useErrorToast';
import './styles.scss';

type WorkspacePageURLProps = {
  uuid: string;
};

const WorkspacePage = () => {
  const props = useParams<WorkspacePageURLProps>();
  const navigation = useNavigate();
  const workspace = useWorkspacePageState(state => state.workspace);
  const isLoading = useWorkspacePageState(state => state.isLoading);
  const error = useWorkspacePageState(state => state.error);
  const loadWorkspace = useWorkspacePageState(state => state.loadWorkspace);

  useEffect(() => {
    if (props.uuid) {
      loadWorkspace(props.uuid);
    }
  }, [props.uuid, loadWorkspace]);

  useErrorToast(error);

  return (
    <div className='workspace-page'>
      <Navbar fixedToTop>
        <Navbar.Group>
          <Button
            icon='arrow-left'
            minimal
            onClick={() => {
              navigation('/');
            }}
          />
          <div style={{ width: 10 }} />
          <Navbar.Heading>Workspace: {workspace?.name}</Navbar.Heading>
          <Navbar.Divider />
          <Navbar.Heading>{isLoading ? <>{isLoading}</> : null}</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align='right'>
          <ButtonGroup>
            <Button icon='add-to-artifact'>Create New Mapping</Button>
            <Button
              icon='search-around'
              onClick={() => {
                navigation('ontologies');
              }}
            >
              Ontologies
            </Button>
            <Button
              icon='link'
              onClick={() => {
                navigation('prefixes');
              }}
            >
              Prefixes
            </Button>
          </ButtonGroup>
        </Navbar.Group>
      </Navbar>
    </div>
  );
};

export default WorkspacePage;
