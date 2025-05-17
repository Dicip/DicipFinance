
"use client";

import { useState, useEffect, useMemo } from "react";
import { FinancialOverview } from "@/components/dashboard/OverviewCard";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { BudgetProgressCard } from "@/components/dashboard/BudgetProgressCard";
import { AiInsightsCard } from "@/components/dashboard/AiInsightsCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { 
  categories as mockCategoriesData, 
  transactions as mockTransactionsData, 
  budgetGoals as mockBudgetGoalsData, 
  iconMap 
} from "@/lib/data";
import type { Category, Transaction, BudgetGoal, SpendingByCategory } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useDataMode } from "@/hooks/useDataMode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, DatabaseBackup, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Claves de localStorage (consistentes con otras páginas)
const OFFLINE_TRANSACTIONS_KEY = 'userTransactions_offline';
const CUSTOM_CATEGORIES_KEY = 'customCategories';
const OFFLINE_BUDGET_GOALS_KEY = 'userBudgetGoals_offline';

export default function DashboardPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); 
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!dataModeInitialized) {
      // Si el modo de datos aún no se ha inicializado, no hacer nada.
      return; 
    }

    setIsLoading(true);
    console.log(`DashboardPage: Cargando datos en modo ${mode}.`);

    // Simular carga de red
    const timer = setTimeout(() => {
      let loadedCategories: Category[] = [];
      let loadedTransactions: Transaction[] = [];
      let loadedBudgetGoals: BudgetGoal[] = [];

      if (mode === 'online') {
        // En modo online, los datos deberían venir de una BD. Simular listas vacías.
        // Las categorías base podrían cargarse desde mock, pero transacciones y presupuestos deben estar vacíos.
        console.log("DashboardPage: MODO ONLINE. Listas vacías, simulando carga desde BD.");
        loadedCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        loadedTransactions = []; // Vacío, simula que no hay datos en BD o conexión fallida
        loadedBudgetGoals = [];  // Vacío
      } else { // mode === 'offline'
        console.log("DashboardPage: MODO OFFLINE. Intentando cargar datos desde localStorage.");
        // Cargar Categorías desde localStorage o mock
        try {
          const storedCategories = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
          if (storedCategories) {
            loadedCategories = JSON.parse(storedCategories).map((cat: Omit<Category, 'icon'>) => ({
              ...cat,
              icon: iconMap[cat.iconName] || Palette,
            }));
            console.log("DashboardPage: Categorías cargadas desde localStorage.");
          } else {
            loadedCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
            console.log("DashboardPage: No hay categorías en localStorage, usando datos de demostración.");
          }
        } catch (error) {
          console.error("Error al leer categorías desde localStorage, usando datos de demostración: ", error);
          loadedCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        }

        // Cargar Transacciones desde localStorage o mock
        try {
          const storedTransactions = localStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
          if (storedTransactions) {
            loadedTransactions = JSON.parse(storedTransactions).sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());
            console.log("DashboardPage: Transacciones cargadas desde localStorage.");
          } else {
            loadedTransactions = mockTransactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            console.log("DashboardPage: No hay transacciones en localStorage, usando datos de demostración.");
          }
        } catch (error) {
          console.error("Error al leer transacciones desde localStorage, usando datos de demostración: ", error);
          loadedTransactions = mockTransactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }

        // Cargar Objetivos de Presupuesto desde localStorage o mock
        try {
          const storedBudgetGoals = localStorage.getItem(OFFLINE_BUDGET_GOALS_KEY);
          if (storedBudgetGoals) {
            loadedBudgetGoals = JSON.parse(storedBudgetGoals);
            console.log("DashboardPage: Objetivos de presupuesto cargados desde localStorage.");
          } else {
            loadedBudgetGoals = mockBudgetGoalsData;
            console.log("DashboardPage: No hay objetivos de presupuesto en localStorage, usando datos de demostración.");
          }
        } catch (error) {
          console.error("Error al leer objetivos de presupuesto desde localStorage, usando datos de demostración: ", error);
          loadedBudgetGoals = mockBudgetGoalsData;
        }
      }
      
      setCategories(loadedCategories);
      setTransactions(loadedTransactions);
      setBudgetGoals(loadedBudgetGoals);
      setIsLoading(false);
      console.log("DashboardPage: Carga de datos finalizada.");
    }, 500); 
    return () => clearTimeout(timer);
  }, [mode, dataModeInitialized]); // Dependencias para recargar si el modo cambia

  // Calcula el total de ingresos
  const totalIncome = useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Calcula el total de gastos
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Prepara los datos para el gráfico de gastos por categoría
  const spendingByCategoryChartData: SpendingByCategory[] = useMemo(() => {
    return categories
      .filter(c => c.type === 'expense') // Solo graficar categorías de gasto
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
      .filter(item => item.value > 0); // Solo incluir categorías con algún gasto
  }, [transactions, categories]);

  // Muestra un esqueleto de carga si los datos o el modo aún no están listos
  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Panel de Control" />
        <main className="flex-1 p-6 space-y-6">
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {/* Mensaje durante la carga */}
              {mode === 'online' ? "Intentando conectar con la base de datos..." : "Cargando datos de demostración o locales en Modo Offline..."}
            </AlertDescription>
          </Alert>
          {/* Esqueleto para las tarjetas de resumen */}
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
            <Skeleton className="h-28 rounded-lg" />
          </div>
          {/* Esqueleto para los gráficos y tarjetas de progreso */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="h-96 rounded-lg lg:col-span-4" />
            <Skeleton className="h-96 rounded-lg lg:col-span-3" />
          </div>
           {/* Esqueleto para la tarjeta de IA */}
           <Skeleton className="h-96 rounded-lg" />
        </main>
      </>
    );
  }

  // Renderiza la página principal del panel
  return (
    <>
      <AppHeader title="Panel de Control" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {/* Alerta informativa para el modo Online */}
        {mode === 'online' && (
          <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle>Modo Online Activo</AlertTitle>
            <AlertDescription>
              {/* Mensaje específico si no hay datos y no está cargando */}
              {transactions.length === 0 && budgetGoals.length === 0 && categories.filter(c => c.type !== 'income' && c.type !== 'expense').length === mockCategoriesData.length && !isLoading
                ? "Intentando conectar con la base de datos. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                : "Los datos se obtendrían desde una base de datos. "}
              La funcionalidad completa de base de datos está pendiente de implementación. Las operaciones son simuladas y no persistirán.
            </AlertDescription>
          </Alert>
        )}
        {/* Alerta informativa para el modo Offline */}
        {mode === 'offline' && (
          <Alert className="mb-4 border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300">
            <Terminal className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertTitle>Modo Offline (Local/Demostración)</AlertTitle>
            <AlertDescription>
                Estás viendo datos guardados localmente o de demostración. Las modificaciones que realices (como agregar transacciones) se guardarán en tu navegador.
            </AlertDescription>
          </Alert>
        )}

        {/* Contenido a mostrar si no hay datos en modo online (después de la carga) */}
        {mode === 'online' && transactions.length === 0 && budgetGoals.length === 0 && categories.filter(c => c.type !== 'income' && c.type !== 'expense').length === mockCategoriesData.length && !isLoading && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No hay datos para mostrar</h3>
                <p className="text-muted-foreground">
                  En modo online, los datos se obtienen desde la base de datos. <br />
                  Asegúrate de tener conexión o verifica si ya has registrado información. (Funcionalidad de BD pendiente)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mostrar contenido principal si estamos en modo offline, o si estamos en online Y (hay transacciones O hay objetivos O se está cargando) 
            O si las categorías online cargadas son más que las de mock (indicando que el usuario agregó alguna, aunque sea simulado)
        */}
        {(mode === 'offline' || (mode === 'online' && (transactions.length > 0 || budgetGoals.length > 0 || (categories.length > mockCategoriesData.length) || isLoading))) && (
          <>
            {/* Componente de resumen financiero */}
            <FinancialOverview totalIncome={totalIncome} totalExpenses={totalExpenses} />
            {/* Grid para gráficos y progreso de presupuesto */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              <div className="lg:col-span-4">
                {/* Gráfico de gastos por categoría */}
                <SpendingChart data={spendingByCategoryChartData} />
              </div>
              <div className="lg:col-span-3">
                {/* Tarjeta de progreso del presupuesto */}
                <BudgetProgressCard
                  categories={categories}
                  budgetGoals={budgetGoals}
                  transactions={transactions}
                />
              </div>
            </div>
            {/* Tarjeta de información de IA */}
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
