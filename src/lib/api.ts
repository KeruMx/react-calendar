// API simulada para eventos - Reemplaza esto con tu API real
import { Event, EventOperationResult } from '../lib/types-improved';

// Simular latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generar ID único
const generateId = () => `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export class EventsAPI {
  // Simular agregar evento
  static async addEvent(event: Omit<Event, 'id'>): Promise<EventOperationResult> {
    try {
      await delay(1000); // Simular latencia
      
      // Simular posible error (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error del servidor al crear evento');
      }

      const newEvent: Event = {
        ...event,
        id: generateId()
      };

      console.log('API: Evento creado', newEvent);
      
      return {
        success: true,
        data: newEvent
      };
    } catch (error) {
      console.error('API Error adding event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Simular actualizar evento
  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<EventOperationResult> {
    try {
      await delay(800); // Simular latencia
      
      // Simular posible error (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error del servidor al actualizar evento');
      }

      console.log('API: Evento actualizado', { eventId, updates });
      
      return {
        success: true,
        data: { ...updates, id: eventId } as Event
      };
    } catch (error) {
      console.error('API Error updating event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Simular eliminar evento
  static async deleteEvent(eventId: string): Promise<EventOperationResult> {
    try {
      await delay(600); // Simular latencia
      
      // Simular posible error (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Error del servidor al eliminar evento');
      }

      console.log('API: Evento eliminado', eventId);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('API Error deleting event:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  // Simular obtener eventos
  static async fetchEvents(): Promise<Event[]> {
    try {
      await delay(1500); // Simular latencia más larga para carga inicial
      
      // Simular posible error (5% de probabilidad)
      if (Math.random() < 0.05) {
        throw new Error('Error del servidor al cargar eventos');
      }

      const events: Event[] = [
        // Aquí irían los eventos del servidor
      ];

      console.log('API: Eventos cargados', events);
      return events;
    } catch (error) {
      console.error('API Error fetching events:', error);
      throw error;
    }
  }
}

// Configuración para desarrollo vs producción
export const API_CONFIG = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://tu-api.com/api' 
    : 'http://localhost:3001/api',
  timeout: 10000,
  retries: 3
};

// Clase para API real (ejemplo de implementación)
export class RealEventsAPI {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  static async addEvent(event: Omit<Event, 'id'>): Promise<EventOperationResult> {
    try {
      const data = await this.request<Event>('/events', {
        method: 'POST',
        body: JSON.stringify(event),
      });

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  static async updateEvent(eventId: string, updates: Partial<Event>): Promise<EventOperationResult> {
    try {
      const data = await this.request<Event>(`/events/${eventId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });

      return { success: true, data };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  static async deleteEvent(eventId: string): Promise<EventOperationResult> {
    try {
      await this.request(`/events/${eventId}`, {
        method: 'DELETE',
      });

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  static async fetchEvents(): Promise<Event[]> {
    return this.request<Event[]>('/events');
  }
}
