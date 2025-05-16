
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
import { Terminal, DatabaseBackup } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(mockCategories); // Categories are somewhat static
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dataModeInitialized) {
      return; 
    }

    setIsLoading(true);
    // Simulate data loading/clearing
    const timer = setTimeout(() => {
      if (mode === 'online') {
        console.log("Dashboard: MODO ONLINE. Limpiando datos locales para simular carga desde BD.");
        setTransactions([]);
        setBudgetGoals([]);
        // Categories can remain as they are more structural or could also be fetched
        setCategories(mockCategories); 
        // In a real app, you would initiate Firebase fetch here.
      } else { // mode === 'offline'
        console.log("Dashboard: MODO OFFLINE. Cargando datos locales.");
        setTransactions(mockTransactions);
        setCategories(mockCategories);
        setBudgetGoals(mockBudgetGoals);
      }
      setIsLoading(false);
    }, 100); // Short delay to mimic async operation and allow UI to update
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
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Intentando cargar datos en Modo Online..." : "Cargando datos en Modo Offline..."}
            </AlertDescription>
          </Alert>
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
          <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle>Modo Online Activo</AlertTitle>
            <AlertDescription>
              {transactions.length === 0 && !isLoading
                ? "Intentando conectar con la base de datos. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                : "Los datos se gestionan a través de la conexión online. "}
              La funcionalidad completa de base de datos está pendiente de implementación.
            </AlertDescription>
          </Alert>
        )}

        {mode === 'online' && transactions.length === 0 && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No hay datos para mostrar</h3>
                <p className="text-muted-foreground">
                  En modo online, los datos se obtienen de la base de datos. <br />
                  Asegúrate de tener conexión o verifica si ya has registrado transacciones.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {(mode === 'offline' || (mode === 'online' && transactions.length > 0)) && (
          <>
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
          </>
        )}
      </main>
    </>
  );
}
