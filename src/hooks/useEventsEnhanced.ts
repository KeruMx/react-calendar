import { useState, useCallback, useRef } from 'react';
import { Event } from '../lib/types';

// Tipos para async operations (opcionales)
export type AsyncEventHandler<T extends any[], R = void> = (...args: T) => Promise<R>;
export type SyncEventHandler<T extends any[], R = void> = (...args: T) => R;

export interface UseEventsConfig {
  // Callbacks síncronos (mantener compatibilidad)
  onAddEvent?: SyncEventHandler<[Event]>;
  onUpdateEvent?: SyncEventHandler<[string, Partial<Event>]>;
  onDeleteEvent?: SyncEventHandler<[string]>;
  
  // Callbacks asíncronos (nuevos)
  onAddEventAsync?: AsyncEventHandler<[Event], boolean>;
  onUpdateEventAsync?: AsyncEventHandler<[string, Partial<Event>], boolean>;
  onDeleteEventAsync?: AsyncEventHandler<[string], boolean>;
  
  // Configuración de optimistic updates
  enableOptimisticUpdates?: boolean;
  
  // Callback para errores
  onError?: (error: Error, operation: 'add' | 'update' | 'delete', data?: any) => void;
}

export interface UseEventsReturn {
  // Estado de los eventos
  events: Event[];
  
  // Estados de operaciones
  loading: {
    add: boolean;
    update: string | null; // ID del evento que se está actualizando
    delete: string | null; // ID del evento que se está eliminando
    global: boolean; // True si hay cualquier operación en curso
  };
  
  // Operaciones principales (mantener compatibilidad)
  addEvent: (event: Event) => Promise<boolean>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<boolean>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  replaceEvents: (newEvents: Event[]) => void;
  
  // Operaciones explícitamente síncronas
  addEventSync: (event: Event) => void;
  updateEventSync: (eventId: string, updates: Partial<Event>) => void;
  deleteEventSync: (eventId: string) => void;
  
  // Operaciones explícitamente asíncronas
  addEventAsync: (event: Event) => Promise<boolean>;
  updateEventAsync: (eventId: string, updates: Partial<Event>) => Promise<boolean>;
  deleteEventAsync: (eventId: string) => Promise<boolean>;
  
  // Utilidades
  getEventById: (eventId: string) => Event | undefined;
  clearEvents: () => void;
}

