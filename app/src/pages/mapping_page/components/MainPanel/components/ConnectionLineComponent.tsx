import { getSmoothStepPath } from '@xyflow/react';

const ConnectionLineComponent = ({
  fromX,
  fromY,
  toX,
  toY,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    targetX: toX,
    targetY: toY,
    borderRadius: 10,
  });

  return <path d={edgePath} fill='none' stroke='#b1b1b7' strokeWidth={4} />;
};

export default ConnectionLineComponent;
