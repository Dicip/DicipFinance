"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, FileText } from 'lucide-react';
import type { Transaction, Category, BudgetGoal } from '@/lib/types';
import { summarizeSpendingHabits } from '@/ai/flows/summarize-spending-habits';
import { generateBudgetTips } from '@/ai/flows/generate-budget-tips';
import { useToast } from '@/hooks/use-toast';

interface AiInsightsCardProps {
  transactions: Transaction[];
  categories: Category[];
  budgetGoals: BudgetGoal[];
}

export function AiInsightsCard({ transactions, categories, budgetGoals }: AiInsightsCardProps) {
  const [spendingSummary, setSpendingSummary] = useState<string | null>(null);
  const [budgetTips, setBudgetTips] = useState<string | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isTipsLoading, setIsTipsLoading] = useState(false);
  const { toast } = useToast();

  const fetchSpendingSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const spendingDataForAI: Record<string, number> = categories.reduce((acc, category) => {
        const categoryExpenses = transactions
          .filter(t => t.type === 'expense' && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);
        if (categoryExpenses > 0) {
          acc[category.name] = categoryExpenses;
        }
        return acc;
      }, {} as Record<string, number>);

      if (Object.keys(spendingDataForAI).length === 0) {
        setSpendingSummary("No hay suficientes datos de gastos para generar un resumen.");
        return;
      }
      
      const result = await summarizeSpendingHabits({ spendingData: spendingDataForAI });
      setSpendingSummary(result.summary);
    } catch (error) {
      console.error("Error al obtener el resumen de gastos:", error);
      setSpendingSummary("No se pudo generar el resumen de gastos en este momento.");
      toast({
        title: "Error",
        description: "No se pudo generar el resumen de gastos.",
        variant: "destructive",
      });
    } finally {
      setIsSummaryLoading(false);
    }
  };

  const fetchBudgetTips = async () => {
    setIsTipsLoading(true);
    try {
      const spendingDataString = JSON.stringify(
        transactions.map(t => ({
          category: categories.find(c => c.id === t.categoryId)?.name || 'Desconocida',
          amount: t.amount,
          type: t.type,
          date: t.date,
        }))
      );
      const budgetGoalsString = JSON.stringify(
        budgetGoals.map(bg => ({
          category: categories.find(c => c.id === bg.categoryId)?.name || 'Desconocida',
          goal: bg.amount,
        }))
      );

      if (transactions.length === 0 || budgetGoals.length === 0) {
        setBudgetTips("No hay suficientes datos para generar consejos de presupuesto. Agrega transacciones y establece objetivos de presupuesto.");
        return;
      }

      const result = await generateBudgetTips({
        spendingData: spendingDataString,
        budgetGoals: budgetGoalsString,
      });
      setBudgetTips(result.tips);
    } catch (error) {
      console.error("Error al obtener consejos de presupuesto:", error);
      setBudgetTips("No se pudieron generar los consejos de presupuesto en este momento.");
       toast({
        title: "Error",
        description: "No se pudieron generar los consejos de presupuesto.",
        variant: "destructive",
      });
    } finally {
      setIsTipsLoading(false);
    }
  };

  useEffect(() => {
    // Automatically fetch on mount, could be triggered by button instead
    fetchSpendingSummary();
    fetchBudgetTips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependencies can be added if re-fetching on data change is desired

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Asistente Financiero IA</CardTitle>
        <CardDescription>Información inteligente para ayudarte a administrar tus finanzas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-2 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-primary" />
            Resumen de Gastos
          </h3>
          {isSummaryLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-line">{spendingSummary || "Haz clic en 'Actualizar' para generar el resumen."}</p>
          )}
          <Button variant="outline" size="sm" onClick={fetchSpendingSummary} disabled={isSummaryLoading} className="mt-2">
            {isSummaryLoading ? "Cargando..." : "Actualizar Resumen"}
          </Button>
        </div>
        <div className="border-t pt-6">
          <h3 className="text-md font-semibold mb-2 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-accent" />
            Consejos de Presupuesto
          </h3>
          {isTipsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground whitespace-pre-line">{budgetTips || "Haz clic en 'Actualizar' para generar consejos."}</p>
          )}
          <Button variant="outline" size="sm" onClick={fetchBudgetTips} disabled={isTipsLoading} className="mt-2">
            {isTipsLoading ? "Cargando..." : "Actualizar Consejos"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
