import LiteralNodeProperties from '@/pages/mapping_page/components/NodeProperties/components/LiteralProperties';
import URIRefProperties from '@/pages/mapping_page/components/NodeProperties/components/URIRefProperties';
import { NonIdealState } from '@blueprintjs/core';
import { useNodes } from '@xyflow/react';
import { useEffect, useMemo, useState } from 'react';
import {
  EntityNodeType,
  LiteralNodeType,
  URIRefNodeType,
  XYNodeTypes,
} from '../MainPanel/types';
import EntityNodeProperties from './components/EntityProperties';

const NodeProperties = () => {
  const nodes = useNodes<XYNodeTypes>();

  const selectedNodes = useMemo(() => {
    return nodes.filter(node => node.selected);
  }, [nodes]);

  const [selectedNode, setSelectedNode] = useState<XYNodeTypes | null>(null);

  useEffect(() => {
    if (selectedNodes.length === 1) {
      setSelectedNode(selectedNodes[0]);
    } else {
      setSelectedNode(null);
    }
  }, [selectedNodes]);

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
