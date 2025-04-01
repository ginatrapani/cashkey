import React from 'react';
import { CashflowItem } from '../../types/cashflow';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/cashflowUtils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <Card className="md:col-span-2 shadow-soft animate-fade-in [animation-delay:200ms]">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className={cn(
              "font-medium text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>Income</p>
            <p className={cn(
              "font-semibold text-income",
              isMobile ? "text-lg" : "text-2xl"
            )}>{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className={cn(
              "font-medium text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>Expenses</p>
            <p className={cn(
              "font-semibold text-expense",
              isMobile ? "text-lg" : "text-2xl"
            )}>{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className={cn(
              "font-medium text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {balance >= 0 ? 'Surplus' : 'Deficit'}
            </p>
            <p className={cn(
              "font-semibold",
              balance >= 0 ? "text-surplus" : "text-deficit",
              isMobile ? "text-lg" : "text-2xl"
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
