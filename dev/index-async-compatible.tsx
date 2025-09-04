import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from '../src';
import '../src/index.css';
import { Event } from '../src/lib/types';
import { addHours } from "date-fns";
import useEvents from '../src/hooks/useEvents';
import { EventsAPI } from '../src/lib/api';

const AppWithAsyncSupport = () => {
  const date = new Date();
  
  const initialEvents: Event[] = [
    {
      id: "test-event-1",
      title: "Test Event (3 hours)",
      start: new Date(),
      end: addHours(new Date(), 2.5),
    },
    {
      id: "test-event-2",
      title: "Test Event (2 hours)",
      start: new Date(),
      end: addHours(new Date(), 2),
    },
    {
      id: "test-event-3",
      title: "Test Event (4.5 hours)",
      start: new Date(),
      end: addHours(new Date(), 2),
    },
    {
      id: "test-event-4",
      title: "Test Event (2++ hours)",
      start: addHours(new Date(), 3.5),
      end: addHours(new Date(), 4.5),
      color: "bg-red-400"
    },
  ];

  const { events, addEvent, updateEvent, deleteEvent } = useEvents(initialEvents);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Wrapper functions para manejar async operations con optimistic updates
  const handleAddEvent = async (event: Event) => {
    setLoading(true);
    setError(null);
    
    try {
      // Optimistic update - agregar inmediatamente a la UI
      addEvent(event);
      
      // Llamada async a la API
      const { id, ...eventWithoutId } = event;
      const result = await EventsAPI.addEvent(eventWithoutId);
      
      if (!result.success) {
        // Si falla, revertir el optimistic update
        deleteEvent(event.id);
        setError(result.error || 'Error al agregar evento');
      } else if (result.data) {
        // Actualizar con el evento real del servidor (nuevo ID, etc.)
        updateEvent(event.id, result.data);
      }
    } catch (error) {
      // Revertir optimistic update en caso de error
      deleteEvent(event.id);
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    setLoading(true);
    setError(null);
    
    // Guardar el estado original para rollback
    const originalEvent = events.find(e => e.id === eventId);
    
    try {
      // Optimistic update
      updateEvent(eventId, updates);
      
      // Llamada async a la API
      const result = await EventsAPI.updateEvent(eventId, updates);
      
      if (!result.success) {
        // Revertir si falla
        if (originalEvent) {
          updateEvent(eventId, originalEvent);
        }
        setError(result.error || 'Error al actualizar evento');
      }
    } catch (error) {
      // Revertir en caso de error
      if (originalEvent) {
        updateEvent(eventId, originalEvent);
      }
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    setLoading(true);
    setError(null);
    
    // Guardar el evento para rollback
    const originalEvent = events.find(e => e.id === eventId);
    
    try {
      // Optimistic update
      deleteEvent(eventId);
      
      // Llamada async a la API
      const result = await EventsAPI.deleteEvent(eventId);
      
      if (!result.success) {
        // Revertir si falla
        if (originalEvent) {
          addEvent(originalEvent);
        }
        setError(result.error || 'Error al eliminar evento');
      }
    } catch (error) {
      // Revertir en caso de error
      if (originalEvent) {
        addEvent(originalEvent);
      }
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <>
      <div className='flex flex-col h-screen'>
        {/* Header con indicadores de estado */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Calendario con Soporte Async</h1>
            
            {/* Indicador de loading */}
            {loading && (
              <div className="flex items-center text-blue-600 text-sm">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                Procesando...
              </div>
            )}
          </div>

          {/* Mostrar errores */}
          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button 
                onClick={clearError}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto">
          <Calendar 
            date={date} 
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </div>
      </div>
    </>
  );
};

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<AppWithAsyncSupport />);
