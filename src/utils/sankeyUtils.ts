
import { CashflowItem } from '../types/cashflow';

export const COLORS = {
  income: '#3498db',   // Blue
  expense: '#2ecc71',  // Green
  surplus: '#9b59b6',  // Purple
  deficit: '#e74c3c',  // Red
};

export const formatCurrencyValue = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const processSankeyData = (incomes: CashflowItem[], expenses: CashflowItem[]) => {
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
};
