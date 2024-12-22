import { Menu, MenuItem, showContextMenu } from '@blueprintjs/core';

import {
  addEdge,
  Background,
  Connection,
  Controls,
  EdgeTypes,
  MarkerType,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { useCallback, useEffect } from 'react';
import { MappingGraph } from '../../../../lib/api/mapping_service/types';

import ConnectionLineComponent from '@/pages/mapping_page/components/MainPanel/components/ConnectionLineComponent';
import { EntityNode } from '@/pages/mapping_page/components/MainPanel/components/EntityNode';
import FloatingEdge from '@/pages/mapping_page/components/MainPanel/components/FloatingEdge';
import { LiteralNode } from '@/pages/mapping_page/components/MainPanel/components/LiteralNode';

import { URIRefNode } from '@/pages/mapping_page/components/MainPanel/components/URIRefNode';
import { useBackendMappingGraph } from '@/pages/mapping_page/hooks/useBackendMappingGraph';
import { XYEdgeType, XYNodeTypes } from './types';

type MainPanelProps = {
  initialGraph: MappingGraph | null;
};
const nodeTypes: NodeTypes = {
  entity: EntityNode,
  uri_ref: URIRefNode,
  literal: LiteralNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
  },
  style: {
    stroke: '#b1b1b7',
    strokeWidth: 4,
  },
};

const MainPanel = ({ initialGraph }: MainPanelProps) => {
  const reactflow = useReactFlow();
  const { nodes: initialNodes, edges: initialEdges } =
    useBackendMappingGraph(initialGraph);

  const [nodes, setNodes, onNodesChange] = useNodesState<XYNodeTypes>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<XYEdgeType>([]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

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
            position: reactflow.screenToFlowPosition({
              x: e.clientX,
              y: e.clientY,
            }),
          },
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

  const handleAddUriRefNode = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setNodes(nodes => [
        ...nodes,
        {
          id: `node-${nodes.length}`,
          data: {
            id: `node-${nodes.length}`,
            uri_pattern: 'http://example.com/',
            type: 'uri_ref',
            position: reactflow.screenToFlowPosition({
              x: e.clientX,
              y: e.clientY,
            }),
          },
          position: reactflow.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          }),
          type: 'uri_ref',
        },
      ]);
    },
    [setNodes, reactflow],
  );

  const handleAddLiteralNode = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const position = reactflow.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY,
      });
      setNodes(nodes => [
        ...nodes,
        {
          id: `node-${nodes.length}`,
          data: {
            id: `node-${nodes.length}`,
            label: 'New Literal',
            value: '',
            literal_type: 'string',
            type: 'literal',
            position: position,
          },
          position: position,
          type: 'literal',
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
          <MenuItem text='Create URI Reference' onClick={handleAddUriRefNode} />
          <MenuItem text='Create Literal' onClick={handleAddLiteralNode} />
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
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineComponent={ConnectionLineComponent}
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
