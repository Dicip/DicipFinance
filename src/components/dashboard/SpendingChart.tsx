"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpendingByCategory } from '@/lib/types';

interface SpendingChartProps {
  data: SpendingByCategory[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Gasto por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No hay datos de gastos disponibles para este período.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Gasto por Categoría</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
              }}
              labelFormatter={(label) => <div className="text-sm font-medium">{label}</div>}
              formatter={(value: number, name: string) => [`$${value.toFixed(2)}`, name === 'value' ? 'Gastado' : name]}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} formatter={(value) => value === 'value' ? 'Gastado' : value} />
            <Bar dataKey="value" name="Gastado" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
