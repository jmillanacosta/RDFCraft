import {
  XYEdgeType,
  XYNodeTypes,
} from '@/pages/mapping_page/components/MainPanel/types';
import useMappingPage from '@/pages/mapping_page/state';
import { Navbar as BPNavbar, Button, ButtonGroup } from '@blueprintjs/core';
import { useEdges, useNodes } from '@xyflow/react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type NavbarProps = {
  workspace_uuid: string | undefined;
  mapping_uuid: string | undefined;
  name: string | undefined;
  isLoading: string | null;
  onCompleteMapping: () => void;
};

const Navbar = ({
  workspace_uuid,
  mapping_uuid,
  name,
  isLoading,
  onCompleteMapping,
}: NavbarProps) => {
  const navigation = useNavigate();
  const saveMapping = useMappingPage(state => state.saveMapping);

  const isSaved = useMappingPage(state => state.isSaved);
  const mapping = useMappingPage(state => state.mapping);

  const nodes = useNodes<XYNodeTypes>();
  const edges = useEdges<XYEdgeType>();

  const onSave = useCallback(() => {
    if (!workspace_uuid || !mapping_uuid || !mapping) return;
    saveMapping(workspace_uuid, mapping_uuid, mapping, nodes, edges);
  }, [nodes, edges, mapping, saveMapping, workspace_uuid, mapping_uuid]);

  return (
    <BPNavbar fixedToTop>
      <BPNavbar.Group>
        <Button
          icon='arrow-left'
          minimal
          onClick={() => {
            navigation(`/workspaces/${workspace_uuid}`);
          }}
        />
        <div style={{ width: 10 }} />
        <BPNavbar.Heading>Mapping: {name}</BPNavbar.Heading>
        <BPNavbar.Divider />
        <BPNavbar.Heading>
          {isLoading ? <>{isLoading}</> : null}
        </BPNavbar.Heading>
      </BPNavbar.Group>
      <BPNavbar.Group align='right'>
        <ButtonGroup>
          <Button
            icon='floppy-disk'
            onClick={onSave}
            intent={isSaved ? 'success' : 'warning'}
          >
            Save
          </Button>
          <Button icon='rocket' onClick={onCompleteMapping}>
            Map
          </Button>
        </ButtonGroup>
      </BPNavbar.Group>
    </BPNavbar>
  );
};

export default Navbar;
