import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from '../src';
import '../src/index.css';
import { Event } from '../src/lib/types-improved';
import { addHours } from "date-fns";
import useAsyncEvents from '../src/hooks/useAsyncEvents';
import { EventsAPI } from '../src/lib/api';

const App = () => {
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
    {
      id: "test-event-5",
      title: "Test Event (4.5 hours)",
      start: addHours(new Date(), 1.5),
      end: addHours(new Date(), 2.5),
    },
    {
      id: "test-event-6",
      title: "Test Event (6.5 hours)",
      start: addHours(new Date(), 8.5),
      end: addHours(new Date(), 9.5),
    },
  ];

  const {
    events,
    states,
    addEventAsync,
    updateEventAsync,
    deleteEventAsync,
    clearError
  } = useAsyncEvents(initialEvents);

  // Handlers que conectan con la API
  const handleAddEvent = async (event: Event) => {
    const { id, ...eventWithoutId } = event; // Remover ID para creación
    const success = await addEventAsync(eventWithoutId, EventsAPI.addEvent);
    
    if (success) {
      console.log('Evento agregado exitosamente');
    } else {
      console.error('Error al agregar evento');
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    const success = await updateEventAsync(eventId, updates, EventsAPI.updateEvent);
    
    if (success) {
      console.log('Evento actualizado exitosamente');
    } else {
      console.error('Error al actualizar evento');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEventAsync(eventId, EventsAPI.deleteEvent);
    
    if (success) {
      console.log('Evento eliminado exitosamente');
    } else {
      console.error('Error al eliminar evento');
    }
  };

  return (
    <>
      <div className='flex flex-col h-screen'>
        {/* Header con indicadores de estado */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Calendario</h1>
            
            {/* Indicadores de estado */}
            <div className="flex items-center space-x-4">
              {states.addingEvent && (
                <div className="flex items-center text-blue-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Agregando evento...
                </div>
              )}
              
              {states.updatingEvent && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></div>
                  Actualizando evento...
                </div>
              )}
              
              {states.deletingEvent && (
                <div className="flex items-center text-red-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                  Eliminando evento...
                </div>
              )}
            </div>
          </div>

          {/* Mostrar errores globales */}
          {states.error && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-md p-3 text-red-700 text-sm flex items-center justify-between">
              <span>{states.error}</span>
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
            loading={states.loading}
            error={states.error}
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
root.render(<App />);
