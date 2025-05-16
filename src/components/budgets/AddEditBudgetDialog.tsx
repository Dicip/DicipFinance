
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { BudgetGoal, Category } from "@/lib/types";

const formSchema = z.object({
  categoryId: z.string().min(1, "Debes seleccionar una categoría."),
  amount: z.coerce.number().positive("El monto debe ser un número positivo mayor que cero."),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditBudgetDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: Omit<BudgetGoal, 'id'> & { id?: string }) => void;
  budget: BudgetGoal | null;
  categories: Category[]; // Expense categories
  existingBudgetCategoryIds: string[]; // IDs of categories that already have a budget
}

export function AddEditBudgetDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  budget,
  categories,
  existingBudgetCategoryIds,
}: AddEditBudgetDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (budget) {
      form.reset({
        categoryId: budget.categoryId,
        amount: budget.amount,
      });
    } else {
      form.reset({
        categoryId: "",
        amount: 0,
      });
    }
  }, [budget, form, isOpen]);

  function handleSubmit(values: FormValues) {
    if (budget) {
      onSubmit({ ...values, id: budget.id });
    } else {
      onSubmit(values);
    }
    // No need to call setIsOpen(false) here if DialogClose is used or parent handles it
  }

  const dialogTitle = budget ? "Editar Objetivo de Presupuesto" : "Agregar Nuevo Objetivo de Presupuesto";
  const dialogDescription = budget
    ? "Modifica los detalles del objetivo."
    : "Ingresa los detalles para el nuevo objetivo de presupuesto.";

  // Filter categories to show only those not already in a budget, unless it's the one being edited
  const availableCategories = categories.filter(
    (cat) => !existingBudgetCategoryIds.includes(cat.id) || (budget && cat.id === budget.categoryId)
  );


  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
      }
      setIsOpen(open);
    }}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría de Gasto</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value} 
                    value={field.value}
                    disabled={!!budget} // Disable if editing, as category shouldn't change
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría de gasto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableCategories.length > 0 ? (
                        availableCategories.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center">
                                <IconComponent className="mr-2 h-4 w-4" style={{ color: category.color }} />
                                {category.name}
                              </div>
                            </SelectItem>
                          );
                        })
                      ) : (
                         <SelectItem value="no-categories" disabled>
                            No hay más categorías de gasto disponibles para presupuestar.
                          </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {!!budget && <p className="text-xs text-muted-foreground pt-1">La categoría no se puede cambiar al editar un presupuesto.</p>}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Objetivo (CLP)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 150000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={availableCategories.length === 0 && !budget}>Guardar Objetivo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
