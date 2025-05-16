import type { Category, Transaction, BudgetGoal } from '@/lib/types';
import { Utensils, Car, Film, ShoppingBag, Home, Zap, Landmark, HandCoins } from 'lucide-react';

export const categories: Category[] = [
  { id: 'food', name: 'Alimentación', icon: Utensils, color: 'hsl(var(--chart-1))' },
  { id: 'transport', name: 'Transporte', icon: Car, color: 'hsl(var(--chart-2))' },
  { id: 'entertainment', name: 'Entretenimiento', icon: Film, color: 'hsl(var(--chart-3))' },
  { id: 'shopping', name: 'Compras', icon: ShoppingBag, color: 'hsl(var(--chart-4))' },
  { id: 'housing', name: 'Vivienda', icon: Home, color: 'hsl(var(--chart-5))' },
  { id: 'utilities', name: 'Servicios', icon: Zap, color: 'hsl(var(--chart-1))' }, // Re-using chart colors
  { id: 'salary', name: 'Salario', icon: Landmark, color: 'hsl(var(--chart-2))' },
  { id: 'freelance', name: 'Freelance', icon: HandCoins, color: 'hsl(var(--chart-3))' },
];

export const transactions: Transaction[] = [
  // Expenses
  { id: '1', date: new Date(2024, 6, 1).toISOString(), description: 'Supermercado', amount: 75.50, type: 'expense', categoryId: 'food' },
  { id: '2', date: new Date(2024, 6, 2).toISOString(), description: 'Gasolina', amount: 40.00, type: 'expense', categoryId: 'transport' },
  { id: '3', date: new Date(2024, 6, 3).toISOString(), description: 'Entradas de cine', amount: 30.00, type: 'expense', categoryId: 'entertainment' },
  { id: '4', date: new Date(2024, 6, 5).toISOString(), description: 'Camiseta nueva', amount: 25.00, type: 'expense', categoryId: 'shopping' },
  { id: '5', date: new Date(2024, 6, 10).toISOString(), description: 'Alquiler', amount: 1200.00, type: 'expense', categoryId: 'housing' },
  { id: '6', date: new Date(2024, 6, 12).toISOString(), description: 'Factura de electricidad', amount: 65.00, type: 'expense', categoryId: 'utilities' },
  { id: '7', date: new Date(2024, 6, 15).toISOString(), description: 'Almuerzo con amigos', amount: 45.00, type: 'expense', categoryId: 'food' },
  { id: '8', date: new Date(2024, 6, 18).toISOString(), description: 'Pasaje de autobús', amount: 20.00, type: 'expense', categoryId: 'transport' },
  { id: '9', date: new Date(2024, 6, 20).toISOString(), description: 'Entrada de concierto', amount: 80.00, type: 'expense', categoryId: 'entertainment' },
  { id: '10', date: new Date(2024, 6, 22).toISOString(), description: 'Curso en línea', amount: 50.00, type: 'expense', categoryId: 'shopping' }, // Assuming 'shopping' for digital goods for simplicity
  { id: '11', date: new Date(2024, 6, 25).toISOString(), description: 'Cena fuera', amount: 60.00, type: 'expense', categoryId: 'food' },
  { id: '12', date: new Date(2024, 6, 28).toISOString(), description: 'Factura de internet', amount: 55.00, type: 'expense', categoryId: 'utilities' },

  // Income
  { id: '101', date: new Date(2024, 6, 1).toISOString(), description: 'Salario mensual', amount: 3000.00, type: 'income', categoryId: 'salary' },
  { id: '102', date: new Date(2024, 6, 15).toISOString(), description: 'Proyecto freelance A', amount: 500.00, type: 'income', categoryId: 'freelance' },
];

export const budgetGoals: BudgetGoal[] = [
  { categoryId: 'food', amount: 400 },
  { categoryId: 'transport', amount: 150 },
  { categoryId: 'entertainment', amount: 200 },
  { categoryId: 'shopping', amount: 150 },
  { categoryId: 'utilities', amount: 150 },
];
