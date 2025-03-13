
import React, { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { CashflowItem } from '../types/cashflow';
import { cn } from '@/lib/utils';
import { processSankeyData, formatCurrencyValue } from '../utils/sankeyUtils';
import SankeyNode from './sankey/SankeyNode';
import SankeyLink from './sankey/SankeyLink';

interface SankeyDiagramProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
  className?: string;
}

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ incomes, expenses, className }) => {
  const data = useMemo(() => {
    return processSankeyData(incomes, expenses);
  }, [incomes, expenses]);

  return (
    <div className={cn("w-full h-[400px] mt-6", className)}>
      {data.nodes.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" className="sankey-container">
          <Sankey
            data={data}
            node={(nodeProps) => <SankeyNode {...nodeProps} data={data} />}
            link={(linkProps) => <SankeyLink {...linkProps} data={data} />}
            nodePadding={40}
            nodeWidth={30}
            linkCurvature={0.5}
            iterations={64}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          >
            <Tooltip
              formatter={(value: number) => formatCurrencyValue(value)}
              labelFormatter={(name: string) => name}
              wrapperStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '8px 12px',
              }}
            />
          </Sankey>
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
