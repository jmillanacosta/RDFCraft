import { getEdgePosition } from '@/pages/mapping_page/components/MainPanel/utils';
import { EdgeProps, getSmoothStepPath, useInternalNode } from '@xyflow/react';

import './styles.scss';

function FloatingEdge({
  id,
  source,
  target,
  markerEnd,
  style,
  sourceHandleId,
  targetHandleId,
  selected,
}: EdgeProps) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, sp, tx, ty, tp, cx, cy } = getEdgePosition(
    sourceNode,
    sourceHandleId ?? '',
    targetNode,
    targetHandleId ?? '',
  );

  const [edgePath] = getSmoothStepPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sp,
    targetX: tx,
    targetY: ty,
    targetPosition: tp,
    borderRadius: 10,
    centerX: cx,
    centerY: cy,
  });

  return (
    <path
      id={id}
      d={edgePath}
      markerEnd={markerEnd}
      style={{
        ...style,
        stroke: selected ? '#215DB0' : style?.stroke,
      }}
      fill='none'
    />
  );
}

export default FloatingEdge;
