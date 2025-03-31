import { CashflowItem } from '../types/cashflow';

// Softer, more neutral color palette with accent colors
export const COLORS = {
  income: '#8E9EF0',   // Soft blue
  expense: '#9ADCB9',  // Soft green
  surplus: '#9b87f5',  // Soft purple
  deficit: '#F7A097',  // Soft red-orange
  budget: '#F1C40F',   // Gold for budget node
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

  // Sort expenses by amount in descending order to maintain consistent ordering
  const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
  
  // Sort incomes by amount in descending order
  const sortedIncomes = [...incomes].sort((a, b) => b.amount - a.amount);

  // Create nodes
  const nodes = [
    // Income nodes (left side)
    ...sortedIncomes.map((income) => {
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
      color: COLORS.budget,
    },
    
    // Expense nodes (right side) - including balance node if needed
    ...(balance !== 0 ? [{
      name: balanceLabel,
      displayName: `${balanceLabel}\n${((Math.abs(balance) / totalIncome) * 100).toFixed(1)}%`,
      value: Math.abs(balance),
      percentage: ((Math.abs(balance) / totalIncome) * 100).toFixed(1),
      category: 'balance' as const,
      color: balanceColor,
    }] : []),
    
    // Regular expense nodes after balance node
    ...sortedExpenses.map((expense) => {
      const percentage = ((expense.amount / totalIncome) * 100).toFixed(1);
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
  ];

  // Create links with consistent ordering
  const links = [
    // Income to Budget links
    ...sortedIncomes.map((income, index) => ({
      source: index,
      target: sortedIncomes.length, // Index of Budget node
      value: income.amount,
    })),
  ];

  // Add balance link first if it exists
  if (balance !== 0) {
    links.push({
      source: sortedIncomes.length, // Index of Budget node
      target: sortedIncomes.length + 1, // Index of Balance node
      value: Math.abs(balance),
    });
  }

  // Add expense links after balance
  sortedExpenses.forEach((expense, index) => {
    links.push({
      source: sortedIncomes.length, // Index of Budget node
      target: sortedIncomes.length + (balance !== 0 ? 1 : 0) + index + 1,
      value: expense.amount,
    });
  });

  return { nodes, links };
};
