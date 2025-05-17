
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
import { categories as mockCategoriesData, transactions as mockTransactionsData, iconMap } from "@/lib/data";
import type { Category, Transaction } from "@/lib/types";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import { useDataMode } from "@/hooks/useDataMode";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, PlusCircle, DatabaseBackup, Palette } from "lucide-react";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

// Clave para guardar/leer transacciones del localStorage en modo offline
const OFFLINE_TRANSACTIONS_KEY = 'userTransactions_offline';

export default function TransactionsPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Categorías base para el diálogo
  const [isLoading, setIsLoading] = useState(true);
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const { toast } = useToast();

  // Efecto para cargar datos iniciales (transacciones y categorías base)
  useEffect(() => {
    if (!dataModeInitialized) {
      return; 
    }
    setIsLoading(true);
    console.log(`TransactionsPage: Cargando datos en modo ${mode}.`);

    // Cargar categorías base (usadas en el diálogo de agregar transacción)
    const loadedBaseCategories = mockCategoriesData.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette }));
    setCategories(loadedBaseCategories);

    // Simular carga de red
    const timer = setTimeout(() => {
      if (mode === 'online') {
        // En modo online, las transacciones deberían venir de una BD. Simular lista vacía.
        console.log("TransactionsPage: MODO ONLINE. Lista de transacciones vacía, simulando carga desde BD.");
        setTransactions([]);
      } else { // mode === 'offline'
        console.log("TransactionsPage: MODO OFFLINE. Intentando cargar transacciones desde localStorage.");
        try {
          const storedTransactions = localStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
          if (storedTransactions) {
            console.log("TransactionsPage: Transacciones encontradas en localStorage.");
            setTransactions(JSON.parse(storedTransactions).sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          } else {
            console.log("TransactionsPage: No hay transacciones en localStorage, usando datos de demostración.");
            setTransactions(mockTransactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
          }
        } catch (error) {
          console.error("Error al leer transacciones desde localStorage, usando datos de demostración: ", error);
          setTransactions(mockTransactionsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      }
      setIsLoading(false);
      console.log("TransactionsPage: Carga de datos finalizada.");
    }, 500);
    return () => clearTimeout(timer);
  }, [mode, dataModeInitialized]);

  // Función para obtener información de una categoría por su ID
  const getCategoryInfo = (categoryId: string): { name: string; icon: Category['icon']; color: string } => {
    const category = categories.find(c => c.id === categoryId) || mockCategoriesData.find(c => c.id === categoryId);
    return category 
      ? { name: category.name, icon: iconMap[category.iconName] || Palette, color: category.color }
      : { name: "Desconocida", icon: Palette, color: "#808080" };
  };

  // Manejador para agregar una nueva transacción
  const handleAddTransaction = (data: { description: string; amount: number; type: 'income' | 'expense'; categoryId: string; date: Date }) => {
    const newTransaction: Transaction = {
      id: String(Date.now()), // ID simple basado en timestamp
      description: data.description,
      amount: data.amount,
      type: data.type,
      categoryId: data.categoryId,
      date: data.date.toISOString(),
    };

    if (mode === 'offline') {
      setTransactions(prevTransactions => {
        const updatedTransactions = [newTransaction, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        try {
          localStorage.setItem(OFFLINE_TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
          console.log("TransactionsPage: Transacciones guardadas en localStorage (modo offline).");
          toast({
            title: "Transacción Agregada",
            description: "La nueva transacción ha sido guardada localmente.",
          });
        } catch (error) {
          console.error("Error al guardar transacciones en localStorage: ", error);
          toast({
            title: "Error al Guardar",
            description: "No se pudo guardar la transacción localmente.",
            variant: "destructive",
          });
        }
        return updatedTransactions;
      });
    } else { // mode === 'online'
      // En modo online, la transacción se agrega al estado local (simulación) pero se informa que no es persistente.
      setTransactions(prevTransactions =>
        [newTransaction, ...prevTransactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
      toast({
        title: "Transacción Agregada (Simulado)",
        description: "La transacción se agregó a la vista actual, pero no se guardará permanentemente sin conexión a la base de datos.",
      });
    }
    setIsAddTransactionOpen(false); 
  };

  // Componente de esqueleto para la tabla mientras carga
  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Transacciones" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
           <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Intentando conectar con la base de datos para transacciones..." : "Cargando transacciones de demostración o locales en Modo Offline..."}
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historial de Transacciones</CardTitle>
              {/* El botón "Agregar" se mostrará deshabilitado o habilitado según el modo, así que no necesita un esqueleto específico aquí */}
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

  // Categorías filtradas para el diálogo de agregar transacción
  const expenseCategories = categories.filter(c => c.type === 'expense');
  const incomeCategories = categories.filter(c => c.type === 'income');

  return (
    <TooltipProvider>
      <AppHeader title="Transacciones" />
      <main className="flex-1 p-4 md:p-6 space-y-4">
        {/* Alerta informativa según el modo */}
        {mode === 'online' && (
            <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
              <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
              <AlertTitle>Modo Online Activo</AlertTitle>
              <AlertDescription>
                {transactions.length === 0 && !isLoading
                  ? "Intentando conectar con la base de datos para transacciones. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                  : "Las transacciones se obtendrían desde una base de datos. "}
                La funcionalidad completa de base de datos está pendiente de implementación.
              </AlertDescription>
            </Alert>
          )}
        {mode === 'offline' && (
            <Alert className="mb-4 border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300">
              <Terminal className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
              <AlertTitle>Modo Offline (Local/Demostración)</AlertTitle>
              <AlertDescription>
                Estás viendo transacciones guardadas localmente o de demostración. Puedes agregar nuevas transacciones que se guardarán en tu navegador.
              </AlertDescription>
            </Alert>
        )}
        
        {/* Botón para agregar transacción, condicionalmente deshabilitado en modo online */}
        <div className="flex justify-end mb-4">
          {mode === 'online' ? (
            <Tooltip>
              <TooltipTrigger asChild>
                {/* Se necesita un span para que el Tooltip funcione con un botón deshabilitado */}
                <span tabIndex={0}> 
                  <Button disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Agregar Nueva Transacción
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>La adición de transacciones está deshabilitada en Modo Online.</p>
                <p>Requiere conexión a la base de datos (funcionalidad pendiente).</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button onClick={() => setIsAddTransactionOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Nueva Transacción
            </Button>
          )}
        </div>

        {/* Diálogo para agregar transacción */}
        <AddTransactionDialog
          isOpen={isAddTransactionOpen}
          setIsOpen={setIsAddTransactionOpen}
          onAddTransaction={handleAddTransaction}
          categories={expenseCategories} 
          incomeCategories={incomeCategories}
        />

        {/* Tabla de transacciones */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>
                    {mode === 'online' 
                      ? transactions.length > 0 ? "Una lista de tus transacciones recientes (simuladas desde BD)." : "No hay transacciones para mostrar (simulando BD vacía o sin conexión)."
                      : "Una lista de tus transacciones locales o de demostración."}
                  </TableCaption>
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
              // Mensajes para cuando no hay transacciones
              <div className="text-center py-8">
                 {mode === 'online' && !isLoading && transactions.length === 0 && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Transacciones</h3>
                    <p className="text-muted-foreground">
                      En modo online, las transacciones se obtendrían desde la base de datos. <br />
                      Puede que no haya datos registrados o no se haya podido establecer conexión (funcionalidad pendiente).
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && !isLoading && transactions.length === 0 && (
                   <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Transacciones Locales</h3>
                    <p className="text-muted-foreground">
                      Aún no has agregado ninguna transacción en modo offline. <br />
                      Haz clic en "Agregar Nueva Transacción" para empezar.
                    </p>
                  </div>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </TooltipProvider>
  );
}
