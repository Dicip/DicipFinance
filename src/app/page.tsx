"use client";

import { useState, useEffect, useMemo } from "react";
import { FinancialOverview } from "@/components/dashboard/OverviewCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { BudgetProgressCard } from "@/components/dashboard/BudgetProgressCard";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { categories as mockCategories, transactions as mockTransactions, budgetGoals as mockBudgetGoals } from "@/lib/data";
import type { Category, Transaction, BudgetGoal, SpendingByCategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataMode } from "@/hooks/useDataMode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function DashboardPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dataModeInitialized) {
      return; // Esperar a que se inicialice el modo de datos
    }

    setIsLoading(true);
    // Simular carga de datos
    const timer = setTimeout(() => {
      if (mode === 'online') {
        // TODO: Implementar carga de datos desde Firebase para el modo online
        // Por ahora, usamos los datos mock para simular.
        console.log("Dashboard: Cargando datos en MODO ONLINE (simulado con mocks)");
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        setBudgetGoals(mockBudgetGoals);
      } else { // mode === 'offline'
        console.log("Dashboard: Cargando datos en MODO OFFLINE");
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        setBudgetGoals(mockBudgetGoals);
      }
      setIsLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, [mode, dataModeInitialized]);

  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const spendingByCategoryChartData: SpendingByCategory[] = useMemo(() => {
    return categories
      .map(category => {
        const categoryExpenses = transactions
          .filter(t => t.type === 'expense' && t.categoryId === category.id)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          name: category.name,
          value: categoryExpenses,
          fill: category.color,
        };
      })
      .filter(item => item.value > 0);
  }, [transactions, categories]);

  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Panel de Control" />
        <main className="flex-1 p-6 space-y-6">
          {mode === 'online' && dataModeInitialized && (
             <Alert className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Modo Online (Simulado)</AlertTitle>
                <AlertDescription>
                  Actualmente se están utilizando datos de ejemplo. La conexión real a la base de datos está pendiente.
                </AlertDescription>
              </Alert>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="h-96 rounded-lg lg:col-span-4" />
            <Skeleton className="h-96 rounded-lg lg:col-span-3" />
          </div>
           <Skeleton className="h-96 rounded-lg" />
        </main>
      </>
    );
  }


  return (
    <>
      <AppHeader title="Panel de Control" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {mode === 'online' && (
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo Online (Simulado)</AlertTitle>
            <AlertDescription>
                Actualmente se están utilizando datos de ejemplo. La conexión real a la base de datos está pendiente. Puedes cambiar al modo offline en Configuración.
            </AlertDescription>
          </Alert>
        )}
        <FinancialOverview totalIncome={totalIncome} totalExpenses={totalExpenses} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <SpendingChart data={spendingByCategoryChartData} />
          </div>
          <div className="lg:col-span-3">
            <BudgetProgressCard
              categories={categories}
              budgetGoals={budgetGoals}
              transactions={transactions}
            />
          </div>
        </div>
        
        <AiInsightsCard
            transactions={transactions}
            categories={categories}
            budgetGoals={budgetGoals}
        />
      </main>
    </>
  );
}
