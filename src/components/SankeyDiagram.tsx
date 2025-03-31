import React, { useMemo } from 'react';
import { Sankey, ResponsiveContainer } from 'recharts';
import { CashflowItem } from '../types/cashflow';
import { cn } from '@/lib/utils';
import { processSankeyData } from '../utils/sankeyUtils';
import SankeyNode from './sankey/SankeyNode';
import SankeyLink from './sankey/SankeyLink';
import { useIsMobile } from '@/hooks/use-mobile';

interface SankeyDiagramProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
  className?: string;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ incomes, expenses, className }) => {
  const isMobile = useIsMobile();
  
  const data = useMemo(() => {
    return processSankeyData(incomes, expenses);
  }, [incomes, expenses]);

  // Responsive settings based on screen size
  const nodePadding = isMobile ? 10 : 20;  // Reduced padding to improve alignment
  const nodeWidth = isMobile ? 15 : 20;
  const margin = isMobile 
    ? { top: 20, right: 40, bottom: 20, left: 40 } 
    : { top: 30, right: 180, bottom: 30, left: 180 };
  const height = isMobile ? 350 : 450;

  return (
    <div className={cn("w-full mt-6", className)} style={{ height }}>
      <style>
        {`
          .recharts-wrapper {
            position: relative;
          }
          .recharts-surface {
            overflow: visible;
          }
          .recharts-layer {
            position: relative;
          }
          .recharts-sankey {
            position: relative;
          }
          .recharts-sankey-layer {
            position: relative;
          }
          .recharts-sankey-links,
          .recharts-sankey-nodes {
            position: relative;
          }
          .recharts-sankey-node,
          .recharts-sankey-link {
            position: relative;
          }
        `}
      </style>
      {data.nodes.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
            link={(linkProps) => <SankeyLink {...linkProps} data={data} />}
            node={(nodeProps) => <SankeyNode {...nodeProps} data={data} isMobile={isMobile} />}
            nodePadding={nodePadding}
            nodeWidth={nodeWidth}
            linkCurvature={isMobile ? 0.3 : 0.5}
            iterations={256}  // Increased iterations for better layout
            margin={margin}
          />
        </ResponsiveContainer>
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
