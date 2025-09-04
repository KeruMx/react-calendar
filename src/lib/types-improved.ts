import { ReactNode } from "react"

export type Event = {
  id: string
  title: string
  start: Date
  end: Date
  color?: string
}

// Estados para operaciones asíncronas
export type AsyncState = {
  loading: boolean
  error: string | null
}

export type EventOperationResult = {
  success: boolean
  data?: Event
  error?: string
}

// Callbacks asíncronos mejorados
export type AsyncEventCallbacks = {
  onAddEvent?: (event: Omit<Event, 'id'>) => Promise<EventOperationResult>
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => Promise<EventOperationResult>
  onDeleteEvent?: (eventId: string) => Promise<EventOperationResult>
  onFetchEvents?: () => Promise<Event[]>
}

// Props mejoradas
export type CalendarProps = {
  date: Date 
  events?: Event[]
  rounded?: boolean
  // Estados de carga
  loading?: boolean
  error?: string | null
  // Callbacks síncronos (para compatibilidad)
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string) => void
  // Callbacks asíncronos (nuevos)
  asyncCallbacks?: AsyncEventCallbacks
}

export type FormProps = {
  event?: Event | null
  loading?: boolean
  error?: string | null
  onAddEvent?: (event: Event) => void | Promise<void>
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void | Promise<void>
  onDeleteEvent?: (eventId: string) => void | Promise<void>
  onCancel?: () => void
}

export type PopoverProps = {
  children?: ReactNode | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  event: Event | null
  loading?: boolean
  error?: string | null
  onAddEvent?: (event: Event) => void | Promise<void>
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void | Promise<void>
  onDeleteEvent?: (eventId: string) => void | Promise<void>
}

// Mantener los tipos existentes para compatibilidad
export type DayViewModalProps = {
  currentDate: Date
  events: Event[]
  isOpen: boolean
  onClose: () => void
  loading?: boolean
  error?: string | null
  onAddEvent?: (event: Event) => void | Promise<void>
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void | Promise<void>
  onDeleteEvent?: (eventId: string) => void | Promise<void>
}

export type DayEventProps = {
  events: Event[]
  currentDate: Date
  loading?: boolean
  error?: string | null
  onAddEvent?: (event: Event) => void | Promise<void>
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void | Promise<void>
  onDeleteEvent?: (eventId: string) => void | Promise<void>
}

// Tipos para Dialog (sin cambios)
export type DialogContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type DialogProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
