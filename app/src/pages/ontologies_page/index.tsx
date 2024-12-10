import { useNavigate, useParams } from 'react-router-dom';

import { Button, ButtonGroup, Navbar, NonIdealState } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import DeleteAlert from '../../components/DeleteAlert';
import toast from '../../consts/toast';
import useErrorToast from '../../hooks/useErrorToast';
import { Ontology } from '../../lib/api/ontology_api/types';
import AddOntologyDialog from './components/AddOntologyDialog';
import OntologyCardItem from './components/OntologyCardItem';
import useOntologiesPageState from './state';
import './styles.scss';

type OntologiesPageUrlProps = {
  uuid: string;
};

const OntologiesPage = () => {
  const { uuid } = useParams<OntologiesPageUrlProps>();
  const ontologies = useOntologiesPageState(state => state.ontologies);
  const isLoading = useOntologiesPageState(state => state.isLoading);
  const error = useOntologiesPageState(state => state.error);
  const refreshOntologies = useOntologiesPageState(
    state => state.refreshOntologies,
  );
  const createOntology = useOntologiesPageState(state => state.createOntology);
  const deleteOntology = useOntologiesPageState(state => state.deleteOntology);
  const navigation = useNavigate();

  const [open, setOpen] = useState<'create' | 'delete' | null>(null);

  const [toBeDeleted, setToBeDeleted] = useState<Ontology | null>(null);

  useEffect(() => {
    if (uuid) {
      refreshOntologies(uuid);
    }
  }, [uuid, refreshOntologies]);

  useErrorToast(error);

  const handleDelete = (ontology: Ontology) => {
    setToBeDeleted(ontology);
    setOpen('delete');
  };

  return (
    <div className='ontology-page'>
      <DeleteAlert
        open={open === 'delete'}
        onClose={() => setOpen(null)}
        onConfirm={() => {
          if (toBeDeleted && uuid) {
            deleteOntology(uuid, toBeDeleted.uuid);
          }
          setOpen(null);
        }}
        title='Delete Ontology'
        message='Are you sure you want to delete this ontology?'
      />
      <AddOntologyDialog
        open={open === 'create'}
        onCreate={data => {
          if (uuid) {
            try {
              createOntology(uuid, data);
              refreshOntologies(uuid);
              toast.show({
                message: 'Ontology created',
                intent: 'success',
              });
            } catch {
              /* empty */
            }
          }
          setOpen(null);
        }}
        onClose={() => setOpen(null)}
        key={uuid}
      />
      <Navbar fixedToTop>
        <Navbar.Group>
          <Button
            icon='arrow-left'
            minimal
            onClick={() => {
              navigation(`/workspaces/${uuid}`);
            }}
          />
          <div style={{ width: 10 }} />
          <Navbar.Heading>Ontologies</Navbar.Heading>
          <Navbar.Divider />
          <Navbar.Heading>
            {isLoading ? <>{isLoading}...</> : null}
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align='right'>
          <ButtonGroup>
            <Button icon='add' onClick={() => setOpen('create')}>
              Add new Ontology
            </Button>
          </ButtonGroup>
        </Navbar.Group>
      </Navbar>
      <div className='ontology-page-content'>
        {!ontologies && <></>}
        {ontologies?.length === 0 && (
          <NonIdealState
            title='No Ontologies'
            icon='search-around'
            description='There are no ontologies in this workspace'
            action={
              <Button
                intent='primary'
                icon='add'
                onClick={() => setOpen('create')}
              >
                Add new Ontology
              </Button>
            }
          />
        )}
        <div className='card-grid-4'>
          {ontologies &&
            ontologies.length > 0 &&
            ontologies.map(ontology => (
              <OntologyCardItem
                ontology={ontology}
                onDelete={handleDelete}
                onOpen={ontology => {
                  navigation(`/workspaces/${uuid}/ontologies/${ontology.uuid}`);
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default OntologiesPage;
