"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Category, BudgetGoal, Transaction } from "@/lib/types";
import { AlertTriangle } from "lucide-react";

interface BudgetProgressCardProps {
  categories: Category[];
  budgetGoals: BudgetGoal[];
  transactions: Transaction[];
}

interface BudgetItem {
  category: Category;
  goal: number;
  spent: number;
  progress: number;
  overBudget: boolean;
}

export function BudgetProgressCard({ categories, budgetGoals, transactions }: BudgetProgressCardProps) {
  const budgetItems: BudgetItem[] = budgetGoals.map(goal => {
    const category = categories.find(c => c.id === goal.categoryId);
    if (!category) return null;

    const spent = transactions
      .filter(t => t.type === 'expense' && t.categoryId === goal.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    const progress = goal.amount > 0 ? Math.min((spent / goal.amount) * 100, 100) : 0;
    const overBudget = spent > goal.amount;

    return { category, goal: goal.amount, spent, progress, overBudget };
  }).filter(item => item !== null) as BudgetItem[];

  if (budgetItems.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Progreso del Presupuesto</CardTitle>
          <CardDescription>Sigue tus gastos en comparación con tus objetivos de presupuesto.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Aún no se han establecido objetivos de presupuesto.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Progreso del Presupuesto</CardTitle>
        <CardDescription>Sigue tus gastos en comparación con tus objetivos de presupuesto.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetItems.map(item => (
          <div key={item.category.id}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                <item.category.icon className="mr-2 h-4 w-4" style={{ color: item.category.color }} />
                {item.category.name}
              </span>
              <div className="flex items-center space-x-2">
                {item.overBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                <span className={`text-sm ${item.overBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                  ${item.spent.toFixed(2)} / ${item.goal.toFixed(2)}
                </span>
              </div>
            </div>
            <Progress value={item.progress} className={item.overBudget ? '[&>div]:bg-destructive' : ''} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
