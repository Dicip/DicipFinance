'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DataMode } from '@/lib/types';
import { useToast } from './use-toast';

const DATA_MODE_KEY = 'appDataMode';

export function useDataMode() {
  const [mode, setMode] = useState<DataMode>('offline'); // Default to offline initially
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Ensure localStorage is only accessed on the client
    try {
      const storedMode = localStorage.getItem(DATA_MODE_KEY) as DataMode | null;
      if (storedMode && (storedMode === 'online' || storedMode === 'offline')) {
        setMode(storedMode);
      } else {
        localStorage.setItem(DATA_MODE_KEY, 'offline'); // Set default if not present or invalid
        setMode('offline');
      }
    } catch (error) {
      console.warn('No se pudo acceder a localStorage para el modo de datos, usando offline por defecto.', error);
      setMode('offline');
    }
    setIsInitialized(true);
  }, []);

  const toggleDataMode = useCallback(() => {
    if (!isInitialized) return; 

    setMode((prevMode) => {
      const newMode = prevMode === 'online' ? 'offline' : 'online';
      try {
        localStorage.setItem(DATA_MODE_KEY, newMode);
        toast({
          title: "Modo de Datos Actualizado",
          description: `Cambiado a modo ${newMode === 'online' ? 'Online' : 'Offline'}. La página se recargará.`,
        });
        // Short delay to allow toast to appear before reload
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
         console.error('No se pudo guardar el modo de datos en localStorage.', error);
         toast({
          title: "Error",
          description: "No se pudo cambiar el modo de datos.",
          variant: "destructive",
        });
      }
      return newMode;
    });
  }, [isInitialized, toast]);

  return { mode, toggleDataMode, isInitialized };
}
