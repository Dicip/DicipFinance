
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
import { categories as mockCategoriesData, iconMap } from "@/lib/data";
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
        console.log("CategoriesPage: MODO ONLINE. Lista de categorías inicialmente vacía.");
        loadedCategories = []; // En modo online, las categorías deberían venir de la BD. Simular lista vacía.
      } else { // Offline mode
        console.log("CategoriesPage: MODO OFFLINE. Cargando categorías de demostración.");
        loadedCategories = mockCategoriesData.map((cat: Omit<Category, 'icon'>) => ({ ...cat, icon: iconMap[cat.iconName] || Palette }));
      }
      setCategories(loadedCategories);
      setIsLoading(false);
    }, 100);
  }, [mode, dataModeInitialized]);


  const handleAddCategory = () => {
    if (mode === 'online') {
      setEditingCategory(null);
      setIsDialogOpen(true);
    } else {
      toast({
        title: "Modo Offline",
        description: "La adición de categorías solo está permitida en Modo Online.",
        variant: "default",
      });
    }
  };

  const handleEditCategory = (category: Category) => {
    if (mode === 'online') {
      setEditingCategory(category);
      setIsDialogOpen(true);
    } else {
       toast({
        title: "Modo Offline",
        description: "La edición de categorías solo está permitida en Modo Online.",
        variant: "default",
      });
    }
  };

  const handleDeleteCategory = (category: Category) => {
    if (mode === 'online') {
      setCategoryToDelete(category);
    } else {
       toast({
        title: "Modo Offline",
        description: "La eliminación de categorías solo está permitida en Modo Online.",
        variant: "default",
      });
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete && mode === 'online') {
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      toast({ title: "Categoría Eliminada (Simulado)", description: `La categoría "${categoryToDelete.name}" ha sido eliminada (los cambios son locales en esta simulación).` });
      setCategoryToDelete(null);
    }
  };

  const handleSubmitDialog = (data: Omit<Category, 'id' | 'icon'> & { id?: string }) => {
    if (mode === 'online') {
      setCategories((prev) => {
        let updated;
        if (editingCategory) {
          updated = prev.map((c) =>
            c.id === editingCategory.id ? { ...c, ...data, icon: iconMap[data.iconName] || Palette } : c
          );
          toast({ title: "Categoría Actualizada (Simulado)", description: `La categoría "${data.name}" ha sido actualizada (los cambios son locales en esta simulación).` });
        } else {
          const newCategory: Category = {
            ...data,
            id: String(Date.now()), 
            icon: iconMap[data.iconName] || Palette,
          };
          updated = [...prev, newCategory];
          toast({ title: "Categoría Agregada (Simulado)", description: `La categoría "${data.name}" ha sido agregada (los cambios son locales en esta simulación).` });
        }
        return updated;
      });
      setIsDialogOpen(false);
      setEditingCategory(null);
    }
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
              {mode === 'online' ? "Verificando categorías en Modo Online..." : "Cargando categorías de demostración en Modo Offline..."}
            </AlertDescription>
          </Alert>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gestionar Categorías</CardTitle>
              {mode === 'online' && <Skeleton className="h-10 w-48" />} 
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
              En modo online, las categorías se obtendrían de una base de datos. 
              Si no hay conexión o es una cuenta nueva, la lista estará vacía.
              Puedes agregar y editar categorías, pero los cambios son simulados y no persistirán hasta que se implemente una base de datos real.
            </AlertDescription>
          </Alert>
        )}
        {mode === 'offline' && (
          <Alert className="mb-4 border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300">
            <Terminal className="h-4 w-4 !text-yellow-600 dark:!text-yellow-400" />
            <AlertTitle>Modo Offline (Demostración)</AlertTitle>
            <AlertDescription>
              Estás viendo categorías de demostración. No puedes agregar, editar ni eliminar categorías en este modo.
              Cambia a Modo Online para gestionar tus propias categorías (funcionalidad de base de datos pendiente).
            </AlertDescription>
          </Alert>
        )}

        {mode === 'online' && (
          <div className="flex justify-end mb-4">
            <Button onClick={handleAddCategory}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Nueva Categoría
            </Button>
          </div>
        )}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Lista de Categorías</CardTitle>
            <CardDescription>
              {mode === 'offline' 
                ? "Estas son las categorías de demostración. Las modificaciones no están permitidas."
                : "Administra tus categorías de ingresos y gastos. Los cambios son simulados en modo online."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                <TableCaption>
                  {mode === 'offline' 
                    ? "Categorías de demostración." 
                    : categories.length > 0 ? "Categorías gestionadas (simuladas, no persistentes en modo online)." : "No hay categorías para mostrar."}
                </TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Icono</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Color</TableHead>
                      {mode === 'online' && <TableHead className="text-right">Acciones</TableHead>}
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
                          {mode === 'online' && (
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
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
               <div className="text-center py-8">
                 {mode === 'online' && !isLoading && categories.length === 0 && (
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Categorías (Modo Online)</h3>
                     <p className="text-muted-foreground">
                      En modo online, las categorías se cargarían desde la base de datos. <br />
                      Puedes agregar categorías, pero no se guardarán permanentemente en esta simulación.
                    </p>
                  </div>
                 )}
                 {mode === 'offline' && !isLoading && categories.length === 0 && ( // Esto no debería pasar si mockCategoriesData tiene datos, ya que se cargan.
                   <div className="flex flex-col items-center justify-center space-y-3">
                    <DatabaseBackup className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-semibold">No hay Categorías de Demostración</h3>
                    <p className="text-muted-foreground">
                      No se encontraron categorías de demostración para mostrar.
                    </p>
                  </div>
                 )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {mode === 'online' && (
        <AddEditCategoryDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          onSubmit={handleSubmitDialog}
          category={editingCategory}
        />
      )}

      {mode === 'online' && categoryToDelete && (
         <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro de eliminar esta categoría?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará la categoría "{categoryToDelete.name}".
                (Esta acción no afectará la base de datos en la versión actual).
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
