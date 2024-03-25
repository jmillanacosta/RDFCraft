'use client';

import { Delete } from '@mui/icons-material';
import { Box } from '@mui/material';
import ReactFlow, {
    Background,
    ConnectionMode,
    ControlButton,
    Controls,
    MiniMap,
    Node,
    useReactFlow,
} from 'reactflow';

import { v4 as uuid_v4 } from 'uuid';

import { ObjectNodeDataModel } from '@/lib/models/MappingModel';
import useMappingStore from '@/lib/stores/MappingStore';
import { useCallback, useState } from 'react';
import 'reactflow/dist/style.css';
import FlowContextMenu from './components/FlowContextMenu';
import { nodeTypes } from './nodeTypes';
import './style.css';

const Flow = () => {
    const reactflow = useReactFlow();

    const nodes = useMappingStore((state) => state.nodes);
    const edges = useMappingStore((state) => state.edges);
    const onNodesChange = useMappingStore((state) => state.onNodesChange);
    const onEdgesChange = useMappingStore((state) => state.onEdgesChange);

    const [anchorPosition, setAnchorPosition] = useState<
        [number, number] | null
    >(null);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setAnchorPosition([e.clientX, e.clientY]);
    }, []);

    const addNode = useCallback(() => {
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
                x: pos.x - 400,
                y: pos.y - 200,
            },
            type: 'objectNode',
            width: 300,
            height: 300,
        };

        reactflow.addNodes([new_node]);

        setAnchorPosition(null);
    }, [anchorPosition, reactflow]);

    return (
        <div onContextMenu={onContextMenu}>
            <Box height='90vh' width='100vw' padding={2}>
                <FlowContextMenu
                    contextMenuLocation={anchorPosition}
                    handleCloseContextMenu={() => setAnchorPosition(null)}
                    addNode={addNode}
                />
                <ReactFlow
                    attributionPosition='bottom-right'
                    connectionMode={ConnectionMode.Loose}
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                >
                    <Background color='#aaa' gap={16} />
                    <Controls position='top-right'>
                        <ControlButton>
                            <Delete color='error' />
                        </ControlButton>
                    </Controls>
                    <MiniMap pannable zoomable nodeColor='#784be8' />
                </ReactFlow>
            </Box>
        </div>
    );
};

export default Flow;
