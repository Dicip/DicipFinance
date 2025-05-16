import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string; // hex color string for charts e.g. #FF5733
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: 'income' | 'expense';
  categoryId: string;
}

export interface BudgetGoal {
  categoryId: string;
  amount: number;
}

export interface SpendingByCategory {
  name: string;
  value: number;
  fill: string;
}
