
import type { LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon; // Para visualización inmediata
  iconName: string; // Nombre del icono de Lucide para almacenamiento y selección
  color: string;    // hex color string e.g. #FF5733
  type: 'income' | 'expense';
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

export type DataMode = 'online' | 'offline';
