'use client';

import { Delete, East, West } from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import ReactFlow, {
  Background,
  ConnectionMode,
  ControlButton,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  useReactFlow,
} from 'reactflow';

import { v4 as uuid_v4 } from 'uuid';

import {
  EdgeDataModel,
  NodeTypes,
  ObjectNodeDataModel,
  UriRefNodeDataModel,
} from '@/lib/models/MappingModel';
import {
  OntologyClassDocument,
  OntologyPropertyDocument,
} from '@/lib/models/OntologyIndexModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import 'reactflow/dist/style.css';
import FlowContextMenu from './components/FlowContextMenu';
import OnConnectionMenu from './components/OnConnectionMenu';
import useNodeSearch from './hooks/useNodeSearch';
import { edgeTypes, nodeTypes } from './nodeTypes';
import './style.css';

const Flow = () => {
  const reactflow = useReactFlow();

  const nodes = useMappingStore(state => state.nodes);
  const edges = useMappingStore(state => state.edges);
  const onNodesChange = useMappingStore(state => state.onNodesChange);
  const onEdgesChange = useMappingStore(state => state.onEdgesChange);

  const [searchText, setSearchText] = useState<string>('');

  const {
    searchResults,
    nextNode,
    previousNode,
    nextButtonDisabled,
    previousButtonDisabled,
    currentNodeIndex,
  } = useNodeSearch(searchText);

  useEffect(() => {
    const focusNode = () => {
      if (searchResults.length === 0 || currentNodeIndex === null) return;
      reactflow.fitView({
        duration: 300,
        nodes: [searchResults[currentNodeIndex]],
      });
    };
    focusNode();
  }, [searchResults, currentNodeIndex, reactflow]);

  const [openDialog, setOpenDialog] = useState<'menu' | 'onConnect' | null>(
    null,
  );

  const [anchorPosition, setAnchorPosition] = useState<[number, number] | null>(
    null,
  );

  const [connectionStart, setConnectionStart] = useState<Node | null>(null);

  const [connectionTarget, setConnectionTarget] = useState<Node | null>(null);

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setAnchorPosition([e.clientX, e.clientY]);
    setOpenDialog('menu');
  }, []);

  const onConnectionStart = useCallback<OnConnectStart>(
    (event, { nodeId, handleType }) => {
      setConnectionStart(nodes.find(node => node.id === nodeId) || null);
    },
    [nodes],
  );

  const onConnectEnd = useCallback<OnConnectEnd>(event => {
    const targetIsPane =
      event.target instanceof HTMLElement &&
      event.target.classList.contains('react-flow__pane');

    if (targetIsPane) {
      if (event instanceof MouseEvent)
        setAnchorPosition([event.clientX, event.clientY]);
      else if (event instanceof TouchEvent)
        setAnchorPosition([event.touches[0].clientX, event.touches[0].clientY]);

      setOpenDialog('onConnect');
    }
  }, []);

  const onConnectSubmit = useCallback(
    (
      predicate: OntologyPropertyDocument,
      target: OntologyClassDocument | string | null,
    ) => {
      if (connectionStart === null) return;
      if (connectionTarget !== null) {
        const new_edge: Edge<EdgeDataModel> = {
          id: uuid_v4(),
          source: connectionStart.id,
          target: connectionTarget.id,
          type: 'floating',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: {
            predicate_type:
              target === 'string' ? 'data_property' : 'object_property',
            full_uri: predicate.full_uri,
            label: predicate.label,
          },
        };
        onEdgesChange([
          {
            item: new_edge,
            type: 'add',
          },
        ]);
        return;
      }
      if (target === null) {
        const node: Node<UriRefNodeDataModel> = {
          id: uuid_v4(),

          position: {
            x: anchorPosition![0],
            y: anchorPosition![1],
          },
          type: 'uriref',
          data: {
            label: 'New URI Node',
            pattern: '',
            rdf_type: '',
          },
        };
        const edge: Edge<EdgeDataModel> = {
          id: uuid_v4(),
          source: connectionStart.id,
          target: node.id,
          type: 'floating',
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          data: {
            predicate_type: 'data_property',
            full_uri: predicate.full_uri,
            label: predicate.label,
          },
        };
        onNodesChange([
          {
            item: node,
            type: 'add',
          },
        ]);
        onEdgesChange([
          {
            item: edge,
            type: 'add',
          },
        ]);
        return;
      }
      const node: Node = {
        id: uuid_v4(),
        width: 300,
        height: 300,
        position: {
          x: anchorPosition![0],
          y: anchorPosition![1],
        },
        type: typeof target === 'string' ? 'literal' : 'object',
        data: {
          is_blank_node: false,
          label: 'New Object Node',
          pattern: '',
          pattern_prefix: '',
          rdf_type: typeof target === 'string' ? target : target.full_uri,
        },
      };

      const edge: Edge<EdgeDataModel> = {
        id: uuid_v4(),
        source: connectionStart.id,
        target: node.id,
        type: 'floating',
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        data: {
          predicate_type:
            target === 'string' ? 'data_property' : 'object_property',
          full_uri: predicate.full_uri,
          label: predicate.label,
        },
      };
      onNodesChange([
        {
          item: node,
          type: 'add',
        },
      ]);
      onEdgesChange([
        {
          item: edge,
          type: 'add',
        },
      ]);
    },
    [
      connectionStart,
      anchorPosition,
      connectionTarget,
      onNodesChange,
      onEdgesChange,
    ],
  );

  const onConnect = useCallback<OnConnect>(
    connection => {
      const source = nodes.find(node => node.id === connection.source);
      const target = nodes.find(node => node.id === connection.target);
      if (!source) {
        enqueueSnackbar(<Typography>Error finding source node</Typography>, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        return;
      }
      if (!target) {
        enqueueSnackbar(<Typography>Error finding target node</Typography>, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        return;
      }

      setConnectionTarget(target);
      setConnectionStart(source);
      setAnchorPosition([
        (source.position.x + target.position.x) / 2,
        (source.position.y + target.position.y) / 2,
      ]);
      setOpenDialog('onConnect');
    },
    [nodes],
  );

  const addNode = useCallback(
    (type: NodeTypes) => {
      var pos = reactflow.screenToFlowPosition({
        x: anchorPosition![0],
        y: anchorPosition![1],
      });

      const new_node: Node<ObjectNodeDataModel> = {
        id: uuid_v4(),
        data: {
          is_blank_node: false,
          label: 'New Object Node',
          pattern: '',
          pattern_prefix: '',
          rdf_type: '',
        },
        position: {
          x: pos.x,
          y: pos.y,
        },
        type: type,
        width: 300,
        height: 300,
      };
      onNodesChange([
        {
          item: new_node,
          type: 'add',
        },
      ]);

      setAnchorPosition(null);
    },
    [anchorPosition, reactflow, onNodesChange],
  );

  return (
    <div onContextMenu={onContextMenu}>
      <Box height='90vh' width='100vw' padding={2}>
        <FlowContextMenu
          open={openDialog === 'menu' && anchorPosition !== null}
          contextMenuLocation={anchorPosition}
          handleCloseContextMenu={() => setOpenDialog(null)}
          addNode={addNode}
        />
        <OnConnectionMenu
          open={openDialog === 'onConnect' && anchorPosition !== null}
          anchorPosition={anchorPosition}
          enableSubmit={connectionStart !== null}
          onClose={() => setOpenDialog(null)}
          source={connectionStart}
          target={connectionTarget}
          onSubmit={onConnectSubmit}
        />
        <ReactFlow
          attributionPosition='bottom-right'
          connectionMode={ConnectionMode.Loose}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnectStart={onConnectionStart}
          onConnectEnd={onConnectEnd}
          onConnect={onConnect}
        >
          <Background color='#aaa' gap={16} />
          <Controls position='top-right'>
            <ControlButton
              onClick={e => {
                e.preventDefault();
                const selectedNodes = nodes.filter(node => node.selected);
                const selectedNodeConnections = edges.filter(edge =>
                  selectedNodes.some(
                    node => node.id === edge.source || node.id === edge.target,
                  ),
                );
                const selectedEdges = edges.filter(edge => edge.selected);
                const allEdgesChanges = [
                  ...selectedNodeConnections,
                  ...selectedEdges,
                ];
                // Delete duplicate edges
                const uniqueEdges = allEdgesChanges.filter(
                  (edge, index, self) =>
                    index === self.findIndex(t => t.id === edge.id),
                );
                onEdgesChange(
                  uniqueEdges.map(edge => ({
                    type: 'remove',
                    id: edge.id,
                  })),
                );
                onNodesChange(
                  selectedNodes.map(node => {
                    return {
                      type: 'remove',
                      id: node.id,
                    };
                  }),
                );
              }}
            >
              <Delete color='error' />
            </ControlButton>
          </Controls>
          <MiniMap pannable zoomable nodeColor='#784be8' />
          <Panel position='top-left'>
            <Card>
              <Grid container>
                <TextField
                  variant='filled'
                  label='Search'
                  onChange={event => {
                    setSearchText(event.target.value);
                  }}
                />
                <Tooltip title='Previous'>
                  <>
                    <IconButton
                      disabled={previousButtonDisabled()}
                      onClick={previousNode}
                    >
                      <West />
                    </IconButton>
                  </>
                </Tooltip>
                <Tooltip title='Next'>
                  <>
                    <IconButton
                      disabled={nextButtonDisabled()}
                      onClick={nextNode}
                    >
                      <East />
                    </IconButton>
                  </>
                </Tooltip>
              </Grid>
            </Card>
          </Panel>
        </ReactFlow>
      </Box>
    </div>
  );
};

export default Flow;
