
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
  income: '#757575', // Gray for income
  expense: '#757575', // Gray for expense
  budget: '#EEEEEE', // Light gray for budget
  surplus: '#8FBC8F', // Soft green for surplus
  deficit: '#CD5C5C', // Soft red for deficit
  link: {
    income: '#DDDDDD', // Light gray for income links
    expense: '#DDDDDD', // Light gray for expense links
    surplus: '#A8D5A8', // Light green for surplus
    deficit: '#E8A5A5', // Light red for deficit
  }
};

const SankeyDiagram: React.FC<SankeyDiagramProps> = ({ incomes, expenses, className }) => {
  const data = useMemo(() => {
    if (!incomes.length && !expenses.length) {
      return { nodes: [], links: [] };
    }

    const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const balanceLabel = balance >= 0 ? 'Savings' : 'Deficit';

    // Create nodes array
    const nodes = [
      // Budget node (center node)
      {
        name: `Budget\n${formatValue(totalIncome)}`,
        value: totalIncome,
        category: 'budget' as const,
        color: COLORS.budget,
      },
      
      // Income nodes
      ...incomes.map((income) => ({
        name: income.name,
        value: income.amount,
        itemId: income.id,
        category: 'income' as const,
        color: income.color || COLORS.income,
      })),
      
      // Expense nodes
      ...expenses.map((expense) => ({
        name: expense.name,
        value: expense.amount,
        itemId: expense.id,
        category: 'expense' as const,
        color: expense.color || COLORS.expense,
      })),
      
      // Balance node (if there is a balance)
      ...(balance !== 0 ? [{
        name: balanceLabel,
        value: Math.abs(balance),
        category: 'balance' as const,
        color: balance >= 0 ? COLORS.surplus : COLORS.deficit,
      }] : [])
    ];

    // Calculate indices for different node types
    const budgetIndex = 0;
    const incomeStartIndex = 1;
    const expenseStartIndex = incomes.length + 1;
    const balanceIndex = incomes.length + expenses.length + 1;

    // Create links array
    const links = [
      // Income to Budget links
      ...incomes.map((income, idx) => ({
        source: incomeStartIndex + idx,
        target: budgetIndex,
        value: income.amount,
        category: 'income' as const,
      })),
      
      // Budget to Expense links
      ...expenses.map((expense, idx) => ({
        source: budgetIndex,
        target: expenseStartIndex + idx,
        value: expense.amount,
        category: 'expense' as const,
      })),
    ];

    // Add balance link if there is a balance
    if (balance !== 0) {
      links.push({
        source: budgetIndex,
        target: balanceIndex,
        value: Math.abs(balance),
        category: balance >= 0 ? 'surplus' : 'deficit',
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
    const isBudget = node.category === 'budget';
    const isIncome = node.category === 'income';
    const isExpense = node.category === 'expense';
    const isBalance = node.category === 'balance';
    
    // Position text for nodes based on their type
    const textX = isIncome 
      ? x - 10
      : isExpense || isBalance 
        ? x + width + 10
        : x + width / 2;
    
    const textAnchor = isIncome 
      ? 'end' 
      : isExpense || isBalance 
        ? 'start'
        : 'middle';
    
    // For budget, split text into two lines
    const lines = isBudget && node.name.includes('\n') 
      ? node.name.split('\n')
      : [node.name];
    
    return (
      <g>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={nodeColor}
          fillOpacity={isBudget ? 0.8 : 0.95}
          className="animated-node sankey-node"
          rx={2}
          ry={2}
          stroke={isBudget ? '#CCCCCC' : 'none'}
          strokeWidth={isBudget ? 1 : 0}
        />
        
        {lines.map((line, i) => (
          <text
            key={i}
            x={textX}
            y={y + height / 2 + (lines.length > 1 ? (i - 0.5) * 20 : 0)}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            className={cn(
              "fill-foreground",
              isBudget ? "font-medium text-sm" : "text-sm",
              i === 0 && isBudget ? "font-bold" : ""
            )}
          >
            {line}
          </text>
        ))}
        
        {!isBudget && (
          <text
            x={isIncome ? x - 10 : x + width + 10}
            y={y + height / 2 + 20}
            textAnchor={isIncome ? 'end' : 'start'}
            dominantBaseline="middle"
            className="text-sm font-semibold fill-foreground"
          >
            {formatValue(node.value)}
          </text>
        )}
      </g>
    );
  };

  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index } = props;
    
    const linkCategory = data.links[index].category;
    let linkColor;
    
    switch (linkCategory) {
      case 'income':
        linkColor = COLORS.link.income;
        break;
      case 'expense':
        linkColor = COLORS.link.expense;
        break;
      case 'surplus':
        linkColor = COLORS.link.surplus;
        break;
      case 'deficit':
        linkColor = COLORS.link.deficit;
        break;
      default:
        linkColor = COLORS.link.income;
    }
    
    return (
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
          L${targetX},${targetY + linkWidth}
          C${targetControlX},${targetY + linkWidth} ${sourceControlX},${sourceY + linkWidth} ${sourceX},${sourceY + linkWidth}
          Z
        `}
        fill={linkColor}
        stroke="none"
        className="animated-link sankey-link"
      />
    );
  };

  return (
    <div className={cn("w-full h-[450px] mt-6", className)}>
      {data.nodes.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%" className="sankey-container">
          <Sankey
            data={data}
            node={CustomNode}
            link={CustomLink}
            nodePadding={40}
            nodeWidth={20}
            margin={{ top: 20, right: 160, bottom: 20, left: 160 }}
          >
            <Tooltip
              formatter={(value: number) => formatValue(value)}
              labelFormatter={(name: string) => name.split('\n')[0]}
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
