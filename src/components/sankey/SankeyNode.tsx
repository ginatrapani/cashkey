
import React from 'react';
import { Rectangle } from 'recharts';

interface SankeyNodeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
  payload: any;
  containerWidth: number;
  data: any;
}

const SankeyNode: React.FC<SankeyNodeProps> = (props) => {
  const { x, y, width, height, index, payload, data } = props;
  const node = data.nodes[index];
  const nodeColor = node.color;
  const isLeftSide = node.category === 'income';
  const isRightSide = node.category === 'expense' || 
                      (node.category === 'balance' && node.name !== 'Budget');
  const isMiddle = node.name === 'Budget';
  
  // Adjust x position for labels
  const labelX = isLeftSide 
    ? x - 5 
    : isRightSide 
      ? x + width + 5 
      : x + width / 2;
  
  // Text alignment based on node position
  const textAnchor = isLeftSide 
    ? 'end' 
    : isRightSide 
      ? 'start' 
      : 'middle';

  // Don't show percentage for Budget node
  const showPercentage = !isMiddle;
  
  return (
    <g>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={nodeColor}
        fillOpacity={0.9}
        className="animated-node sankey-node"
        rx={4}
        ry={4}
      />
      <text
        x={labelX}
        y={y + height / 2 - (showPercentage ? 8 : 0)}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className="sankey-node-label"
      >
        {node.name}
      </text>
      {showPercentage && (
        <text
          x={labelX}
          y={y + height / 2 + 14}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          className="sankey-node-percentage"
        >
          {node.percentage}%
        </text>
      )}
    </g>
  );
};

export default SankeyNode;
