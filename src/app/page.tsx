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

export default function DashboardPage() {
  // For a real app, this data would come from a state management solution or API
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setCategories(mockCategories);
      setBudgetGoals(mockBudgetGoals);
      setIsLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, []);

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
          fill: category.color, // Use category color for the chart
        };
      })
      .filter(item => item.value > 0); // Only include categories with spending
  }, [transactions, categories]);

  if (isLoading) {
    return (
      <>
        <AppHeader title="Panel de Control" />
        <main className="flex-1 p-6 space-y-6">
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
