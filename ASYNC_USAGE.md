# React Calendar EA - Async Support

## Uso del Hook `useEventsEnhanced`

El hook `useEventsEnhanced` es una versión avanzada de `useEvents` que soporta operaciones asíncronas manteniendo compatibilidad total con la versión anterior.

**📦 Repositorio:** https://github.com/KeruMx/react-calendar  
**📋 NPM:** https://www.npmjs.com/package/@eadev/react-calendar

### Características

- ✅ **100% Retrocompatible** con `useEvents`
- ✅ **Optimistic Updates** para mejor UX
- ✅ **Loading States** granulares
- ✅ **Rollback automático** en caso de error
- ✅ **Dual Mode**: Sync y Async
- ✅ **Error Handling** integrado

### Uso Básico (Solo Síncrono)

```tsx
import { Calendar, useEventsEnhanced } from '@eadev/react-calendar';

function MyApp() {
  const { events, addEventSync, updateEventSync, deleteEventSync } = useEventsEnhanced(initialEvents);
  
  return (
    <Calendar 
      date={new Date()}
      events={events}
      onAddEvent={addEventSync}
      onUpdateEvent={updateEventSync}
      onDeleteEvent={deleteEventSync}
    />
  );
}
```

### Uso Avanzado (Con Async)

```tsx
import { Calendar, useEventsEnhanced } from '@eadev/react-calendar';

function MyApp() {
  const {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  } = useEventsEnhanced(initialEvents, {
    // Implementa tus llamadas a API
    onAddEventAsync: async (event) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(event)
      });
      return response.ok;
    },
    
    onUpdateEventAsync: async (eventId, updates) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response.ok;
    },
    
    onDeleteEventAsync: async (eventId) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE'
      });
      return response.ok;
    },
    
    // Configuración
    enableOptimisticUpdates: true,
    
    // Manejo de errores
    onError: (error, operation, data) => {
      console.error(`Error in ${operation}:`, error.message);
      // Mostrar notificación al usuario
      showErrorToast(error.message);
    }
  });

  // Los handlers son promesas que puedes await
  const handleAddEvent = async (event) => {
    const success = await addEvent(event);
    if (success) {
      showSuccessToast('Evento creado!');
    }
  };

  return (
    <>
      {/* Indicadores de loading */}
      {loading.global && <LoadingSpinner />}
      
      <Calendar 
        date={new Date()}
        events={events}
        onAddEvent={handleAddEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
      />
    </>
  );
}
```

### Estados de Loading

```tsx
const { loading } = useEventsEnhanced(events, config);

// loading.global - true si hay cualquier operación en curso
// loading.add - true si se está agregando un evento
// loading.update - ID del evento que se está actualizando (o null)
// loading.delete - ID del evento que se está eliminando (o null)

return (
  <div>
    {loading.add && <div>Agregando evento...</div>}
    {loading.update && <div>Actualizando evento {loading.update}...</div>}
    {loading.delete && <div>Eliminando evento {loading.delete}...</div>}
  </div>
);
```

### Configuración Completa

```tsx
interface UseEventsConfig {
  // Callbacks síncronos (para compatibilidad)
  onAddEvent?: (event: Event) => void;
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void;
  onDeleteEvent?: (eventId: string) => void;
  
  // Callbacks asíncronos (nuevos)
  onAddEventAsync?: (event: Event) => Promise<boolean>;
  onUpdateEventAsync?: (eventId: string, updates: Partial<Event>) => Promise<boolean>;
  onDeleteEventAsync?: (eventId: string) => Promise<boolean>;
  
  // Optimistic updates (default: true)
  enableOptimisticUpdates?: boolean;
  
  // Manejo de errores
  onError?: (error: Error, operation: 'add' | 'update' | 'delete', data?: any) => void;
}
```

### Migración desde `useEvents`

El nuevo hook es 100% compatible:

```tsx
// ANTES
const { events, addEvent, updateEvent, deleteEvent } = useEvents(initialEvents);

// DESPUÉS - Mismo comportamiento
const { events, addEventSync: addEvent, updateEventSync: updateEvent, deleteEventSync: deleteEvent } = useEventsEnhanced(initialEvents);

// O usar las versiones que soportan async automáticamente
const { events, addEvent, updateEvent, deleteEvent } = useEventsEnhanced(initialEvents, {
  onAddEventAsync: myAddAPI,
  onUpdateEventAsync: myUpdateAPI, 
  onDeleteEventAsync: myDeleteAPI
});
```

### Flujo Optimistic Updates

1. **Usuario realiza acción** → UI se actualiza inmediatamente
2. **Llamada async en background** → Loading state activo
3. **Si éxito** → Cambio se mantiene
4. **Si error** → Rollback automático + callback de error

### Ejemplos de Implementación de API

```tsx
// Ejemplo con fetch
const apiConfig = {
  onAddEventAsync: async (event) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
};

// Ejemplo con axios
const apiConfig = {
  onAddEventAsync: async (event) => {
    try {
      await axios.post('/api/events', event);
      return true;
    } catch {
      return false;
    }
  }
};

// Ejemplo con GraphQL
const apiConfig = {
  onAddEventAsync: async (event) => {
    try {
      const result = await client.mutate({
        mutation: CREATE_EVENT,
        variables: { input: event }
      });
      return !result.errors;
    } catch {
      return false;
    }
  }
};
```
