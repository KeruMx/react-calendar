import { useState, useCallback } from 'react';
import { Event, AsyncState, EventOperationResult } from '../lib/types-improved';

interface UseAsyncEventsReturn {
  // Estado de los eventos
  events: Event[];
  
  // Estados de carga y error
  states: {
    loading: boolean;
    error: string | null;
    addingEvent: boolean;
    updatingEvent: string | null; // ID del evento que se está actualizando
    deletingEvent: string | null; // ID del evento que se está eliminando
  };
  
  // Operaciones síncronas (inmediatas)
  addEventSync: (event: Event) => void;
  updateEventSync: (eventId: string, updates: Partial<Event>) => void;
  deleteEventSync: (eventId: string) => void;
  replaceEvents: (newEvents: Event[]) => void;
  
  // Operaciones asíncronas
  addEventAsync: (
    event: Omit<Event, 'id'>, 
    apiCall: (event: Omit<Event, 'id'>) => Promise<EventOperationResult>
  ) => Promise<boolean>;
  
  updateEventAsync: (
    eventId: string, 
    updates: Partial<Event>,
    apiCall: (eventId: string, updates: Partial<Event>) => Promise<EventOperationResult>
  ) => Promise<boolean>;
  
  deleteEventAsync: (
    eventId: string,
    apiCall: (eventId: string) => Promise<EventOperationResult>
  ) => Promise<boolean>;
  
  // Utilidades
  clearError: () => void;
  getEventById: (eventId: string) => Event | undefined;
}

export default function useAsyncEvents(initialEvents: Event[] = []): UseAsyncEventsReturn {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [states, setStates] = useState({
    loading: false,
    error: null as string | null,
    addingEvent: false,
    updatingEvent: null as string | null,
    deletingEvent: null as string | null,
  });

  // Operaciones síncronas (para compatibilidad y operaciones locales)
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
  const addEventAsync = useCallback(async (
    event: Omit<Event, 'id'>, 
    apiCall: (event: Omit<Event, 'id'>) => Promise<EventOperationResult>
  ): Promise<boolean> => {
    // Crear evento temporal con ID temporal
    const tempId = `temp-${Date.now()}`;
    const tempEvent: Event = { ...event, id: tempId };
    
    try {
      setStates(prev => ({ ...prev, addingEvent: true, error: null }));
      
      // Optimistic update
      addEventSync(tempEvent);
      
      // Llamada a la API
      const result = await apiCall(event);
      
      if (result.success && result.data) {
        // Reemplazar evento temporal con el real
        setEvents(prev => prev.map(e => 
          e.id === tempId ? result.data! : e
        ));
        return true;
      } else {
        // Revertir optimistic update
        deleteEventSync(tempId);
        setStates(prev => ({ 
          ...prev, 
          error: result.error || 'Error al agregar evento' 
        }));
        return false;
      }
    } catch (error) {
      // Revertir optimistic update
      deleteEventSync(tempId);
      setStates(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
      return false;
    } finally {
      setStates(prev => ({ ...prev, addingEvent: false }));
    }
  }, [addEventSync, deleteEventSync]);

  const updateEventAsync = useCallback(async (
    eventId: string, 
    updates: Partial<Event>,
    apiCall: (eventId: string, updates: Partial<Event>) => Promise<EventOperationResult>
  ): Promise<boolean> => {
    // Guardar estado anterior para rollback
    const originalEvent = events.find(e => e.id === eventId);
    if (!originalEvent) {
      setStates(prev => ({ ...prev, error: 'Evento no encontrado' }));
      return false;
    }

    try {
      setStates(prev => ({ 
        ...prev, 
        updatingEvent: eventId, 
        error: null 
      }));
      
      // Optimistic update
      updateEventSync(eventId, updates);
      
      // Llamada a la API
      const result = await apiCall(eventId, updates);
      
      if (result.success) {
        // Si la API devuelve datos actualizados, usarlos
        if (result.data) {
          updateEventSync(eventId, result.data);
        }
        return true;
      } else {
        // Revertir optimistic update
        setEvents(prev => prev.map(e => 
          e.id === eventId ? originalEvent : e
        ));
        setStates(prev => ({ 
          ...prev, 
          error: result.error || 'Error al actualizar evento' 
        }));
        return false;
      }
    } catch (error) {
      // Revertir optimistic update
      setEvents(prev => prev.map(e => 
        e.id === eventId ? originalEvent : e
      ));
      setStates(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
      return false;
    } finally {
      setStates(prev => ({ ...prev, updatingEvent: null }));
    }
  }, [events, updateEventSync]);

  const deleteEventAsync = useCallback(async (
    eventId: string,
    apiCall: (eventId: string) => Promise<EventOperationResult>
  ): Promise<boolean> => {
    // Guardar evento para rollback
    const originalEvent = events.find(e => e.id === eventId);
    if (!originalEvent) {
      setStates(prev => ({ ...prev, error: 'Evento no encontrado' }));
      return false;
    }

    try {
      setStates(prev => ({ 
        ...prev, 
        deletingEvent: eventId, 
        error: null 
      }));
      
      // Optimistic update
      deleteEventSync(eventId);
      
      // Llamada a la API
      const result = await apiCall(eventId);
      
      if (result.success) {
        return true;
      } else {
        // Revertir optimistic update
        addEventSync(originalEvent);
        setStates(prev => ({ 
          ...prev, 
          error: result.error || 'Error al eliminar evento' 
        }));
        return false;
      }
    } catch (error) {
      // Revertir optimistic update
      addEventSync(originalEvent);
      setStates(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
      return false;
    } finally {
      setStates(prev => ({ ...prev, deletingEvent: null }));
    }
  }, [events, deleteEventSync, addEventSync]);

  // Utilidades
  const clearError = useCallback(() => {
    setStates(prev => ({ ...prev, error: null }));
  }, []);

  const getEventById = useCallback((eventId: string) => {
    return events.find(e => e.id === eventId);
  }, [events]);

  return {
    events,
    states,
    addEventSync,
    updateEventSync,
    deleteEventSync,
    replaceEvents,
    addEventAsync,
    updateEventAsync,
    deleteEventAsync,
    clearError,
    getEventById
  };
}
