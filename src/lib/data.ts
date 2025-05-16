
import type { Category, Transaction, BudgetGoal } from '@/lib/types';
import { Utensils, Car, Film, ShoppingBag, Home, Zap, Landmark, HandCoins, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Helper para obtener dinámicamente el componente de icono
// Podríamos tener un mapeo más robusto si fuera necesario.
export const iconMap: { [key: string]: LucideIcon } = {
  Utensils,
  Car,
  Film,
  ShoppingBag,
  Home,
  Zap,
  Landmark,
  HandCoins,
  Palette, // Default/fallback icon
};


export const categories: Category[] = [
  { id: 'food', name: 'Alimentación', iconName: 'Utensils', icon: Utensils, color: '#FF6384', type: 'expense' },
  { id: 'transport', name: 'Transporte', iconName: 'Car', icon: Car, color: '#36A2EB', type: 'expense' },
  { id: 'entertainment', name: 'Entretenimiento', iconName: 'Film', icon: Film, color: '#FFCE56', type: 'expense' },
  { id: 'shopping', name: 'Compras', iconName: 'ShoppingBag', icon: ShoppingBag, color: '#4BC0C0', type: 'expense' },
  { id: 'housing', name: 'Vivienda', iconName: 'Home', icon: Home, color: '#9966FF', type: 'expense' },
  { id: 'utilities', name: 'Servicios', iconName: 'Zap', icon: Zap, color: '#FF9F40', type: 'expense' },
  { id: 'salary', name: 'Salario', iconName: 'Landmark', icon: Landmark, color: '#2ECC71', type: 'income' },
  { id: 'freelance', name: 'Freelance', iconName: 'HandCoins', icon: HandCoins, color: '#3498DB', type: 'income' },
];

// Montos actualizados a CLP (aproximado 1 USD = 930 CLP)
export const transactions: Transaction[] = [
  // Expenses
  { id: '1', date: new Date(2024, 6, 1).toISOString(), description: 'Supermercado', amount: 70215, type: 'expense', categoryId: 'food' },
  { id: '2', date: new Date(2024, 6, 2).toISOString(), description: 'Gasolina', amount: 37200, type: 'expense', categoryId: 'transport' },
  { id: '3', date: new Date(2024, 6, 3).toISOString(), description: 'Entradas de cine', amount: 27900, type: 'expense', categoryId: 'entertainment' },
  { id: '4', date: new Date(2024, 6, 5).toISOString(), description: 'Camiseta nueva', amount: 23250, type: 'expense', categoryId: 'shopping' },
  { id: '5', date: new Date(2024, 6, 10).toISOString(), description: 'Arriendo', amount: 1116000, type: 'expense', categoryId: 'housing' },
  { id: '6', date: new Date(2024, 6, 12).toISOString(), description: 'Cuenta de electricidad', amount: 60450, type: 'expense', categoryId: 'utilities' },
  { id: '7', date: new Date(2024, 6, 15).toISOString(), description: 'Almuerzo con amigos', amount: 41850, type: 'expense', categoryId: 'food' },
  { id: '8', date: new Date(2024, 6, 18).toISOString(), description: 'Pasaje de autobús', amount: 18600, type: 'expense', categoryId: 'transport' },
  { id: '9', date: new Date(2024, 6, 20).toISOString(), description: 'Entrada de concierto', amount: 74400, type: 'expense', categoryId: 'entertainment' },
  { id: '10', date: new Date(2024, 6, 22).toISOString(), description: 'Curso en línea', amount: 46500, type: 'expense', categoryId: 'shopping' },
  { id: '11', date: new Date(2024, 6, 25).toISOString(), description: 'Cena fuera', amount: 55800, type: 'expense', categoryId: 'food' },
  { id: '12', date: new Date(2024, 6, 28).toISOString(), description: 'Cuenta de internet', amount: 51150, type: 'expense', categoryId: 'utilities' },

  // Income
  { id: '101', date: new Date(2024, 6, 1).toISOString(), description: 'Salario mensual', amount: 2790000, type: 'income', categoryId: 'salary' },
  { id: '102', date: new Date(2024, 6, 15).toISOString(), description: 'Proyecto freelance A', amount: 465000, type: 'income', categoryId: 'freelance' },
];

export const budgetGoals: BudgetGoal[] = [
  { id: 'budget_food', categoryId: 'food', amount: 372000 },
  { id: 'budget_transport', categoryId: 'transport', amount: 139500 },
  { id: 'budget_entertainment', categoryId: 'entertainment', amount: 186000 },
  { id: 'budget_shopping', categoryId: 'shopping', amount: 139500 },
  { id: 'budget_utilities', categoryId: 'utilities', amount: 139500 },
];

