
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { categories as mockCategories, transactions as mockTransactions, iconMap } from "@/lib/data";
import type { Category, Transaction } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { useDataMode } from "@/hooks/useDataMode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, PlusCircle, DatabaseBackup, Palette } from "lucide-react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";

export default function TransactionsPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  useEffect(() => {
    if (!dataModeInitialized) {
      return; 
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      let loadedCategories: Category[];
      if (mode === 'online') {
        console.log("TransactionsPage: MODO ONLINE. Limpiando transacciones locales. Usando categorías base.");
        setTransactions([]);
        // En modo online, por ahora, usamos las categorías mock como base,
        // ya que las personalizadas son locales. En una app real, se cargarían desde BD.
        loadedCategories = mockCategories.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette }));
      } else { // mode === 'offline'
        console.log("TransactionsPage: MODO OFFLINE. Cargando transacciones y categorías locales.");
        setTransactions(mockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        const storedCategories = localStorage.getItem('customCategories');
        if (storedCategories) {
          loadedCategories = JSON.parse(storedCategories).map((cat: Omit<Category, 'icon'>) => ({...cat, icon: iconMap[cat.iconName] || Palette }));
        } else {
          loadedCategories = mockCategories.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette }));
        }
      }
      setCategories(loadedCategories);
      setIsLoading(false);
    }, 100); // Short delay
    return () => clearTimeout(timer);
  }, [mode, dataModeInitialized]);

  const getCategoryInfo = (categoryId: string): { name: string; icon: Category['icon']; color: string } => {
    const category = categories.find(c => c.id === categoryId);
    return category 
      ? { name: category.name, icon: category.icon || Palette, color: category.color }
      : { name: "Desconocida", icon: Palette, color: "#808080" };
  };

  const handleAddTransaction = (data: { description: string; amount: number; type: 'income' | 'expense'; categoryId: string; date: Date }) => {
    const newTransaction: Transaction = {
      id: String(Date.now()), 
      description: data.description,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      date: data.date.toISOString(),
    };
    // En modo online, esto idealmente se enviaría a Firebase.
    // Por ahora, actualiza el estado local que se borrará en la próxima 'carga' online o cambio de modo.
    setTransactions(prevTransactions =>
      [newTransaction, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
    setIsAddTransactionOpen(false); 
  };

  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Transacciones" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Intentando cargar datos en Modo Online..." : "Cargando datos en Modo Offline..."}
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historial de Transacciones</CardTitle>
              <Skeleton className="h-10 w-48" /> {/* Skeleton for Add Button */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <>
      <AppHeader title="Transacciones" />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        {mode === 'online' && (
            <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
              <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
              <AlertTitle>Modo Online Activo</AlertTitle>
              <AlertDescription>
                {transactions.length === 0 && !isLoading
                  ? "Intentando conectar con la base de datos. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                  : "Los datos se gestionan a través de la conexión online. "}
                La funcionalidad completa de base de datos está pendiente de implementación. Las categorías personalizadas locales no se usan en este modo.
              </AlertDescription>
            </Alert>
          )}
        
        <div className="flex justify-end mb-4">
          <Button onClick={() => setIsAddTransactionOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Nueva Transacción
          </Button>
        </div>

        <AddTransactionDialog
          isOpen={isAddTransactionOpen}
          setIsOpen={setIsAddTransactionOpen}
          onAddTransaction={handleAddTransaction}
          categories={expenseCategories} 
          incomeCategories={incomeCategories}
        />

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
                    {transactions.map((transaction) => {
                      const categoryInfo = getCategoryInfo(transaction.categoryId);
                      const IconComponent = categoryInfo.icon;
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {format(new Date(transaction.date), "dd/MM/yyyy", { locale: es })}
                          </TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell className="flex items-center">
                            <IconComponent className="mr-2 h-4 w-4" style={{ color: categoryInfo.color }} />
                            {categoryInfo.name}
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
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                 {mode === 'online' && !isLoading && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay transacciones</h3>
                    <p className="text-muted-foreground">
                      En modo online, las transacciones se cargan desde la base de datos. <br />
                      Puedes agregar una nueva transacción o verificar tu conexión.
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && (
                   <p className="text-muted-foreground">No hay transacciones para mostrar en modo offline. ¡Agrega una nueva!</p>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
