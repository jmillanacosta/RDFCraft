import { Position } from '@xyflow/react';

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode,
  intersectionNodeHandleId,
  targetNode,
  targetNodeHandleId,
) {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a

  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const intersectionNodeHandle = [
    ...(intersectionNode.internals.handleBounds.source || []),
    ...(intersectionNode.internals.handleBounds.target || []),
  ].find(handle => handle.id === intersectionNodeHandleId);

  const targetNodeHandle = [
    ...(targetNode.internals.handleBounds.source || []),
    ...(targetNode.internals.handleBounds.target || []),
  ].find(handle => handle.id === targetNodeHandleId);

  const w = intersectionNodeHandle.width / 2;
  const h = intersectionNodeHandle.height / 2;

  const x2 = intersectionNodeHandle.x + intersectionNodePosition.x + w;
  const y2 = intersectionNodeHandle.y + intersectionNodePosition.y + h;
  const x1 = targetNodeHandle.x + targetPosition.x + targetNodeHandle.width / 2;
  const y1 =
    targetNodeHandle.y + targetPosition.y + targetNodeHandle.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1) || 1);
  const xx3 = a * xx1;
  const yy3 = a * yy1;

  // Calculate y normally
  const y = h * (-xx3 + yy3) + y2;

  // Clamp x to either left or right edge
  const x =
    x1 < x2
      ? intersectionNodeHandle.x + intersectionNodePosition.x // left edge
      : intersectionNodeHandle.x +
        intersectionNodePosition.x +
        intersectionNodeHandle.width; // right edge

  return { x, y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node, intersectionPoint) {
  const n = { ...node.measured.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source, sourceHandleId, target, targetHandleId) {
  const sourceIntersectionPoint = getNodeIntersection(
    source,
    sourceHandleId,
    target,
    targetHandleId,
  );
  const targetIntersectionPoint = getNodeIntersection(
    target,
    targetHandleId,
    source,
    sourceHandleId,
  );

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
