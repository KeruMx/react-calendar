import { useState, useCallback } from 'react';
import { Event } from '../lib/types';

/**
 * Hook básico para manejo de eventos (Retrocompatible)
 * 
 * Para funcionalidades async avanzadas, usar `useEventsEnhanced` que incluye:
 * - Optimistic updates
 * - Loading states
 * - Error handling
 * - Rollback automático
 * - Compatibilidad sync/async
 */
export default function useEvents(initialEvents: Event[] = []) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = useCallback((event: Event) => {
    setEvents(prev => [...prev, event]);
  }, []);

  const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, ...updates } : event
    ));
  }, []);

  const deleteEvent = useCallback((eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  }, []);

  const replaceEvents = useCallback((newEvents: Event[]) => {
    setEvents(newEvents);
  }, []);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    replaceEvents
  };
}
