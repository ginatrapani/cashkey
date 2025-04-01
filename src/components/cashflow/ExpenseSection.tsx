import React, { useState } from 'react';
import { CashflowItem } from '../../types/cashflow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, DollarSign } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/cashflowUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ExpenseSectionProps {
  expenses: CashflowItem[];
  onUpdateExpenses: (expenses: CashflowItem[]) => void;
}

const ExpenseSection: React.FC<ExpenseSectionProps> = ({
  expenses,
  onUpdateExpenses,
}) => {
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePeriod, setNewExpensePeriod] = useState('annual');
  const isMobile = useIsMobile();

  const handleAddExpense = () => {
    if (!newExpenseName || !newExpenseAmount) return;
    
    let amount = parseFloat(newExpenseAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    // Convert monthly amount to annual if needed
    if (newExpensePeriod === 'monthly') {
      amount = amount * 12;
    }
    
    const newExpense: CashflowItem = {
      id: uuidv4(),
      name: newExpenseName,
      amount: amount,
    };
    
    onUpdateExpenses([...expenses, newExpense]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const handleRemoveExpense = (id: string) => {
    onUpdateExpenses(expenses.filter(expense => expense.id !== id));
  };

  return (
    <Card className="shadow-soft animate-fade-in [animation-delay:100ms]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium text-expense flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-expense mr-2"></span>
          Annual Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-slide-up"
            >
              <div className="flex-1 mr-4">
                <p className="font-medium">{expense.name}</p>
                <p className="text-muted-foreground">{formatCurrency(expense.amount)}/year</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveExpense(expense.id)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              <Input
                placeholder="Expense name"
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
                className={cn(
                  "flex-1",
                  isMobile && "text-sm"
                )}
              />
              <div className="relative flex-shrink-0 w-[70px] md:w-[100px]">
                <DollarSign className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="100"
                  className={cn(
                    "pl-6 md:pl-8 w-full no-spin md:no-spin-none",
                    isMobile && "text-sm"
                  )}
                />
              </div>
              <Select
                value={newExpensePeriod}
                onValueChange={setNewExpensePeriod}
              >
                <SelectTrigger className={cn(
                  "w-[90px]",
                  isMobile && "text-sm"
                )}>
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddExpense} 
              className="w-full bg-expense hover:bg-expense/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Expense
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseSection;
