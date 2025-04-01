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

interface IncomeSectionProps {
  incomes: CashflowItem[];
  onUpdateIncomes: (incomes: CashflowItem[]) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({
  incomes,
  onUpdateIncomes,
}) => {
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomePeriod, setNewIncomePeriod] = useState('annual');
  const isMobile = useIsMobile();

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

  const handleRemoveIncome = (id: string) => {
    onUpdateIncomes(incomes.filter(income => income.id !== id));
  };

  return (
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
                className={cn(
                  "flex-1",
                  isMobile && "text-sm"
                )}
              />
              <div className="relative flex-shrink-0 w-[70px] md:w-[100px]">
                <DollarSign className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={newIncomeAmount}
                  onChange={(e) => setNewIncomeAmount(e.target.value)}
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
                value={newIncomePeriod}
                onValueChange={setNewIncomePeriod}
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
              onClick={handleAddIncome} 
              className="w-full bg-income hover:bg-income/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Income
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeSection;
