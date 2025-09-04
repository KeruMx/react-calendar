import Calendar from "./calendar";

// Hooks
export { default as useEvents } from "./hooks/useEvents";
export { default as useEventsEnhanced } from "./hooks/useEventsEnhanced";
export { default as useSelectedDay } from "./hooks/useSelectedDay";
export { default as useCalendarDays } from "./hooks/useCalendarDays";
export { default as useSortedEvents } from "./hooks/useSortedEvents";
export { useCalendarData } from "./hooks/useCalendarData";

// Tipos
export type { Event, CalendarProps, FormProps, PopoverProps, DayEventProps, DayViewModalProps } from "./lib/types";
export type { UseEventsConfig, UseEventsReturn, AsyncEventHandler, SyncEventHandler } from "./hooks/useEventsEnhanced";

// Componente principal
export { Calendar };