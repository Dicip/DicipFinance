
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
import { PlusCircle, Edit, Trash2, Palette, AlertTriangle, DatabaseBackup, Terminal } from "lucide-react";
import type { Category, BudgetGoal, Transaction } from "@/lib/types";
import { 
    categories as mockCategoriesData, 
    transactions as mockTransactionsData, 
    budgetGoals as mockBudgetGoalsData, 
    iconMap 
} from "@/lib/data";
import { AddEditBudgetDialog } from "@/components/budgets/AddEditBudgetDialog";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/hooks/useDataMode";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Clave para guardar/leer objetivos de presupuesto del localStorage en modo offline
const OFFLINE_BUDGET_GOALS_KEY = 'userBudgetGoals_offline';
// Clave para leer transacciones del localStorage en modo offline (necesario para calcular el gasto)
const OFFLINE_TRANSACTIONS_KEY = 'userTransactions_offline';
// Clave para leer categorías personalizadas del localStorage en modo offline
const CUSTOM_CATEGORIES_KEY = 'customCategories';


interface ToastInfo {
  title: string;
  description: string;
  variant?: "default" | "destructive";
}

export default function BudgetsPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetGoal | null>(null);
  const [budgetToDelete, setBudgetToDelete] = useState<BudgetGoal | null>(null);
  const { toast } = useToast();
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);

  // Efecto para mostrar notificaciones (toast)
  useEffect(() => {
    if (toastInfo) {
      toast(toastInfo);
      setToastInfo(null); // Resetear después de mostrar
    }
  }, [toastInfo, toast]);

  // Efecto para cargar datos iniciales (objetivos, categorías, transacciones)
  useEffect(() => {
    if (!dataModeInitialized) {
      // Si el modo de datos aún no se ha inicializado, no hacer nada.
      return;
    }
    setIsLoading(true);
    console.log(`BudgetsPage: Cargando datos en modo ${mode}.`);

    // Cargar categorías base y transacciones
    // Estas son necesarias para mostrar nombres de categorías y calcular gastos,
    // independientemente de si los objetivos vienen de localStorage o mock.
    let loadedBaseCategories: Category[];
    let loadedTransactions: Transaction[];

    if (mode === 'offline') {
      // Cargar categorías personalizadas o mock en modo offline
      try {
        const storedCategories = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
        if (storedCategories) {
          loadedBaseCategories = JSON.parse(storedCategories).map((cat: Omit<Category, 'icon'>) => ({
            ...cat,
            icon: iconMap[cat.iconName] || Palette,
          }));
        } else {
          loadedBaseCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        }
      } catch (e) {
        console.error("Error cargando categorías desde localStorage, usando mock:", e);
        loadedBaseCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
      }
      // Cargar transacciones desde localStorage o mock en modo offline
      try {
        const storedTransactions = localStorage.getItem(OFFLINE_TRANSACTIONS_KEY);
        if (storedTransactions) {
          loadedTransactions = JSON.parse(storedTransactions);
        } else {
          loadedTransactions = mockTransactionsData;
        }
      } catch (e) {
        console.error("Error cargando transacciones desde localStorage, usando mock:", e);
        loadedTransactions = mockTransactionsData;
      }
    } else { // mode === 'online'
      // En modo online, usar categorías base mock y transacciones vacías (simulando carga de BD)
      loadedBaseCategories = mockCategoriesData.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
      loadedTransactions = []; // Simular transacciones vacías desde BD
    }
    setCategories(loadedBaseCategories);
    setTransactions(loadedTransactions);
    
    // Cargar objetivos de presupuesto
    const timer = setTimeout(() => {
      if (mode === 'online') {
        console.log("BudgetsPage: MODO ONLINE. Lista de objetivos de presupuesto vacía, simulando carga desde BD.");
        setBudgetGoals([]);  // Simular objetivos vacíos desde BD
      } else { // Offline mode
        console.log("BudgetsPage: MODO OFFLINE. Cargando objetivos de presupuesto desde localStorage o datos de demostración.");
        try {
          const storedBudgetGoals = localStorage.getItem(OFFLINE_BUDGET_GOALS_KEY);
          if (storedBudgetGoals) {
            setBudgetGoals(JSON.parse(storedBudgetGoals));
            console.log("BudgetsPage: Objetivos cargados desde localStorage.");
          } else {
            setBudgetGoals(mockBudgetGoalsData); // Usar mock si no hay nada en localStorage
            console.log("BudgetsPage: No hay objetivos en localStorage, usando datos de demostración.");
          }
        } catch (error) {
          console.error("Error al leer objetivos desde localStorage, usando datos de demostración: ", error);
          setBudgetGoals(mockBudgetGoalsData);
        }
      }
      setIsLoading(false);
      console.log("BudgetsPage: Carga de datos de objetivos finalizada.");
    }, 500); // Simular carga de red
    return () => clearTimeout(timer);
  }, [mode, dataModeInitialized]);


  // Manejador para abrir el diálogo de agregar presupuesto
  const handleAddBudget = () => {
    // Solo se pueden agregar presupuestos en modo online (simulado)
    // O en modo offline (se guardarán localmente)
    setEditingBudget(null);
    setIsDialogOpen(true);
  };

  // Manejador para abrir el diálogo de editar presupuesto
  const handleEditBudget = (budget: BudgetGoal) => {
    setEditingBudget(budget);
    setIsDialogOpen(true);
  };

  // Manejador para iniciar la eliminación de un presupuesto
  const handleDeleteBudget = (budget: BudgetGoal) => {
    setBudgetToDelete(budget);
  };

  // Confirmar la eliminación de un presupuesto
  const confirmDelete = () => {
    if (budgetToDelete) {
      const categoryName = categories.find(c => c.id === budgetToDelete.categoryId)?.name || "Desconocida";
      const updatedBudgetGoals = budgetGoals.filter((b) => b.id !== budgetToDelete.id);
      setBudgetGoals(updatedBudgetGoals);

      if (mode === 'offline') {
        try {
          localStorage.setItem(OFFLINE_BUDGET_GOALS_KEY, JSON.stringify(updatedBudgetGoals));
          setToastInfo({ 
            title: "Objetivo de Presupuesto Eliminado", 
            description: `El objetivo para "${categoryName}" ha sido eliminado y guardado localmente.` 
          });
        } catch (error) {
          console.error("Error al guardar objetivos en localStorage: ", error);
          setToastInfo({ 
            title: "Error al Guardar", 
            description: `No se pudo guardar la eliminación del objetivo para "${categoryName}" localmente.`,
            variant: "destructive"
          });
        }
      } else { // mode === 'online'
         setToastInfo({ 
          title: "Objetivo de Presupuesto Eliminado (Simulado)", 
          description: `El objetivo para "${categoryName}" ha sido eliminado (los cambios son locales en esta simulación).` 
        });
      }
      setBudgetToDelete(null);
    }
  };

  // Manejador para enviar datos del diálogo (agregar/editar presupuesto)
  const handleSubmitDialog = (data: Omit<BudgetGoal, 'id'> & { id?: string }) => {
    let toastTitle = "";
    let toastDescription = "";
    const category = categories.find(c => c.id === data.categoryId);
    const categoryName = category?.name || 'Desconocida';
    let updatedBudgetGoals: BudgetGoal[];

    if (editingBudget) { // Editando existente
      updatedBudgetGoals = budgetGoals.map((b) =>
        b.id === editingBudget.id ? { ...editingBudget, ...data } : b
      );
      toastTitle = mode === 'offline' ? "Objetivo Actualizado" : "Objetivo Actualizado (Simulado)";
      toastDescription = `El objetivo para "${categoryName}" se actualizó${mode === 'offline' ? ' y guardó localmente' : ' (los cambios son locales)'}.`;
    } else { // Agregando nuevo
      const newBudgetGoal: BudgetGoal = {
        ...data,
        id: String(Date.now()), 
      };
      updatedBudgetGoals = [...budgetGoals, newBudgetGoal];
      toastTitle = mode === 'offline' ? "Objetivo Agregado" : "Objetivo Agregado (Simulado)";
      toastDescription = `El objetivo para "${categoryName}" se agregó${mode === 'offline' ? ' y guardó localmente' : ' (los cambios son locales)'}.`;
    }
    
    setBudgetGoals(updatedBudgetGoals);

    if (mode === 'offline') {
      try {
        localStorage.setItem(OFFLINE_BUDGET_GOALS_KEY, JSON.stringify(updatedBudgetGoals));
      } catch (error) {
        console.error("Error al guardar objetivos en localStorage: ", error);
        toastTitle = "Error al Guardar";
        toastDescription = `No se pudieron guardar los cambios para el objetivo de "${categoryName}" localmente.`;
        setToastInfo({ title: toastTitle, description: toastDescription, variant: "destructive" });
        setIsDialogOpen(false);
        setEditingBudget(null);
        return; // Salir para no mostrar el toast de éxito
      }
    }

    setToastInfo({ title: toastTitle, description: toastDescription });
    setIsDialogOpen(false);
    setEditingBudget(null);
  };

  // Detalles de los presupuestos, calculando gastos y progreso
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

  // Categorías de gasto para el diálogo
  const expenseCategories = useMemo(() => categories.filter(c => c.type === 'expense'), [categories]);

  // Estado de carga
  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Presupuestos" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
           <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Intentando conectar con la base de datos para presupuestos..." : "Cargando presupuestos de demostración o locales en Modo Offline..."}
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
                    <Skeleton key={`skel-progress-${i}`} className="h-4 w-full rounded-full" />
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
        {/* Alerta para Modo Online */}
        {mode === 'online' && (
          <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle>Modo Online Activo</AlertTitle>
            <AlertDescription>
              {budgetDetails.length === 0 && !isLoading
                ? "Intentando conectar con la base de datos para presupuestos. Si es una cuenta nueva o no hay conexión, no se mostrarán datos. "
                : "Los datos de presupuestos se gestionarían a través de la conexión online. "}
              La funcionalidad completa de base de datos está pendiente de implementación. Las operaciones son simuladas y no persistirán.
            </AlertDescription>
          </Alert>
        )}
        {/* Alerta para Modo Offline */}
         {mode === 'offline' && (
          <Alert className="mb-4 border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300">
            <Terminal className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertTitle>Modo Offline (Local)</AlertTitle>
            <AlertDescription>
              Estás viendo objetivos de presupuesto guardados localmente o de demostración. Puedes agregar, editar y eliminar objetivos, y los cambios se guardarán en tu navegador.
            </AlertDescription>
          </Alert>
        )}

        {/* Botón para agregar presupuesto */}
        <div className="flex justify-end mb-4">
        <Button onClick={handleAddBudget}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Objetivo de Presupuesto
        </Button>
        </div>

        {/* Tarjeta de lista de presupuestos */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Mis Objetivos de Presupuesto</CardTitle>
            <CardDescription>
              {mode === 'offline' 
                ? "Objetivos de presupuesto guardados localmente o de demostración." 
                : "Define y sigue tus objetivos de gasto mensuales por categoría (operaciones simuladas)."}
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
                      En modo online, los objetivos se obtendrían desde la base de datos. <br />
                      Puedes agregar un nuevo objetivo para empezar (será simulado y no persistirá).
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && budgetGoals.length === 0 && ( 
                    <div className="flex flex-col items-center justify-center space-y-3">
                        <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold">No hay Objetivos de Presupuesto Guardados</h3>
                        <p className="text-muted-foreground">
                            Aún no has agregado objetivos de presupuesto en modo offline. <br />
                            Haz clic en "Agregar Objetivo de Presupuesto" para empezar.
                        </p>
                    </div>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Diálogo para agregar/editar presupuesto */}
      <AddEditBudgetDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSubmit={handleSubmitDialog}
          budget={editingBudget}
          categories={expenseCategories} // Solo se pueden presupuestar categorías de gasto
          existingBudgetCategoryIds={budgetGoals.map(bg => bg.categoryId)}
      />

      {/* Diálogo de confirmación para eliminar presupuesto */}
      {budgetToDelete && (
         <AlertDialog open={!!budgetToDelete} onOpenChange={() => setBudgetToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de eliminar este objetivo de presupuesto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará el objetivo de presupuesto para la categoría "{categories.find(c=>c.id === budgetToDelete.categoryId)?.name}".
                {mode === 'online' && " (Esta acción será simulada y no afectará la base de datos en la versión actual)."}
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
