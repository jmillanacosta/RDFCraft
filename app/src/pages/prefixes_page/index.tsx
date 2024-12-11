import { Button, ButtonGroup, Navbar, NonIdealState } from '@blueprintjs/core';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteAlert from '../../components/DeleteAlert';
import useErrorToast from '../../hooks/useErrorToast';
import { Prefix } from '../../lib/api/prefix_api/types';
import AddPrefixDialog from './components/AddPrefixDialog';
import PrefixCardItem from './components/PrefixCardItem';
import usePrefixesPageState from './state';
import './styles.scss';

type PrefixPageUrlProps = {
  uuid: string;
};

const PrefixPage = () => {
  const { uuid } = useParams<PrefixPageUrlProps>();
  const navigation = useNavigate();
  const prefixes = usePrefixesPageState(state => state.prefixes);
  const isLoading = usePrefixesPageState(state => state.isLoading);
  const error = usePrefixesPageState(state => state.error);
  const refreshPrefixes = usePrefixesPageState(state => state.refreshPrefixes);
  const createPrefix = usePrefixesPageState(state => state.createPrefix);
  const deletePrefix = usePrefixesPageState(state => state.deletePrefix);

  const [open, setOpen] = useState<'create' | 'delete' | null>(null);
  const [toBeDeleted, setToBeDeleted] = useState<string | null>(null);

  const handleDelete = (prefix: Prefix) => {
    setToBeDeleted(prefix.prefix);
    setOpen('delete');
  };

  useErrorToast(error);

  useEffect(() => {
    if (uuid) {
      refreshPrefixes(uuid);
    }
  }, [uuid, refreshPrefixes]);

  return (
    <div className='prefix-page'>
      <DeleteAlert
        open={open === 'delete'}
        onClose={() => setOpen(null)}
        onConfirm={() => {
          if (toBeDeleted && uuid) {
            deletePrefix(uuid, toBeDeleted);
            refreshPrefixes(uuid);
          }
          setOpen(null);
        }}
        title='Delete Prefix'
        message='Are you sure you want to delete this prefix?'
      />
      <AddPrefixDialog
        open={open === 'create'}
        onClose={() => setOpen(null)}
        onCreate={data => {
          if (uuid) {
            createPrefix(uuid, data);
            refreshPrefixes(uuid);
          }
          setOpen(null);
        }}
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
          <Navbar.Heading>Prefixes</Navbar.Heading>
          <Navbar.Divider />
          <Navbar.Heading>
            {isLoading ? <>{isLoading}...</> : null}
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align='right'>
          <ButtonGroup>
            <Button icon='add' onClick={() => setOpen('create')}>
              Add Prefix
            </Button>
          </ButtonGroup>
        </Navbar.Group>
      </Navbar>
      <div className='prefix-page-content'>
        {!prefixes && <></>}
        {prefixes?.length === 0 && (
          <NonIdealState
            title='No Prefixes'
            icon='search-around'
            description='There are no prefixes in this workspace'
            action={
              <Button
                intent='primary'
                icon='add'
                onClick={() => setOpen('create')}
              >
                Add new Prefix
              </Button>
            }
          />
        )}
        {prefixes && prefixes.length > 0 && (
          <div className='card-grid-4'>
            {prefixes.map(prefix => (
              <PrefixCardItem
                key={prefix.prefix}
                prefix={prefix}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrefixPage;
