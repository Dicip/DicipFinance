
'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDataMode } from '@/hooks/useDataMode';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function SettingsPage() {
  const { mode, toggleDataMode, isInitialized } = useDataMode();

  if (!isInitialized) {
    return (
      <>
        <AppHeader title="Configuración" />
        <main className="flex-1 p-4 md:p-6 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Modo de Datos</CardTitle>
              <CardDescription>
                Selecciona si la aplicación debe usar datos locales (offline) o conectarse a una base de datos (online).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-full max-w-md" />
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Configuración" />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Modo de Datos</CardTitle>
            <CardDescription>
              Selecciona si la aplicación debe usar datos locales (offline) o conectarse a una base de datos (online).
              El cambio de modo recargará la aplicación para aplicar la nueva fuente de datos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 pt-2">
              <Switch
                id="data-mode-switch"
                checked={mode === 'online'}
                onCheckedChange={toggleDataMode}
                aria-label={`Cambiar a modo ${mode === 'online' ? 'offline' : 'online'}`}
              />
              <Label htmlFor="data-mode-switch" className="text-base">
                {mode === 'online' ? 'Modo Online' : 'Modo Offline'}
              </Label>
            </div>
            {mode === 'online' && (
              <Alert className="border-blue-500 text-blue-700 dark:border-blue-400 dark:text-blue-300">
                <Info className="h-4 w-4 !text-blue-600 dark:!text-blue-400" />
                <AlertTitle>Información del Modo Online</AlertTitle>
                <AlertDescription>
                  En modo online, la aplicación intentará conectarse a una base de datos para obtener y guardar tus datos.
                  Si no hay conexión o es una cuenta nueva, es posible que no veas ninguna información inicialmente.
                  La implementación completa de la funcionalidad de base de datos está pendiente.
                </AlertDescription>
              </Alert>
            )}
            {mode === 'offline' && (
               <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Información del Modo Offline</AlertTitle>
                <AlertDescription>
                  En modo offline, la aplicación utiliza datos de ejemplo almacenados localmente.
                  Estos datos son solo para demostración y pruebas, y no se sincronizan con ninguna base de datos externa.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
