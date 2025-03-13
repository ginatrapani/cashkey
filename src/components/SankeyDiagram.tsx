
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
  income: 'rgb(52, 199, 89)',
  expense: 'rgb(255, 59, 48)',
  surplus: 'rgb(0, 122, 255)',
  deficit: 'rgb(255, 149, 0)',
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

    // Create nodes
    const nodes = [
      // Income nodes
      ...incomes.map((income, index) => ({
        name: income.name,
        value: income.amount,
        itemId: income.id,
        category: 'income' as const,
        color: COLORS.income,
      })),
      
      // Expense nodes
      ...expenses.map((expense, index) => ({
        name: expense.name,
        value: expense.amount,
        itemId: expense.id,
        category: 'expense' as const,
        color: COLORS.expense,
      })),
      
      // Balance node
      {
        name: balanceLabel,
        value: Math.abs(balance),
        category: 'balance' as const,
        color: balanceColor,
      }
    ];

    // Calculate source/target indices
    const totalNode = incomes.length;
    const expenseStartIndex = incomes.length;
    const balanceIndex = incomes.length + expenses.length;

    // Create links
    const links = [
      // Income to expense links
      ...incomes.flatMap((income, incomeIndex) => 
        expenses.map((expense, expenseIndex) => {
          // Distribute income proportionally to expenses
          const incomeProportion = income.amount / totalIncome;
          const value = Math.min(
            income.amount, 
            expense.amount * incomeProportion
          );
          
          return {
            source: incomeIndex,
            target: expenseStartIndex + expenseIndex,
            value: value,
          };
        })
      ),
    ];

    // Add balance link (from each income source to balance)
    if (balance !== 0) {
      incomes.forEach((income, index) => {
        const remainingIncome = income.amount - 
          links.filter(link => link.source === index)
            .reduce((sum, link) => sum + link.value, 0);
        
        if (remainingIncome > 0) {
          links.push({
            source: index,
            target: balanceIndex,
            value: remainingIncome,
          });
        }
      });
      
      // If expenses exceed income, add links from expenses to deficit
      if (balance < 0) {
        const expensesNotCovered = Math.abs(balance);
        expenses.forEach((expense, index) => {
          const expenseIndex = expenseStartIndex + index;
          const incomeToExpense = links.filter(link => link.target === expenseIndex)
            .reduce((sum, link) => sum + link.value, 0);
          
          const notCovered = expense.amount - incomeToExpense;
          if (notCovered > 0) {
            links.push({
              source: expenseIndex,
              target: balanceIndex,
              value: notCovered,
            });
          }
        });
      }
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
          x={node.category === 'income' ? x - 5 : x + width + 5}
          y={y + height / 2}
          textAnchor={node.category === 'income' ? 'end' : 'start'}
          dominantBaseline="middle"
          className="text-xs font-medium fill-foreground"
        >
          {node.name}
        </text>
      </g>
    );
  };

  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    const isBalance = data.links[index].target === data.nodes.length - 1;
    
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
            nodePadding={20}
            margin={{ top: 10, right: 140, bottom: 10, left: 140 }}
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
