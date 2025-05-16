
"use client";

import { useState, useEffect, useMemo } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit, Trash2, Palette, AlertTriangle, DatabaseBackup } from "lucide-react";
import type { Category, BudgetGoal, Transaction } from "@/lib/types";
import { categories as mockCategories, transactions as mockTransactions, budgetGoals as mockBudgetGoals, iconMap } from "@/lib/data";
import { AddEditBudgetDialog } from "@/components/budgets/AddEditBudgetDialog";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/hooks/useDataMode";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function BudgetsPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Needed to calculate spent amounts
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetGoal | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetGoal | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!dataModeInitialized) {
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      let loadedCategories: Category[];
      let loadedTransactions: Transaction[];
      let loadedBudgetGoals: BudgetGoal[];

      if (mode === 'online') {
        loadedCategories = mockCategories.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        loadedTransactions = []; // In online mode, transactions would be fetched
        loadedBudgetGoals = [];  // In online mode, budget goals would be fetched
      } else { // Offline mode
        const storedCategories = localStorage.getItem('customCategories');
        if (storedCategories) {
          loadedCategories = JSON.parse(storedCategories).map((cat: Omit<Category, 'icon'>) => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        } else {
          loadedCategories = mockCategories.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        }
        setCategories(loadedCategories);

        loadedTransactions = mockTransactions; // Use mock transactions for offline mode for now

        const storedBudgetGoals = localStorage.getItem('customBudgetGoals');
        if (storedBudgetGoals) {
          loadedBudgetGoals = JSON.parse(storedBudgetGoals);
        } else {
          loadedBudgetGoals = mockBudgetGoals;
        }
      }
      setCategories(loadedCategories);
      setTransactions(loadedTransactions);
      setBudgetGoals(loadedBudgetGoals);
      setIsLoading(false);
    }, 100);
  }, [mode, dataModeInitialized]);

  const saveBudgetGoalsToLocalStorage = (updatedBudgetGoals: BudgetGoal[]) => {
    localStorage.setItem('customBudgetGoals', JSON.stringify(updatedBudgetGoals));
  };

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  const handleEditBudget = (budget: BudgetGoal) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  const handleDeleteBudget = (budget: BudgetGoal) => {
    setBudgetToDelete(budget);
  };

  const confirmDelete = () => {
    if (budgetToDelete) {
      setBudgetGoals((prev) => {
        const updated = prev.filter((b) => b.id !== budgetToDelete.id);
        if (mode === 'offline') {
          saveBudgetGoalsToLocalStorage(updated);
        }
        return updated;
      });
      toast({ title: "Objetivo de Presupuesto Eliminado", description: `El objetivo para la categoría ha sido eliminado.` });
      setBudgetToDelete(null);
    }
  };

  const handleSubmitDialog = (data: Omit<BudgetGoal, 'id'> & { id?: string }) => {
    setBudgetGoals((prev) => {
      let updated;
      const category = categories.find(c => c.id === data.categoryId);
      const categoryName = category?.name || 'Desconocida';

      if (editingBudget) {
        updated = prev.map((b) =>
          b.id === editingBudget.id ? { ...editingBudget, ...data } : b
        );
        toast({ title: "Objetivo de Presupuesto Actualizado", description: `El objetivo para "${categoryName}" ha sido actualizado.` });
      } else {
        const newBudgetGoal: BudgetGoal = {
          ...data,
          id: String(Date.now()), // Simple ID generation
        };
        updated = [...prev, newBudgetGoal];
        toast({ title: "Objetivo de Presupuesto Agregado", description: `El objetivo para "${categoryName}" ha sido agregado.` });
      }
      if (mode === 'offline') {
        saveBudgetGoalsToLocalStorage(updated);
      }
      return updated;
    });
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  const budgetDetails = useMemo(() => {
    return budgetGoals.map(goal => {
      const category = categories.find(c => c.id === goal.categoryId);
      const spent = transactions
        .filter(t => t.type === 'expense' && t.categoryId === goal.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      const progress = goal.amount > 0 ? Math.min((spent / goal.amount) * 100, 100) : 0;
      const overBudget = spent > goal.amount;
      return {
        ...goal,
        categoryName: category?.name || "Desconocida",
        categoryIcon: category?.icon || Palette,
        categoryColor: category?.color || "#808080",
        spent,
        progress,
        overBudget,
      };
    }).sort((a,b) => a.categoryName.localeCompare(b.categoryName));
  }, [budgetGoals, categories, transactions]);

  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);

  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Presupuestos" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
           <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Cargando presupuestos en Modo Online..." : "Cargando presupuestos en Modo Offline..."}
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gestionar Presupuestos</CardTitle>
                <CardDescription>Define y sigue tus objetivos de gasto mensuales.</CardDescription>
              </div>
              <Skeleton className="h-10 w-52" /> {/* Skeleton for Add Button */}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-5 w-1/4" />
                    </div>
                    <Skeleton key={i} className="h-4 w-full rounded-full" />
                  </div>
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
      <AppHeader title="Presupuestos" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        {mode === 'online' && (
          <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle>Modo Online Activo</AlertTitle>
            <AlertDescription>
              {budgetDetails.length === 0 && !isLoading
                ? "Intentando conectar con la base de datos para presupuestos. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                : "Los datos de presupuestos se gestionan a través de la conexión online. "}
              La funcionalidad completa de base de datos está pendiente de implementación.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end mb-4">
          <Button onClick={handleAddBudget}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Objetivo de Presupuesto
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mis Objetivos de Presupuesto</CardTitle>
            <CardDescription>
              Define y sigue tus objetivos de gasto mensuales por categoría.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {budgetDetails.length > 0 ? (
              <div className="space-y-6">
                {budgetDetails.map((budget) => {
                  const IconComponent = budget.categoryIcon;
                  return (
                    <div key={budget.id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <IconComponent className="h-6 w-6 mr-3" style={{ color: budget.categoryColor }} />
                          <span className="text-lg font-semibold">{budget.categoryName}</span>
                        </div>
                        <div className="space-x-2">
                           <Button variant="outline" size="icon" onClick={() => handleEditBudget(budget)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => handleDeleteBudget(budget)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className={`${budget.overBudget ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                          Gastado: CLP ${budget.spent.toLocaleString('es-CL')}
                        </span>
                        <span className="font-medium">
                          Objetivo: CLP ${budget.amount.toLocaleString('es-CL')}
                        </span>
                      </div>
                      <Progress value={budget.progress} className={`${budget.overBudget ? '[&>div]:bg-destructive' : ''} h-3`} />
                      {budget.overBudget && (
                        <div className="mt-2 text-xs text-destructive flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Te has pasado del presupuesto.
                        </div>
                      )}
                       {budget.progress === 100 && !budget.overBudget && (
                        <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                          ¡Has alcanzado el límite de tu presupuesto para esta categoría!
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
               <div className="text-center py-8">
                 {mode === 'online' && !isLoading && budgetDetails.length === 0 && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Objetivos de Presupuesto</h3>
                    <p className="text-muted-foreground">
                      En modo online, los objetivos se cargan desde la base de datos. <br />
                      Puedes agregar un nuevo objetivo o verificar tu conexión.
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && budgetDetails.length === 0 && (
                   <p className="text-muted-foreground">No hay objetivos de presupuesto para mostrar. ¡Agrega uno nuevo!</p>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddEditBudgetDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSubmit={handleSubmitDialog}
        budget={editingBudget}
        categories={expenseCategories}
        existingBudgetCategoryIds={budgetGoals.map(bg => bg.categoryId)}
      />

      {budgetToDelete && (
         <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de eliminar este objetivo de presupuesto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará el objetivo de presupuesto para la categoría "{categories.find(c=>c.id === budgetToDelete.categoryId)?.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setBudgetToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
