import { InternalNode, Position } from '@xyflow/react';

export function getHandlePosition(
  node: InternalNode,
  handleId: string,
): { x: number; y: number } {
  const nodeLocation = node.internals.positionAbsolute;

  const nodeHandle = [
    ...(node.internals.handleBounds?.source ?? []),
    ...(node.internals.handleBounds?.target ?? []),
  ].find(handle => handle.id === handleId);

  if (!nodeHandle) {
    throw new Error('Handle not found');
  }

  const nodeHandleDimensions = {
    width: nodeHandle.width,
    height: nodeHandle.height,
  };

  return {
    x: nodeHandle.x + nodeLocation.x + nodeHandleDimensions.width / 2,
    y: nodeHandle.y + nodeLocation.y + nodeHandleDimensions.height / 2,
  };
}

export function getOuterBoundaryOfHandle(
  node: InternalNode,
  handleAbsoluteLocation: { x: number; y: number },
  position: Position,
): { x: number; y: number } {
  const width = node.measured.width ?? 250;
  const height = node.measured.height ?? 100;

  switch (position) {
    case Position.Top:
      return {
        x: handleAbsoluteLocation.x,
        y: handleAbsoluteLocation.y - height / 2,
      };
    case Position.Bottom:
      return {
        x: handleAbsoluteLocation.x,
        y: handleAbsoluteLocation.y + height / 2,
      };
    case Position.Left:
      return {
        x: handleAbsoluteLocation.x - width / 2,
        y: handleAbsoluteLocation.y,
      };
    case Position.Right:
      return {
        x: handleAbsoluteLocation.x + width / 2,
        y: handleAbsoluteLocation.y,
      };
  }
}

export function getCenter(
  node: InternalNode,
  handleId: string,
  handlePosition: Position,
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
): { x: number; y: number } {
  // Center's x is always located on left or right side of the handle
  // Center's y is always located between two handles
  // Make offset based on the distance between two handles
  const dx = Math.abs(sourceX - targetX);
  const dy = sourceY - targetY;
  const offset = dx * 0.5 + dy * 0.2;
  const handle = [
    ...(node.internals.handleBounds?.source ?? []),
    ...(node.internals.handleBounds?.target ?? []),
  ].find(handle => handle.id === handleId);

  if (!handle) {
    throw new Error('Handle not found');
  }

  const handleDimensions = {
    width: handle.width,
    height: handle.height,
  };

  const nodeLocation = node.internals.positionAbsolute;

  const handleX = handle.x + nodeLocation.x + handleDimensions.width / 2;

  const x =
    handlePosition === Position.Left ? handleX - offset : handleX + offset;
  const y = (sourceY + targetY) / 2;

  return { x, y };
}

export function getHandlePositionType(
  sourceHandleLocation: { x: number; y: number },
  targetHandleLocation: { x: number; y: number },
  preventTopBottom: boolean = false,
): Position {
  const dx = targetHandleLocation.x - sourceHandleLocation.x;
  const dy = targetHandleLocation.y - sourceHandleLocation.y;

  if (Math.abs(dx) > Math.abs(dy) || preventTopBottom) {
    return dx >= 0 ? Position.Right : Position.Left;
  }
  if (preventTopBottom) {
    return Position.Left;
  }

  return dy > 0 ? Position.Bottom : Position.Top;
}

export function getCenterForSameNode(
  sourceHandleLocation: { x: number; y: number },
  targetHandleLocation: { x: number; y: number },
): { x: number; y: number } {
  // Place the center far left of the source handle
  const x = sourceHandleLocation.x - 400;
  const y = (sourceHandleLocation.y + targetHandleLocation.y) / 2;

  return { x, y };
}

export function getEdgePosition(
  source: InternalNode,
  sourceHandleId: string,
  target: InternalNode,
  targetHandleId: string,
): {
  sx: number;
  sy: number;
  sp: Position;
  tx: number;
  ty: number;
  tp: Position;
  cx: number;
  cy: number;
} {
  const sourceLocation = getHandlePosition(source, sourceHandleId);
  const targetLocation = getHandlePosition(target, targetHandleId);

  const isSameNode = source.id === target.id;

  const sourcePos = isSameNode
    ? Position.Left
    : getHandlePositionType(sourceLocation, targetLocation, true);
  const targetPos = isSameNode
    ? Position.Left
    : getHandlePositionType(targetLocation, sourceLocation);

  const { x: centerX, y: centerY } = isSameNode
    ? getCenterForSameNode(sourceLocation, targetLocation)
    : getCenter(
        source,
        sourceHandleId,
        sourcePos,
        sourceLocation.x,
        sourceLocation.y,
        targetLocation.x,
        targetLocation.y,
      );

  const sourceOuterBoundary = getOuterBoundaryOfHandle(
    source,
    sourceLocation,
    sourcePos,
  );

  const targetOuterBoundary = getOuterBoundaryOfHandle(
    target,
    targetLocation,
    targetPos,
  );

  return {
    sx: sourceOuterBoundary.x,
    sy: sourceOuterBoundary.y,
    sp: sourcePos,
    tx: targetOuterBoundary.x,
    ty: targetOuterBoundary.y,
    tp: targetPos,
    cx: centerX,
    cy: centerY,
  };
}
