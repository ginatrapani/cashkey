import React, { useState } from 'react';
import { CashflowItem } from '@/types/cashflow';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, DollarSign, Check, X } from 'lucide-react';
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

interface IncomeSectionProps {
  incomes: CashflowItem[];
  onUpdateIncomes: (incomes: CashflowItem[]) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ incomes, onUpdateIncomes }) => {
  const [newIncomeName, setNewIncomeName] = useState('');
  const [newIncomeAmount, setNewIncomeAmount] = useState('');
  const [newIncomePeriod, setNewIncomePeriod] = useState('annual');
  const [editingIncome, setEditingIncome] = useState<CashflowItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const isMobile = useIsMobile();

  const handleAddIncome = () => {
    if (!newIncomeName || !newIncomeAmount) return;

    let amount = parseInt(newIncomeAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;
    
    // Convert monthly amount to annual if needed
    if (newIncomePeriod === 'monthly') {
      amount = amount * 12;
    }

    const newIncome: CashflowItem = {
      id: crypto.randomUUID(),
      name: newIncomeName,
      amount: amount,
    };

    onUpdateIncomes([...incomes, newIncome]);
    setNewIncomeName('');
    setNewIncomeAmount('');
  };

  const handleDeleteIncome = (id: string) => {
    onUpdateIncomes(incomes.filter(income => income.id !== id));
  };

  const handleStartEdit = (income: CashflowItem) => {
    setEditingIncome(income);
    setEditName(income.name);
    setEditAmount(income.amount.toString());
  };

  const handleSaveEdit = () => {
    if (!editingIncome || !editName || !editAmount) return;

    const amount = parseInt(editAmount.replace(/[^0-9]/g, ''));
    if (isNaN(amount) || amount <= 0) return;

    onUpdateIncomes(incomes.map(income => 
      income.id === editingIncome.id 
        ? { ...income, name: editName, amount: amount }
        : income
    ));
    setEditingIncome(null);
  };

  const handleCancelEdit = () => {
    setEditingIncome(null);
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
          {/* Existing incomes */}
          <div className="space-y-2">
            {incomes.map((income) => (
              <div 
                key={income.id} 
                className={cn(
                  "flex items-center justify-between p-3 bg-secondary/50 rounded-lg animate-slide-up cursor-pointer hover:bg-secondary/70 transition-colors",
                  editingIncome?.id === income.id && "bg-secondary"
                )}
                onClick={() => !editingIncome && handleStartEdit(income)}
              >
                {editingIncome?.id === income.id ? (
                  <>
                    <div className="flex-1 mr-4">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Income name"
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
                      <p className="font-medium">{income.name}</p>
                      <p className="text-muted-foreground">{formatCurrency(income.amount)}/year</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteIncome(income.id);
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

          {/* New income input */}
          <div className="pt-2 space-y-3">
            <div className="flex gap-3">
              <Input
                value={newIncomeName}
                onChange={(e) => setNewIncomeName(e.target.value)}
                placeholder="Income name"
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
