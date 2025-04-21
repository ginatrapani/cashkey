import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { sankey } from 'd3-sankey';
import { CashflowItem } from '../types/cashflow';
import { processSankeyData } from '../utils/sankeyUtils';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SankeyDiagramProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
  className?: string;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ incomes, expenses, className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = processSankeyData(incomes, expenses);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Set up dimensions
    const margin = isMobile 
      ? { top: 30, right: 50, bottom: 30, left: 50 } // Minimal side margins for mobile
      : { top: 30, right: 180, bottom: 30, left: 180 };
    const width = svgRef.current.clientWidth;
    const height = isMobile ? 450 : 450;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'sankey');

    // Create the main group with margins
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Set up the Sankey generator
    const sankeyGenerator = sankey()
      .nodeWidth(isMobile ? 10 : 20)
      .nodePadding(isMobile ? 12 : 15)
      .extent([[0, 0], [innerWidth, innerHeight]]);

    // Generate the Sankey data
    const sankeyData = sankeyGenerator({
      nodes: data.nodes.map(node => {
        const isBudget = node.name === 'Budget';
        const nodeData: any = {
          ...node,
          name: node.name.split('\n')[0],
          fill: node.color,
        };
        
        // Set minimum height for budget node on desktop
        if (!isMobile && isBudget) {
          nodeData.height = Math.max(innerHeight * 0.5, nodeData.height || 0);
        }
        
        return nodeData;
      }),
      links: data.links
    });

    // Center the budget node vertically
    const budgetNode = sankeyData.nodes.find((n: any) => n.name === 'Budget');
    if (budgetNode) {
      const centerY = innerHeight / 2;
      const nodeHeight = budgetNode.y1 - budgetNode.y0;
      budgetNode.y0 = centerY - (nodeHeight / 2);
      budgetNode.y1 = centerY + (nodeHeight / 2);
      
      // Additional adjustments for desktop view
      if (!isMobile) {
        const minHeight = innerHeight * 0.5;
        if (budgetNode.y1 - budgetNode.y0 < minHeight) {
          budgetNode.y0 = centerY - (minHeight / 2);
          budgetNode.y1 = centerY + (minHeight / 2);
        }
      }
    }

    // Create gradients for links
    const defs = svg.append('defs');
    sankeyData.links.forEach((link: any, i) => {
      const gradient = defs.append('linearGradient')
        .attr('id', `gradient-${i}`)
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', link.source.x1)
        .attr('x2', link.target.x0);

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', link.source.fill);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', link.target.fill);
    });

    // Calculate vertical positions for links
    const sourceOffsets: { [key: string]: number } = {};
    const targetOffsets: { [key: string]: number } = {};

    sankeyData.nodes.forEach((node: any) => {
      sourceOffsets[node.index] = node.y0;
      targetOffsets[node.index] = node.y0;
    });

    // Sort links by target node index to maintain consistent ordering
    const sortedLinks = [...sankeyData.links].sort((a: any, b: any) => {
      if (a.target.index !== b.target.index) {
        return a.target.index - b.target.index;
      }
      return b.value - a.value; // For links to the same target, sort by value
    });

    // Custom link path generator that matches node heights
    const createLinkPath = (d: any) => {
      const sourceX = d.source.x1;
      const targetX = d.target.x0;
      
      // Calculate vertical positions based on accumulated offsets
      const sourceY = sourceOffsets[d.source.index];
      const targetY = targetOffsets[d.target.index];
      
      // Calculate heights based on the link's value
      const sourceHeight = (d.value / d.source.value) * (d.source.y1 - d.source.y0);
      const targetHeight = (d.value / d.target.value) * (d.target.y1 - d.target.y0);

      // Update offsets for next link
      sourceOffsets[d.source.index] += sourceHeight;
      targetOffsets[d.target.index] += targetHeight;

      // Control points for the curves
      const curvature = isMobile ? 0.2 : 0.5;
      const controlPoint1X = sourceX * (1 - curvature) + targetX * curvature;
      const controlPoint2X = sourceX * curvature + targetX * (1 - curvature);

      return `
        M${sourceX},${sourceY}
        C${controlPoint1X},${sourceY}
         ${controlPoint2X},${targetY}
         ${targetX},${targetY}
        L${targetX},${targetY + targetHeight}
        C${controlPoint2X},${targetY + targetHeight}
         ${controlPoint1X},${sourceY + sourceHeight}
         ${sourceX},${sourceY + sourceHeight}
        Z
      `;
    };

    // Draw the links
    const links = g.append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(sortedLinks)
      .join('path')
      .attr('class', 'link')
      .attr('d', createLinkPath)
      .attr('fill', (_, i) => `url(#gradient-${i})`)
      .attr('fill-opacity', isMobile ? 0.8 : 0.7)
      .attr('stroke', 'none');

    // Draw the nodes
    const nodeGroups = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(sankeyData.nodes)
      .join('g')
      .attr('class', 'node');

    // Add node rectangles
    nodeGroups.append('rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any) => d.fill)
      .attr('fill-opacity', 0.9)
      .attr('rx', 4)
      .attr('ry', 4);

    // Add node labels
    nodeGroups.append('text')
      .attr('x', (d: any) => {
        const isBudget = d.name === 'Budget';
        const isLeftSide = sankeyData.nodes.indexOf(d) < sankeyData.nodes.findIndex((n: any) => n.name === 'Budget');
        const labelOffset = isMobile ? 5 : 10; // Further reduced offset for mobile
        return isBudget ? d.x0 + (d.x1 - d.x0) / 2 :
               isLeftSide ? d.x0 - labelOffset : d.x1 + labelOffset;
      })
      .attr('y', (d: any) => d.y0 + (d.y1 - d.y0) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d: any) => {
        const isBudget = d.name === 'Budget';
        const isLeftSide = sankeyData.nodes.indexOf(d) < sankeyData.nodes.findIndex((n: any) => n.name === 'Budget');
        return isBudget ? 'middle' : isLeftSide ? 'end' : 'start';
      })
      .attr('transform', (d: any) => {
        // Tilt labels diagonally on mobile
        if (isMobile) {
          const isBudget = d.name === 'Budget';
          if (isBudget) return ''; // No rotation for budget node
          
          const isLeftSide = sankeyData.nodes.indexOf(d) < sankeyData.nodes.findIndex((n: any) => n.name === 'Budget');
          // Left side labels tilt up, right side labels tilt down
          const angle = isLeftSide ? 30 : -30; // Slightly less angled for better readability
          return `rotate(${angle}, ${isLeftSide ? d.x0 - 8 : d.x1 + 8}, ${d.y0 + (d.y1 - d.y0) / 2})`;
        }
        return '';
      })
      .attr('class', 'label')
      .style('font-size', isMobile ? '9px' : '12px')
      .style('fill', '#4b5563')
      .text((d: any) => {
        if (d.name === 'Budget') return '';
        // Show "< 1%" for percentages under 1%, otherwise show rounded integer
        const percentage = d.percentage < 1 ? '<1' : Math.round(d.percentage);
        let displayName = d.name;
        
        if (isMobile) {
          // Trim longer names on mobile
          if (displayName.length > 12) {
            displayName = displayName.substring(0, 10) + '..';
          }
          // Keep on same line but use very compact format
          return `${percentage}%${displayName}`;
        }
        
        return `${percentage}% ${displayName}`;
      });

    // Adjust text for mobile
    if (isMobile) {
      nodeGroups.selectAll('text')
        .style('font-size', '8px') // Revert to 8px for mobile
        .each(function(d: any) {
          // Add a shadow effect to improve readability now that labels are closer to nodes
          const textElem = d3.select(this);
          const original = textElem.text();
          
          if (original && original.length > 0) {
            textElem
              .attr('stroke', 'white')
              .attr('stroke-width', '0.8px')
              .attr('paint-order', 'stroke');
          }
        });
    }

  }, [data, incomes, expenses, isMobile]);

  return (
    <div className={cn("w-full mt-6", className)} style={{ height: isMobile ? 450 : 450 }}>
      {data.nodes.length > 0 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-[1200px]">
            <svg ref={svgRef} style={{ width: '100%', height: '100%', overflow: 'visible' }} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full bg-secondary/30 rounded-xl">
          <p className="text-muted-foreground text-center">
            Add income and expense items to visualize your cash flow
          </p>
        </div>
      )}
    </div>
  );
};

export default SankeyDiagram;
