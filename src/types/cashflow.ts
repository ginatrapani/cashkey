
export interface CashflowItem {
  id: string;
  name: string;
  amount: number;
  color?: string;
}

export interface SankeyNode {
  name: string;
  value?: number;
  itemId?: string;
  category: 'income' | 'expense' | 'balance';
}

export interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export interface CashflowState {
  incomes: CashflowItem[];
  expenses: CashflowItem[];
}
