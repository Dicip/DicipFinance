"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { categories as mockCategories, transactions as mockTransactions } from "@/lib/data";
import type { Category, Transaction } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTransactions(mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      setCategories(mockCategories);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Desconocida";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? <category.icon className="h-4 w-4 mr-2" style={{ color: category.color }} /> : null;
  }

  if (isLoading) {
    return (
      <>
        <AppHeader title="Transacciones" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Transacciones" />
      <main className="flex-1 p-4 md:p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Una lista de tus transacciones recientes.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-right">Monto (CLP)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.date), "dd/MM/yyyy", { locale: es })}
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell className="flex items-center">
                          {getCategoryIcon(transaction.categoryId)}
                          {getCategoryName(transaction.categoryId)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 text-xs font-semibold rounded-full",
                              transaction.type === "income"
                                ? "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100"
                                : "bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100"
                            )}
                          >
                            {transaction.type === "income" ? "Ingreso" : "Gasto"}
                          </span>
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-semibold",
                            transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          )}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          ${transaction.amount.toLocaleString("es-CL")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">No hay transacciones para mostrar.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
