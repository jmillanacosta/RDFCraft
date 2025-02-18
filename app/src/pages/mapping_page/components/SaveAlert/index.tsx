import {
  XYEdgeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import useMappingPage from '@/pages/mapping_page/state';
import { Button, Dialog, DialogBody, DialogFooter } from '@blueprintjs/core';
import { useEdges, useNodes } from '@xyflow/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SaveAlertProps {
  onClose: () => void;
  workspace_uuid: string | undefined;
  mapping_uuid: string | undefined;
  open: boolean;
}

const SaveAlert = (props: SaveAlertProps) => {
  const navigate = useNavigate();

  const mapping = useMappingPage(state => state.mapping);
  const saveMapping = useMappingPage(state => state.saveMapping);

  const nodes = useNodes<XYNodeTypes>();
  const edges = useEdges<XYEdgeType>();

  const onSave = useCallback(async () => {
    if (!props.workspace_uuid || !props.mapping_uuid || !mapping) return;
    await saveMapping(
      props.workspace_uuid,
      props.mapping_uuid,
      mapping,
      nodes,
      edges,
    );
    navigate(`/workspaces/${props.workspace_uuid}`);
  }, [
    nodes,
    edges,
    mapping,
    saveMapping,
    navigate,
    props.workspace_uuid,
    props.mapping_uuid,
  ]);

  const onDiscard = useCallback(() => {
    navigate(`/workspaces/${props.workspace_uuid}`);
  }, [navigate, props.workspace_uuid]);

  return (
    <Dialog
      title='Unsaved Changes'
      isOpen={props.open}
      onClose={props.onClose}
      icon='warning-sign'
      className='bp5-dark'
    >
      <DialogBody>
        <p>There are unsaved changes. Do you want to save them?</p>
      </DialogBody>
      <DialogFooter
        actions={
          <>
            <Button intent='primary' onClick={onSave}>
              Save
            </Button>
            <Button intent='danger' onClick={onDiscard}>
              Discard
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </>
        }
      />
    </Dialog>
  );
};

export default SaveAlert;
