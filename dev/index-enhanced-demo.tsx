import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from '../src';
import '../src/index.css';
import { Event } from '../src/lib/types';
import { addHours } from "date-fns";
import useEventsEnhanced from '../src/hooks/useEventsEnhanced';

// Simulación de API (esto sería implementado por el usuario del paquete)
const mockAPI = {
  async addEvent(event: Event): Promise<boolean> {
    console.log('API: Adding event', event);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular latencia
    
    // Simular 10% de probabilidad de error
    if (Math.random() < 0.1) {
      throw new Error('Server error: Failed to add event');
    }
    
    return true;
  },

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<boolean> {
    console.log('API: Updating event', eventId, updates);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (Math.random() < 0.1) {
      throw new Error('Server error: Failed to update event');
    }
    
    return true;
  },

  async deleteEvent(eventId: string): Promise<boolean> {
    console.log('API: Deleting event', eventId);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (Math.random() < 0.1) {
      throw new Error('Server error: Failed to delete event');
    }
    
    return true;
  }
};

const AppWithEnhancedHook = () => {
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

  const {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useEventsEnhanced(initialEvents, {
    // Callbacks asíncronos - El usuario del paquete los implementa
    onAddEventAsync: mockAPI.addEvent,
    onUpdateEventAsync: mockAPI.updateEvent,
    onDeleteEventAsync: mockAPI.deleteEvent,
    
    // Configuración
    enableOptimisticUpdates: true,
    
    // Manejo de errores
    onError: (error, operation, data) => {
      console.error(`Error in ${operation}:`, error.message, data);
      alert(`Error: ${error.message}`);
    }
  });

  // Los handlers que pasa al Calendar son los mismos de siempre
  // El hook se encarga de toda la lógica async internamente
  const handleAddEvent = async (event: Event) => {
    const success = await addEvent(event);
    if (success) {
      console.log('Event added successfully!');
    }
  };

  const handleUpdateEvent = async (eventId: string, updates: Partial<Event>) => {
    const success = await updateEvent(eventId, updates);
    if (success) {
      console.log('Event updated successfully!');
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId);
    if (success) {
      console.log('Event deleted successfully!');
    }
  };

  return (
    <>
      <div className='flex flex-col h-screen'>
        {/* Header con indicadores de estado */}
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Enhanced Calendar</h1>
            
            {/* Indicadores de loading */}
            <div className="flex items-center space-x-4">
              {loading.add && (
                <div className="flex items-center text-blue-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                  Adding event...
                </div>
              )}
              
              {loading.update && (
                <div className="flex items-center text-yellow-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></div>
                  Updating event...
                </div>
              )}
              
              {loading.delete && (
                <div className="flex items-center text-red-600 text-sm">
                  <div className="animate-spin w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full mr-2"></div>
                  Deleting event...
                </div>
              )}

              {!loading.global && (
                <div className="text-green-600 text-sm">Ready</div>
              )}
            </div>
          </div>
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

// Ejemplo de uso SOLO SÍNCRONO (para compatibilidad total con versión anterior)
const AppSyncOnly = () => {
  const date = new Date();
  
  const initialEvents: Event[] = [
    {
      id: "sync-event-1",
      title: "Sync Event",
      start: new Date(),
      end: addHours(new Date(), 1),
    },
  ];

  // Usar el hook SIN configuración async - funciona exactamente como antes
  const {
    events,
    addEventSync: addEvent,
    updateEventSync: updateEvent,
    deleteEventSync: deleteEvent,
  } = useEventsEnhanced(initialEvents);

  return (
    <div className='flex flex-col h-screen'>
      <div className="p-4 bg-white border-b">
        <h1 className="text-xl font-semibold">Sync-Only Calendar (Backward Compatible)</h1>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <Calendar 
          date={date} 
          events={events}
          onAddEvent={addEvent}
          onUpdateEvent={updateEvent}
          onDeleteEvent={deleteEvent}
        />
      </div>
    </div>
  );
};

// Renderizar la versión que prefieras
const container = document.getElementById('app');
const root = createRoot(container!);

// Cambiar entre estas dos líneas para probar diferentes modos:
root.render(<AppWithEnhancedHook />); // Con async
// root.render(<AppSyncOnly />); // Solo sync (compatible con versión anterior)
