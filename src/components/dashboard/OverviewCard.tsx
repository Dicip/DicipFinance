"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";

interface OverviewCardProps {
  title: string;
  amount: number;
  icon: React.ElementType;
  isCurrency?: boolean;
}

function StatCard({ title, amount, icon: Icon, isCurrency = true }: OverviewCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isCurrency ? `CLP $${amount.toLocaleString('es-CL')}` : amount}
        </div>
      </CardContent>
    </Card>
  );
}


interface FinancialOverviewProps {
  totalIncome: number;
  totalExpenses: number;
}

export function FinancialOverview({ totalIncome, totalExpenses }: FinancialOverviewProps) {
  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard title="Ingresos Totales" amount={totalIncome} icon={TrendingUp} />
      <StatCard title="Gastos Totales" amount={totalExpenses} icon={TrendingDown} />
      <StatCard title="Saldo" amount={balance} icon={Scale} />
    </div>
  );
}
