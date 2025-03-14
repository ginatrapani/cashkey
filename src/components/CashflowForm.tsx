
import React from 'react';
import { CashflowItem } from '../types/cashflow';
import { cn } from '@/lib/utils';
import IncomeSection from './cashflow/IncomeSection';
import ExpenseSection from './cashflow/ExpenseSection';
import CashflowSummary from './cashflow/CashflowSummary';

interface CashflowFormProps {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
  onUpdateIncomes: (incomes: CashflowItem[]) => void;
  onUpdateExpenses: (expenses: CashflowItem[]) => void;
  className?: string;
}

const CashflowForm: React.FC<CashflowFormProps> = ({
  incomes,
  expenses,
  onUpdateIncomes,
  onUpdateExpenses,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {/* Income Section */}
      <IncomeSection 
        incomes={incomes} 
        onUpdateIncomes={onUpdateIncomes} 
      />
      
      {/* Expense Section */}
      <ExpenseSection 
        expenses={expenses} 
        onUpdateExpenses={onUpdateExpenses} 
      />
      
      {/* Total Summary */}
      <CashflowSummary 
        incomes={incomes} 
        expenses={expenses} 
      />
    </div>
  );
};

export default CashflowForm;
