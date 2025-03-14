
import React, { useState } from 'react';
import { CashflowItem } from '../types/cashflow';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, X, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

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
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomePeriod, setNewIncomePeriod] = useState('annual');
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [newExpensePeriod, setNewExpensePeriod] = useState('annual');
  
  const handleAddIncome = () => {
    if (!newIncomeName || !newIncomeAmount) return;
    
    let amount = parseFloat(newIncomeAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    // Convert monthly amount to annual if needed
    if (newIncomePeriod === 'monthly') {
      amount = amount * 12;
    }
    
    const newIncome: CashflowItem = {
      id: uuidv4(),
      name: newIncomeName,
      amount: amount,
    };
    
    onUpdateIncomes([...incomes, newIncome]);
    setNewIncomeName('');
    setNewIncomeAmount('');
  };
  
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
  
  const handleRemoveIncome = (id: string) => {
    onUpdateIncomes(incomes.filter(income => income.id !== id));
  };
  
  const handleRemoveExpense = (id: string) => {
    onUpdateExpenses(expenses.filter(expense => expense.id !== id));
  };
  
  const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
  const totalExpense = expenses.reduce((total, expense) => total + expense.amount, 0);
  const balance = totalIncome - totalExpense;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      {/* Income Section */}
      <Card className="shadow-soft animate-fade-in">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-medium text-income flex items-center">
            <span className="inline-block w-3 h-3 rounded-full bg-income mr-2"></span>
            Annual Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomes.map((income) => (
              <div 
                key={income.id} 
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-slide-up"
              >
                <div className="flex-1 mr-4">
                  <p className="font-medium">{income.name}</p>
                  <p className="text-muted-foreground">{formatCurrency(income.amount)}/year</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleRemoveIncome(income.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <div className="pt-2 space-y-3">
              <div className="flex gap-3">
                <Input
                  placeholder="Income name"
                  value={newIncomeName}
                  onChange={(e) => setNewIncomeName(e.target.value)}
                  className="flex-1"
                />
                <div className="relative flex-shrink-0 w-[120px]">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Amount"
                    value={newIncomeAmount}
                    onChange={(e) => setNewIncomeAmount(e.target.value)}
                    type="number"
                    min="0"
                    step="100"
                    className="pl-8 w-full"
                  />
                </div>
                <Select
                  value={newIncomePeriod}
                  onValueChange={setNewIncomePeriod}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAddIncome} 
                className="w-full bg-income hover:bg-income/90"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Income
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Expense Section */}
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
                  className="flex-1"
                />
                <div className="relative flex-shrink-0 w-[120px]">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Amount"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    type="number"
                    min="0"
                    step="100"
                    className="pl-8 w-full"
                  />
                </div>
                <Select
                  value={newExpensePeriod}
                  onValueChange={setNewExpensePeriod}
                >
                  <SelectTrigger className="w-[110px]">
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
      
      {/* Total Summary */}
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
    </div>
  );
};

export default CashflowForm;
