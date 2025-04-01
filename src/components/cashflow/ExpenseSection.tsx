import React, { useState } from 'react';
import { CashflowItem } from '@/types/cashflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, DollarSign, Pencil, Check, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/cashflowUtils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface ExpenseSectionProps {
  expenses: CashflowItem[];
  onUpdateExpenses: (expenses: CashflowItem[]) => void;
}

const ExpenseSection: React.FC<ExpenseSectionProps> = ({ expenses, onUpdateExpenses }) => {
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePeriod, setNewExpensePeriod] = useState('annual');
  const [editingExpense, setEditingExpense] = useState<CashflowItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const isMobile = useIsMobile();

  const handleAddExpense = () => {
    if (!newExpenseName || !newExpenseAmount) return;

    let amount = parseInt(newExpenseAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;
    
    // Convert monthly amount to annual if needed
    if (newExpensePeriod === 'monthly') {
      amount = amount * 12;
    }

    const newExpense: CashflowItem = {
      id: crypto.randomUUID(),
      name: newExpenseName,
      amount: amount,
    };

    onUpdateExpenses([...expenses, newExpense]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    onUpdateExpenses(expenses.filter(expense => expense.id !== id));
  };

  const handleStartEdit = (expense: CashflowItem) => {
    setEditingExpense(expense);
    setEditName(expense.name);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = () => {
    if (!editingExpense || !editName || !editAmount) return;

    const amount = parseInt(editAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    onUpdateExpenses(expenses.map(expense => 
      expense.id === editingExpense.id 
        ? { ...expense, name: editName, amount: amount }
        : expense
    ));
    setEditingExpense(null);
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  return (
    <Card className="shadow-soft animate-fade-in [animation-delay:100ms]">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-medium text-expense flex items-center">
          Annual Expenses
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-1">Tap an item to edit it.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Existing expenses */}
          <div className="space-y-2">
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className={cn(
                  "flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-slide-up cursor-pointer hover:bg-secondary/70 transition-colors",
                  editingExpense?.id === expense.id && "bg-secondary"
                )}
                onClick={() => !editingExpense && handleStartEdit(expense)}
              >
                {editingExpense?.id === expense.id ? (
                  <>
                    <div className="flex-1 mr-4">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Expense name"
                        className={cn(
                          "mb-2",
                          isMobile && "text-sm"
                        )}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="relative">
                        <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          type="number"
                          min="0"
                          step="100"
                          className={cn(
                            "pl-6 w-full no-spin",
                            isMobile && "text-sm"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveEdit();
                        }}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelEdit();
                        }}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 mr-4">
                      <p className="font-medium">{expense.name}</p>
                      <p className="text-muted-foreground">{formatCurrency(expense.amount)}/year</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExpense(expense.id);
                      }}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* New expense input */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              <Input
                value={newExpenseName}
                onChange={(e) => setNewExpenseName(e.target.value)}
                placeholder="Expense name"
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
