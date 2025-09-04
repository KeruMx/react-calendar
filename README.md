# @kerumx/react-calendar

A modern, customizable React calendar component with async support and optimistic updates.

![Version](https://img.shields.io/npm/v/@kerumx/react-calendar)
![License](https://img.shields.io/npm/l/@kerumx/react-calendar)
![Downloads](https://img.shields.io/npm/dm/@kerumx/react-calendar)

## ✨ Features

- 🗓️ **Modern Calendar UI** - Clean, responsive design
- ⚡ **Async Support** - Built-in optimistic updates
- 🔄 **Flexible State Management** - Sync and async operations
- 📱 **Mobile Friendly** - Touch-friendly interface
- 🎨 **Customizable** - Easy styling and theming
- 📅 **Event Management** - Add, edit, delete events
- ⏰ **Time Support** - Full day and time-based events
- 🎯 **TypeScript** - Full type safety
- 🪝 **Custom Hooks** - Powerful state management hooks

## 📦 Installation

```bash
npm install @kerumx/react-calendar
# or
yarn add @kerumx/react-calendar
# or
pnpm add @kerumx/react-calendar
```

## 🚀 Quick Start

```tsx
import { Calendar, useEvents } from '@kerumx/react-calendar';
import '@kerumx/react-calendar/dist/style.css';

function MyApp() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <Calendar 
      date={new Date()}
      events={events}
      onAddEvent={addEvent}
      onUpdateEvent={updateEvent}
      onDeleteEvent={deleteEvent}
    />
  );
}
```

## 🔧 Advanced Usage with Async Support

```tsx
import { Calendar, useEventsEnhanced } from '@kerumx/react-calendar';

function MyApp() {
  const {
    events,
    loading,
    addEvent,
    updateEvent,
    deleteEvent
  } = useEventsEnhanced([], {
    onAddEventAsync: async (event) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      });
      return response.ok;
    },
    onUpdateEventAsync: async (eventId, updates) => {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
    enableOptimisticUpdates: true,
    onError: (error, operation) => {
      console.error(`Failed to ${operation}:`, error.message);
    }
  });

  return (
    <div>
      {loading.global && <div>Loading...</div>}
      <Calendar 
        date={new Date()}
        events={events}
        onAddEvent={addEvent}
        onUpdateEvent={updateEvent}
        onDeleteEvent={deleteEvent}
      />
    </div>
  );
}
```

## 📚 API Reference

### Calendar Props

| Prop | Type | Description |
|------|------|-------------|
| `date` | `Date` | Current calendar date |
| `events` | `Event[]` | Array of events to display |
| `onAddEvent` | `(event: Event) => void \| Promise<boolean>` | Callback when adding an event |
| `onUpdateEvent` | `(id: string, updates: Partial<Event>) => void \| Promise<boolean>` | Callback when updating an event |
| `onDeleteEvent` | `(id: string) => void \| Promise<boolean>` | Callback when deleting an event |

### Event Type

```tsx
interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
}
```

### Hooks

#### `useEvents(initialEvents?: Event[])`

Basic event management hook for synchronous operations.

**Returns:**
- `events: Event[]` - Current events
- `addEvent: (event: Event) => void`
- `updateEvent: (id: string, updates: Partial<Event>) => void`
- `deleteEvent: (id: string) => void`
- `replaceEvents: (events: Event[]) => void`

#### `useEventsEnhanced(initialEvents?: Event[], config?: UseEventsConfig)`

Advanced hook with async support and optimistic updates.

**Config Options:**
```tsx
interface UseEventsConfig {
  onAddEventAsync?: (event: Event) => Promise<boolean>;
  onUpdateEventAsync?: (id: string, updates: Partial<Event>) => Promise<boolean>;
  onDeleteEventAsync?: (id: string) => Promise<boolean>;
  enableOptimisticUpdates?: boolean;
  onError?: (error: Error, operation: string, data?: any) => void;
}
```

**Returns:**
- All `useEvents` returns plus:
- `loading: LoadingState` - Loading states for operations
- Async versions of all operations

## 🎨 Styling

The component comes with default styles. Import the CSS file:

```tsx
import '@kerumx/react-calendar/dist/style.css';
```

### Custom Styling

You can override the default styles or use your own CSS classes. The component uses standard class names that you can target:

```css
.calendar-container {
  /* Your custom styles */
}

.calendar-day {
  /* Day cell styles */
}

.calendar-event {
  /* Event styles */
}
```

## 📖 Examples

### Integration with Next.js API Routes

```tsx
// pages/api/events.ts
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Add event to database
    const event = await db.events.create(req.body);
    res.json(event);
  }
  // Handle other methods...
}

// components/Calendar.tsx
const { events, addEvent } = useEventsEnhanced([], {
  onAddEventAsync: async (event) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify(event)
    });
    return response.ok;
  }
});
```

### Integration with Google Calendar

See our [Google Calendar Integration Guide](https://github.com/KeruMx/react-calendar/tree/main/examples/google-calendar) for a complete example.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/KeruMx/react-calendar/blob/main/CONTRIBUTING.md) for details.

## 📄 License

MIT © [Emmanuel Anaya, Jeank](https://github.com/KeruMx/react-calendar/blob/main/LICENSE)

## 🔗 Links

- [Documentation](https://github.com/KeruMx/react-calendar#readme)
- [Examples](https://github.com/KeruMx/react-calendar/tree/main/examples)
- [GitHub Issues](https://github.com/KeruMx/react-calendar/issues)
- [Changelog](https://github.com/KeruMx/react-calendar/blob/main/CHANGELOG.md)
- [NPM Package](https://www.npmjs.com/package/@kerumx/react-calendar)

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [date-fns](https://date-fns.org/)
- [Radix UI](https://www.radix-ui.com/)
- [Vite](https://vitejs.dev/)
