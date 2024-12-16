import { Menu, MenuItem, showContextMenu } from '@blueprintjs/core';

import {
  addEdge,
  Background,
  Connection,
  Controls,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback } from 'react';
import { MappingGraph } from '../../../../lib/api/mapping_service/types';
import EntityNode from './components/EntityNode';
import { XYEdgeType, XYNodeTypes } from './types';

type MainPanelProps = {
  initialGraph: MappingGraph | null;
};
const nodeTypes: NodeTypes = {
  entity: EntityNode,
};

const MainPanel = ({ initialGraph }: MainPanelProps) => {
  const reactflow = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<XYNodeTypes>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<XYEdgeType>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(edges => addEdge(params, edges));
    },
    [setEdges],
  );

  const handleAddEntityNode = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setNodes(nodes => [
        ...nodes,
        {
          id: `node-${nodes.length}`,
          data: {
            id: `node-${nodes.length}`,
            label: 'New Entity',
            rdf_type: [],
            uri_pattern: '',
            properties: [],
            type: 'entity',
          },
          width: 200,
          height: 100,
          position: reactflow.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          }),
          type: 'entity',
        },
      ]);
    },
    [setNodes, reactflow],
  );

  const openMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showContextMenu({
      content: (
        <Menu>
          <MenuItem text='Create Node' onClick={handleAddEntityNode} />
          <MenuItem text='Create URI Reference' />
          <MenuItem text='Create Literal' />
        </Menu>
      ),
      targetOffset: { left: e.clientX, top: e.clientY },
      isDarkTheme: true,
    });
  };

  return (
    // disable default right click menu
    <div className='main-panel'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode='dark'
        onContextMenu={openMenu}
      >
        <Background bgColor='#1C2127' gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default MainPanel;
