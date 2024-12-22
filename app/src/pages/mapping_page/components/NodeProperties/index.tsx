import LiteralNodeProperties from '@/pages/mapping_page/components/NodeProperties/components/LiteralProperties';
import URIRefProperties from '@/pages/mapping_page/components/NodeProperties/components/URIRefProperties';
import { NonIdealState } from '@blueprintjs/core';
import { useStore } from '@xyflow/react';
import {
  EntityNodeType,
  LiteralNodeType,
  URIRefNodeType,
} from '../MainPanel/types';
import EntityNodeProperties from './components/EntityProperties';

const NodeProperties = () => {
  const selectedNode = useStore(state => state.nodes.find(n => n.selected));

  if (!selectedNode) {
    return (
      <NonIdealState
        icon='graph'
        title='Select a node'
        description='Select a node to view and edit its properties.'
      />
    );
  }

  if (selectedNode.data.type === 'entity') {
    return <EntityNodeProperties node={selectedNode as EntityNodeType} />;
  }
  if (selectedNode.data.type === 'uri_ref') {
    return <URIRefProperties node={selectedNode as URIRefNodeType} />;
  }
  if (selectedNode.data.type === 'literal') {
    return <LiteralNodeProperties node={selectedNode as LiteralNodeType} />;
  }
};

export default NodeProperties;
