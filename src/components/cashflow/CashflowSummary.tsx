
import React from 'react';
import { CashflowItem } from '../../types/cashflow';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/cashflowUtils';

interface CashflowSummaryProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
}

const CashflowSummary: React.FC<CashflowSummaryProps> = ({
  incomes,
  expenses,
}) => {
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <Card className="md:col-span-2 shadow-soft animate-fade-in [animation-delay:200ms]">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Annual Income</p>
            <p className="text-2xl font-semibold text-income">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Annual Expenses</p>
            <p className="text-2xl font-semibold text-expense">{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {balance >= 0 ? 'Annual Surplus' : 'Annual Deficit'}
            </p>
            <p className={cn(
              "text-2xl font-semibold",
              balance >= 0 ? "text-surplus" : "text-deficit"
            )}>
              {formatCurrency(Math.abs(balance))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashflowSummary;
