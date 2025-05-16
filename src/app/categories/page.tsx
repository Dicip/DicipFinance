
"use client";

import { useState, useEffect } from "react";
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
  TableCaption
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
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Trash2, Palette } from "lucide-react";
import type { Category } from "@/lib/types";
import { categories as mockCategories, iconMap } from "@/lib/data";
import { AddEditCategoryDialog } from "@/components/categories/AddEditCategoryDialog";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/hooks/useDataMode";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function CategoriesPage() {
  const { mode, isInitialized: dataModeInitialized } = useDataMode();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!dataModeInitialized) {
      return;
    }
    setIsLoading(true);
    // Simulate data loading based on mode
    setTimeout(() => {
      if (mode === 'online') {
        // In a real app, fetch categories from DB. For now, empty or mock.
        // To demonstrate CRUD locally even in online mode for categories for now:
        const storedCategories = localStorage.getItem('customCategories');
        if (storedCategories) {
          setCategories(JSON.parse(storedCategories).map((cat: Category) => ({...cat, icon: iconMap[cat.iconName] || Palette })));
        } else {
          setCategories(mockCategories.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette })));
        }
      } else { // Offline mode
        const storedCategories = localStorage.getItem('customCategories');
         if (storedCategories) {
          setCategories(JSON.parse(storedCategories).map((cat: Category) => ({...cat, icon: iconMap[cat.iconName] || Palette })));
        } else {
          setCategories(mockCategories.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette })));
        }
      }
      setIsLoading(false);
    }, 100);
  }, [mode, dataModeInitialized]);

  const saveCategoriesToLocalStorage = (updatedCategories: Category[]) => {
    // Store only iconName, not the full icon component
    const storableCategories = updatedCategories.map(({ icon, ...rest }) => rest);
    localStorage.setItem('customCategories', JSON.stringify(storableCategories));
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      // Basic check: prevent deleting if transactions use this category
      // In a real app, this check would be more robust, possibly against a DB
      // For now, as transactions are not linked to this local state, we allow deletion.
      // const isCategoryInUse = transactions.some(t => t.categoryId === categoryToDelete.id);
      // if (isCategoryInUse) {
      //   toast({ title: "Error", description: "Esta categoría está siendo utilizada por transacciones y no puede ser eliminada.", variant: "destructive" });
      //   setCategoryToDelete(null);
      //   return;
      // }

      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== categoryToDelete.id);
        saveCategoriesToLocalStorage(updated);
        return updated;
      });
      toast({ title: "Categoría Eliminada", description: `La categoría "${categoryToDelete.name}" ha sido eliminada.` });
      setCategoryToDelete(null);
    }
  };

  const handleSubmitDialog = (data: Omit<Category, 'id' | 'icon'> & { id?: string }) => {
    setCategories((prev) => {
      let updated;
      if (editingCategory) {
        updated = prev.map((c) =>
          c.id === editingCategory.id ? { ...c, ...data, icon: iconMap[data.iconName] || Palette } : c
        );
        toast({ title: "Categoría Actualizada", description: `La categoría "${data.name}" ha sido actualizada.` });
      } else {
        const newCategory: Category = {
          ...data,
          id: String(Date.now()), // Simple ID generation
          icon: iconMap[data.iconName] || Palette,
        };
        updated = [...prev, newCategory];
        toast({ title: "Categoría Agregada", description: `La categoría "${data.name}" ha sido agregada.` });
      }
      saveCategoriesToLocalStorage(updated);
      return updated;
    });
    setIsDialogOpen(false);
    setEditingCategory(null);
  };

  if (!dataModeInitialized || isLoading) {
    return (
      <>
        <AppHeader title="Categorías" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
           <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Modo de Datos</AlertTitle>
            <AlertDescription>
              {mode === 'online' ? "Cargando categorías en Modo Online..." : "Cargando categorías en Modo Offline..."}
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestionar Categorías</CardTitle>
              <Skeleton className="h-10 w-48" /> {/* Skeleton for Add Button */}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-md" />
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
      <AppHeader title="Categorías" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddCategory}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Nueva Categoría
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Categorías</CardTitle>
            <CardDescription>
              Administra tus categorías de ingresos y gastos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                <TableCaption>Tus categorías personalizadas.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icono</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => {
                      const IconComponent = category.icon || Palette;
                      return (
                        <TableRow key={category.id}>
                          <TableCell>
                            <IconComponent className="h-5 w-5" style={{ color: category.color }} />
                          </TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              category.type === 'income'
                                ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                                : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                            }`}>
                              {category.type === 'income' ? 'Ingreso' : 'Gasto'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div
                                className="h-4 w-4 rounded-full mr-2 border"
                                style={{ backgroundColor: category.color }}
                              />
                              {category.color}
                            </div>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="icon" onClick={() => handleEditCategory(category)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteCategory(category)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay categorías para mostrar. ¡Agrega una nueva!
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      <AddEditCategoryDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onSubmit={handleSubmitDialog}
        category={editingCategory}
      />

      {categoryToDelete && (
         <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de eliminar esta categoría?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará la categoría "{categoryToDelete.name}".
                Asegúrate de que ninguna transacción o presupuesto esté utilizando esta categoría.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
