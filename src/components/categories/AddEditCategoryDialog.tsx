
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/types";
import { iconMap } from "@/lib/data"; // Using the exported map
import { Palette } from "lucide-react";

// Define a list of available icons for selection
const availableIcons = Object.keys(iconMap).map(name => ({
  name,
  Component: iconMap[name] || Palette,
}));

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  type: z.enum(['income', 'expense'], { required_error: "Debes seleccionar un tipo." }),
  iconName: z.string().min(1, "Debes seleccionar un icono."),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser un código hexadecimal válido (ej: #RRGGBB).")
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditCategoryDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit: (data: Omit<Category, 'id' | 'icon'> & { id?: string }) => void; // id is optional for new categories
  category: Category | null; // Category to edit, or null for new
}

export function AddEditCategoryDialog({
  isOpen,
  setIsOpen,
  onSubmit,
  category,
}: AddEditCategoryDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "expense",
      iconName: availableIcons[0]?.name || "Palette",
      color: "#FF6384",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        type: category.type,
        iconName: category.iconName,
        color: category.color,
      });
    } else {
      form.reset({ // Reset to default for new category
        name: "",
        type: "expense",
        iconName: availableIcons[0]?.name || "Palette",
        color: "#FF6384",
      });
    }
  }, [category, form, isOpen]); // Add isOpen to reset form when dialog reopens for 'new'

  function handleSubmit(values: FormValues) {
    if (category) {
      onSubmit({ ...values, id: category.id });
    } else {
      onSubmit(values);
    }
  }

  const dialogTitle = category ? "Editar Categoría" : "Agregar Nueva Categoría";
  const dialogDescription = category
    ? "Modifica los detalles de la categoría."
    : "Ingresa los detalles para la nueva categoría.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset(); // Ensure form resets when closing via X or overlay click
        setEditingCategory(null); // Parent should handle this ideally
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Categoría</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Comida, Sueldo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Categoría</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Gasto</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="income" />
                        </FormControl>
                        <FormLabel className="font-normal">Ingreso</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icono</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un icono" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableIcons.map(({ name, Component }) => (
                        <SelectItem key={name} value={name}>
                          <div className="flex items-center">
                            <Component className="mr-2 h-4 w-4" />
                            {name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                     <div className="flex items-center gap-2">
                        <Input type="color" {...field} className="p-1 h-10 w-14" />
                        <Input type="text" {...field} placeholder="#RRGGBB" className="w-full" />
                     </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => { form.reset(); setEditingCategory(null); }}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Guardar Categoría</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to ensure form resets (needed if setEditingCategory is managed by parent)
// This is a bit of a workaround for ShadCN Dialog not always unmounting children.
// Ideally, the parent `categories/page.tsx` would call `form.reset()` when `setEditingCategory(null)`.
// The `useEffect` in this component now also depends on `isOpen` to help with resets.
function setEditingCategory(category: Category | null) {
  // This is a placeholder. The actual state update happens in the parent.
  // This function is here to satisfy the DialogClose onClick if needed.
}
