
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
import { PlusCircle, Edit, Trash2, Palette, DatabaseBackup, Terminal } from "lucide-react";
import type { Category } from "@/lib/types";
import { categories as mockCategories, iconMap } from "@/lib/data";
import { AddEditCategoryDialog } from "@/components/categories/AddEditCategoryDialog";
import { useToast } from "@/hooks/use-toast";
import { useDataMode } from "@/hooks/useDataMode";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
    setTimeout(() => {
      let loadedCategories: Category[];
      if (mode === 'online') {
        // En modo online, las categorías se considerarían cargadas desde una "base de datos".
        // Por ahora, usamos mockCategories como base. No se leen de localStorage.
        // Las modificaciones en esta página en modo online no serán persistentes
        // hasta que se implemente una base de datos real.
        loadedCategories = mockCategories.map(cat => ({...cat, icon: iconMap[cat.iconName] || Palette }));
      } else { // Offline mode
        const storedCategories = localStorage.getItem('customCategories');
         if (storedCategories) {
          loadedCategories = JSON.parse(storedCategories).map((cat: Omit<Category, 'icon'>) => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        } else {
          // Si no hay nada en localStorage en modo offline, usar mocks como datos iniciales.
          loadedCategories = mockCategories.map(cat => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
        }
      }
      setCategories(loadedCategories);
      setIsLoading(false);
    }, 100);
  }, [mode, dataModeInitialized]);

  const saveCategoriesToLocalStorage = (updatedCategories: Category[]) => {
    if (mode === 'offline') { // Solo guardar en localStorage si estamos en modo offline
      const storableCategories = updatedCategories.map(({ icon, ...rest }) => rest);
      localStorage.setItem('customCategories', JSON.stringify(storableCategories));
    }
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
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== categoryToDelete.id);
        saveCategoriesToLocalStorage(updated); // Guardará solo si es modo offline
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
      saveCategoriesToLocalStorage(updated); // Guardará solo si es modo offline
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
        {mode === 'online' && (
          <Alert className="mb-4 border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
            <Terminal className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
            <AlertTitle>Modo Online Activo</AlertTitle>
            <AlertDescription>
              Las categorías se muestran desde una fuente base (simulada). Las modificaciones aquí no son persistentes
              hasta que se implemente una base de datos. Para gestionar categorías persistentes localmente, cambia a Modo Offline.
            </AlertDescription>
          </Alert>
        )}

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
              {mode === 'offline' ? " Los cambios se guardan localmente." : ""}
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
               <div className="text-center py-8">
                 {mode === 'online' && categories.length === 0 && ( // Normalmente en online habría datos o error de BD
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Categorías Base</h3>
                    <p className="text-muted-foreground">
                      No se pudieron cargar las categorías base en modo online.
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && categories.length === 0 && (
                   <p className="text-muted-foreground">No hay categorías para mostrar. ¡Agrega una nueva!</p>
                 )}
              </div>
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
                {mode === 'online' && " (Esta acción no afectará la base de datos en la versión actual)."}
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

    