export default function useEvents(
  initialEvents: Event[] = [],
  config: UseEventsConfig = {}
): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState({
    add: false,
    update: null as string | null,
    delete: null as string | null,
    global: false
  });
  
  // Referencias para rollback en caso de error
  const rollbackRef = useRef<{
    events: Event[];
    operation: string;
  } | null>(null);

  const {
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onAddEventAsync,
    onUpdateEventAsync,
    onDeleteEventAsync,
    enableOptimisticUpdates = true,
    onError
  } = config;

  // Utilidades para manejar loading states
  const setLoadingState = useCallback((updates: Partial<typeof loading>) => {
    setLoading(prev => {
      const newState = { ...prev, ...updates };
      newState.global = newState.add || !!newState.update || !!newState.delete;
      return newState;
    });
  }, []);

  // Operaciones síncronas base
  const addEventSync = useCallback((event: Event) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEventSync = useCallback((eventId: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  }, []);

  const deleteEventSync = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const replaceEvents = useCallback((newEvents: Event[]) => {
    setEvents(newEvents);
  }, []);

  // Operaciones asíncronas con optimistic updates
  const addEventAsync = useCallback(async (event: Event): Promise<boolean> => {
    if (!onAddEventAsync) {
      // Fallback a sync si no hay handler async
      addEventSync(event);
      onAddEvent?.(event);
      return true;
    }

    setLoadingState({ add: true });
    
    try {
      if (enableOptimisticUpdates) {
        // Guardar estado para rollback
        rollbackRef.current = { events, operation: 'add' };
        addEventSync(event);
      }

      const success = await onAddEventAsync(event);
      
      if (!success && enableOptimisticUpdates) {
        // Rollback optimistic update
        setEvents(rollbackRef.current?.events || []);
      } else if (!enableOptimisticUpdates && success) {
        // Aplicar cambio solo si fue exitoso y no hay optimistic updates
        addEventSync(event);
      }

      return success;
    } catch (error) {
      if (enableOptimisticUpdates) {
        // Rollback en caso de error
        setEvents(rollbackRef.current?.events || []);
      }
      
      onError?.(error instanceof Error ? error : new Error('Unknown error'), 'add', event);
      return false;
    } finally {
      setLoadingState({ add: false });
      rollbackRef.current = null;
    }
  }, [events, onAddEventAsync, onAddEvent, addEventSync, enableOptimisticUpdates, onError, setLoadingState]);

  const updateEventAsync = useCallback(async (eventId: string, updates: Partial<Event>): Promise<boolean> => {
    if (!onUpdateEventAsync) {
      // Fallback a sync si no hay handler async
      updateEventSync(eventId, updates);
      onUpdateEvent?.(eventId, updates);
      return true;
    }

    const originalEvent = events.find(e => e.id === eventId);
    if (!originalEvent) {
      onError?.(new Error('Event not found'), 'update', { eventId, updates });
      return false;
    }

    setLoadingState({ update: eventId });
    
    try {
      if (enableOptimisticUpdates) {
        rollbackRef.current = { events, operation: 'update' };
        updateEventSync(eventId, updates);
      }

      const success = await onUpdateEventAsync(eventId, updates);
      
      if (!success && enableOptimisticUpdates) {
        setEvents(rollbackRef.current?.events || []);
      } else if (!enableOptimisticUpdates && success) {
        updateEventSync(eventId, updates);
      }

      return success;
    } catch (error) {
      if (enableOptimisticUpdates) {
        setEvents(rollbackRef.current?.events || []);
      }
      
      onError?.(error instanceof Error ? error : new Error('Unknown error'), 'update', { eventId, updates });
      return false;
    } finally {
      setLoadingState({ update: null });
      rollbackRef.current = null;
    }
  }, [events, onUpdateEventAsync, onUpdateEvent, updateEventSync, enableOptimisticUpdates, onError, setLoadingState]);

  const deleteEventAsync = useCallback(async (eventId: string): Promise<boolean> => {
    if (!onDeleteEventAsync) {
      // Fallback a sync si no hay handler async
      deleteEventSync(eventId);
      onDeleteEvent?.(eventId);
      return true;
    }

    const originalEvent = events.find(e => e.id === eventId);
    if (!originalEvent) {
      onError?.(new Error('Event not found'), 'delete', eventId);
      return false;
    }

    setLoadingState({ delete: eventId });
    
    try {
      if (enableOptimisticUpdates) {
        rollbackRef.current = { events, operation: 'delete' };
        deleteEventSync(eventId);
      }

      const success = await onDeleteEventAsync(eventId);
      
      if (!success && enableOptimisticUpdates) {
        setEvents(rollbackRef.current?.events || []);
      } else if (!enableOptimisticUpdates && success) {
        deleteEventSync(eventId);
      }

      return success;
    } catch (error) {
      if (enableOptimisticUpdates) {
        setEvents(rollbackRef.current?.events || []);
      }
      
      onError?.(error instanceof Error ? error : new Error('Unknown error'), 'delete', eventId);
      return false;
    } finally {
      setLoadingState({ delete: null });
      rollbackRef.current = null;
    }
  }, [events, onDeleteEventAsync, onDeleteEvent, deleteEventSync, enableOptimisticUpdates, onError, setLoadingState]);

  // Operaciones principales (compatibilidad)
  const addEvent = useCallback(async (event: Event): Promise<boolean> => {
    if (onAddEventAsync) {
      return await addEventAsync(event);
    } else {
      addEventSync(event);
      onAddEvent?.(event);
      return true;
    }
  }, [onAddEventAsync, addEventAsync, addEventSync, onAddEvent]);

  const updateEvent = useCallback(async (eventId: string, updates: Partial<Event>): Promise<boolean> => {
    if (onUpdateEventAsync) {
      return await updateEventAsync(eventId, updates);
    } else {
      updateEventSync(eventId, updates);
      onUpdateEvent?.(eventId, updates);
      return true;
    }
  }, [onUpdateEventAsync, updateEventAsync, updateEventSync, onUpdateEvent]);

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    if (onDeleteEventAsync) {
      return await deleteEventAsync(eventId);
    } else {
      deleteEventSync(eventId);
      onDeleteEvent?.(eventId);
      return true;
    }
  }, [onDeleteEventAsync, deleteEventAsync, deleteEventSync, onDeleteEvent]);

  // Utilidades
  const getEventById = useCallback((eventId: string) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  return {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    replaceEvents,
    addEventSync,
    updateEventSync,
    deleteEventSync,
    addEventAsync,
    updateEventAsync,
    deleteEventAsync,
    getEventById,
    clearEvents
  };
}
