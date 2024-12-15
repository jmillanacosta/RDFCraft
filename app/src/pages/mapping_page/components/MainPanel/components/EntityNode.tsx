import { Card, H3 } from '@blueprintjs/core';
import { Handle, NodeProps, NodeResizer, Position } from '@xyflow/react';
import { EntityNodeType } from '../types';

const EntityNode: React.FC<NodeProps<EntityNodeType>> = node => {
  return (
    <>
      <NodeResizer
        color='blue'
        isVisible={node.selected}
        nodeId={node.id}
        minWidth={200}
        minHeight={100}
      />
      <Handle type='source' position={Position.Top} id='top' />
      <Handle type='target' position={Position.Bottom} id='bottom' />
      <Card
        style={{
          width: node.width,
          height: node.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <H3>{node.data.label}</H3>
      </Card>
      <Handle type='source' position={Position.Left} id='left' />
      <Handle type='target' position={Position.Right} id='right' />
    </>
  );
};

export default EntityNode;
