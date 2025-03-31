
import React from 'react';

interface SankeyLinkProps {
  sourceX: number;
  sourceY: number;
  sourceControlX: number;
  targetX: number;
  targetY: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
  payload: any;
  data: any;
}

const SankeyLink: React.FC<SankeyLinkProps> = (props) => {
  const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index, data } = props;
  
  const gradientId = `linkGradient${index}`;
  const sourceNode = data.nodes[data.links[index].source];
  const targetNode = data.nodes[data.links[index].target];
  
  // Apply a vertical offset to better align with the budget column
  const verticalOffset = -10;
  const adjustedSourceY = sourceY + (sourceNode.category === 'income' ? verticalOffset : 0);
  const adjustedTargetY = targetY + (targetNode.category === 'expense' ? verticalOffset : 0);
  
  return (
    <g>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={sourceNode.color} />
          <stop offset="100%" stopColor={targetNode.color} />
        </linearGradient>
      </defs>
      <path
        d={`
          M${sourceX},${adjustedSourceY}
          C${sourceControlX},${adjustedSourceY} ${targetControlX},${adjustedTargetY} ${targetX},${adjustedTargetY}
          L${targetX},${adjustedTargetY + linkWidth}
          C${targetControlX},${adjustedTargetY + linkWidth} ${sourceControlX},${adjustedSourceY + linkWidth} ${sourceX},${adjustedSourceY + linkWidth}
          Z
        `}
        fill={`url(#${gradientId})`}
        stroke="none"
        strokeWidth={0}
        fillOpacity={0.7}
        className="animated-link sankey-link"
      />
    </g>
  );
};

export default SankeyLink;
