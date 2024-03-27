'use client';

import { useMemo } from 'react';
import {
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useStore as useReactFlowStore,
} from 'reactflow';

import { EdgeDataModel } from '@/lib/models/MappingModel';
import { getEdgeParams } from '../../utils';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  data,
  selected,
}: EdgeProps<EdgeDataModel>) {
  const nodes = useReactFlowStore(store => store.nodeInternals);

  const sourceNode = useMemo(() => nodes.get(source), [source, nodes]);
  const targetNode = useMemo(() => nodes.get(target), [target, nodes]);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  const color =
    data?.predicate_type === 'data_property' ? '#ed902d' : '#784be8';

  if (!data) return null;

  return (
    <>
      <path
        id={id}
        className='react-flow__edge-path'
        d={edgePath}
        markerEnd={markerEnd}
        style={{ ...style, stroke: selected ? '#ffff' : color }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: color,
            width: 300,
            padding: 10,
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 700,
            pointerEvents: 'all',
          }}
          className='nodrag nopan'
        >
          {data!.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default FloatingEdge;
