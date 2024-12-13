import { Button, ButtonGroup, Navbar, NonIdealState } from '@blueprintjs/core';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useWorkspacePageState from './state';

import useErrorToast from '../../hooks/useErrorToast';
import MappingCardItem from './components/MappingCard';
import './styles.scss';

type WorkspacePageURLProps = {
  uuid: string;
};

const WorkspacePage = () => {
  const props = useParams<WorkspacePageURLProps>();
  const navigation = useNavigate();
  const workspace = useWorkspacePageState(state => state.workspace);
  const mappingGraphs = useWorkspacePageState(state => state.mappingGraphs);
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
      <div className='workspace-page-content'>
        {!workspace && <></>}
        {workspace && mappingGraphs.length === 0 && (
          <NonIdealState
            title='No Mappings Found'
            icon='search-around'
            description='There are no mappings in this workspace.'
            action={
              <Button
                icon='add-to-artifact'
                intent='primary'
                onClick={() => navigation('create')}
              >
                Create New Mapping
              </Button>
            }
          />
        )}
        {workspace && mappingGraphs.length > 0 && (
          <div className='card-grid-4'>
            {mappingGraphs.map(mappingGraph => (
              <MappingCardItem
                key={mappingGraph.uuid}
                mapping={mappingGraph}
                onDelete={() => {}}
                onSelected={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;
