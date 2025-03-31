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

  // Calculate vertical offset based on node size
  const sourceValue = data.links[index].value;
  const maxValue = Math.max(...data.links.map((link: any) => link.value));
  const verticalOffset = -Math.round((sourceValue / maxValue) * 15);

  return (
    <g className="recharts-sankey-link">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={sourceNode.color} />
          <stop offset="100%" stopColor={targetNode.color} />
        </linearGradient>
      </defs>
      <path
        d={`
          M${sourceX},${sourceY + verticalOffset}
          C${sourceControlX},${sourceY + verticalOffset} ${targetControlX},${targetY + verticalOffset} ${targetX},${targetY + verticalOffset}
          L${targetX},${targetY + linkWidth + verticalOffset}
          C${targetControlX},${targetY + linkWidth + verticalOffset} ${sourceControlX},${sourceY + linkWidth + verticalOffset} ${sourceX},${sourceY + linkWidth + verticalOffset}
          Z
        `}
        fill={`url(#${gradientId})`}
        stroke="none"
        strokeWidth={0}
        fillOpacity={0.7}
        className="animated-link"
      />
    </g>
  );
};

export default SankeyLink;
