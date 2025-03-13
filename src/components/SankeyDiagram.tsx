
import React, { useMemo } from 'react';
import { Sankey, Tooltip, Rectangle, ResponsiveContainer } from 'recharts';
import { SankeyData, CashflowItem } from '../types/cashflow';
import { cn } from '@/lib/utils';

interface SankeyDiagramProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
  className?: string;
}

const COLORS = {
  income: '#3498db',   // Blue
  expense: '#2ecc71',  // Green
  surplus: '#9b59b6',  // Purple
  deficit: '#e74c3c',  // Red
};

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ incomes, expenses, className }) => {
  const data = useMemo(() => {
    if (!incomes.length && !expenses.length) {
      return { nodes: [], links: [] };
    }

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const balanceLabel = balance >= 0 ? 'Surplus' : 'Deficit';
    const balanceColor = balance >= 0 ? COLORS.surplus : COLORS.deficit;
    
    // Calculate node heights proportionally
    const getNodeHeight = (amount: number, total: number) => {
      return Math.max(30, (amount / total) * 200); // Min height of 30px
    };

    // Create nodes
    const nodes = [
      // Income nodes (left side)
      ...incomes.map((income) => {
        const percentage = ((income.amount / totalIncome) * 100).toFixed(1);
        return {
          name: income.name,
          displayName: `${income.name}\n${percentage}%`,
          value: income.amount,
          percentage: percentage,
          itemId: income.id,
          category: 'income' as const,
          color: COLORS.income,
        };
      }),
      
      // Middle "Budget" node
      {
        name: 'Budget',
        displayName: 'Budget',
        value: totalIncome,
        category: 'balance' as const,
        color: '#f1c40f', // Yellow
      },
      
      // Expense nodes (right side)
      ...expenses.map((expense) => {
        const percentage = ((expense.amount / totalExpense) * 100).toFixed(1);
        return {
          name: expense.name,
          displayName: `${expense.name}\n${percentage}%`,
          value: expense.amount,
          percentage: percentage,
          itemId: expense.id,
          category: 'expense' as const,
          color: COLORS.expense,
        };
      }),
      
      // Balance node (if needed)
      ...(balance !== 0 ? [{
        name: balanceLabel,
        displayName: `${balanceLabel}\n${((Math.abs(balance) / totalIncome) * 100).toFixed(1)}%`,
        value: Math.abs(balance),
        percentage: ((Math.abs(balance) / totalIncome) * 100).toFixed(1),
        category: 'balance' as const,
        color: balanceColor,
      }] : [])
    ];

    // Create links
    const links = [
      // Income to Budget links
      ...incomes.map((income, incomeIndex) => ({
        source: incomeIndex,
        target: incomes.length, // Index of Budget node
        value: income.amount,
      })),
      
      // Budget to Expense links
      ...expenses.map((expense, expenseIndex) => ({
        source: incomes.length, // Index of Budget node
        target: incomes.length + 1 + expenseIndex,
        value: expense.amount,
      })),
    ];
    
    // Add balance link if needed
    if (balance !== 0) {
      links.push({
        source: incomes.length, // Index of Budget node
        target: incomes.length + 1 + expenses.length, // Index of Balance node
        value: Math.abs(balance),
      });
    }

    return { nodes, links };
  }, [incomes, expenses]);

  const formatValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomNode = ({ x, y, width, height, index, payload }: any) => {
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

  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    
    const gradientId = `linkGradient${index}`;
    const sourceNode = data.nodes[data.links[index].source];
    const targetNode = data.nodes[data.links[index].target];
    
    return (
      <g>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={sourceNode.color || COLORS.income} />
            <stop offset="100%" stopColor={targetNode.color || COLORS.expense} />
          </linearGradient>
        </defs>
        <path
          d={`
            M${sourceX},${sourceY}
            C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
            L${targetX},${targetY + linkWidth}
            C${targetControlX},${targetY + linkWidth} ${sourceControlX},${sourceY + linkWidth} ${sourceX},${sourceY + linkWidth}
            Z
          `}
          fill={`url(#${gradientId})`}
          stroke="none"
          strokeWidth={0}
          fillOpacity={0.5}
          className="animated-link sankey-link"
        />
      </g>
    );
  };

  return (
    <div className={cn("w-full h-[400px] mt-6", className)}>
      {data.nodes.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" className="sankey-container">
          <Sankey
            data={data}
            node={CustomNode}
            link={CustomLink}
            nodePadding={40}
            nodeWidth={30}
            linkCurvature={0.5}
            iterations={64}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          >
            <Tooltip
              formatter={(value: number) => formatValue(value)}
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
