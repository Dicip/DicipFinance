'use client';

import { AppHeader } from '@/components/layout/AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useDataMode } from '@/hooks/useDataMode';
import { Skeleton } from '@/components/ui/skeleton';

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
              El cambio de modo recargará la aplicación.
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
                {mode === 'online' ? 'Modo Online (Simulado)' : 'Modo Offline'}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground">
              {mode === 'online'
                ? "La aplicación está usando datos simulados para el modo online. La integración real con una base de datos (ej. Firebase) está pendiente."
                : "La aplicación está usando datos locales almacenados en el navegador para pruebas y desarrollo."}
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
