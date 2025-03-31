
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
  isMobile?: boolean;
}

const SankeyNode: React.FC<SankeyNodeProps> = (props) => {
  const { x, y, width, height, index, payload, data, isMobile } = props;
  const node = data.nodes[index];
  const nodeColor = node.color;
  const isLeftSide = node.category === 'income';
  const isRightSide = node.category === 'expense' || 
                      (node.category === 'balance' && node.name !== 'Budget');
  const isMiddle = node.name === 'Budget';
  
  // Apply a vertical offset to better align with the middle column
  const verticalOffset = -10;
  const adjustedY = y + (isLeftSide || isRightSide ? verticalOffset : 0);
  
  // Adjust x position for labels based on device size
  const labelOffset = isMobile ? 3 : 5;
  const labelX = isLeftSide 
    ? x - labelOffset 
    : isRightSide 
      ? x + width + labelOffset 
      : x + width / 2;
  
  // Text alignment based on node position
  const textAnchor = isLeftSide 
    ? 'end' 
    : isRightSide 
      ? 'start' 
      : 'middle';

  // Don't show percentage for Budget node
  const showPercentage = !isMiddle;
  
  // Adjust font sizes for mobile
  const labelClassName = isMobile 
    ? "sankey-node-label text-[10px]" 
    : "sankey-node-label";
  
  const percentageClassName = isMobile 
    ? "sankey-node-percentage text-[9px]" 
    : "sankey-node-percentage";
  
  // Adjust vertical spacing for mobile
  const labelYOffset = isMobile ? 6 : 8;
  const percentageYOffset = isMobile ? 10 : 14;

  // Ensure "Budget" label is centered in the rectangle
  const budgetLabelY = isMiddle ? adjustedY + height / 2 : adjustedY + height / 2 - (showPercentage ? labelYOffset : 0);

  return (
    <g>
      <Rectangle
        x={x}
        y={adjustedY}
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
        y={budgetLabelY}
        textAnchor={textAnchor}
        dominantBaseline="middle"
        className={labelClassName}
      >
        {node.name}
      </text>
      {showPercentage && (
        <text
          x={labelX}
          y={adjustedY + height / 2 + percentageYOffset}
          textAnchor={textAnchor}
          dominantBaseline="middle"
          className={percentageClassName}
        >
          {node.percentage}%
        </text>
      )}
    </g>
  );
};

export default SankeyNode;
