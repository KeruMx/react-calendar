import { ReactNode } from "react"


export type Event = {
  id: string
  title: string
  start: Date
  end: Date
  color?: string
}

export type DayViewModalProps = {
  currentDate: Date
  events: Event[]
  isOpen: boolean
  onClose: () => void
  onUpdate?: (event: Event) => void
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string, updates: Partial<Event>) => void
}

export type DialogContextType = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export type DialogProps = {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export type CalendarProps = {
  date: Date 
  events?: Event[]
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string, updates: Partial<Event>) => void
  rounded?: boolean
  loading?: boolean
  error?: string | null
}

export type PopoverProps = {
	children?: ReactNode | null
  open?: boolean
  onOpenChange?: (open: boolean) => void
  event: Event | null
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string, updates: Partial<Event>) => void
}
export type FormProps = {
  event?: Event | null
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string, updates: Partial<Event>) => void
}

export type DayEventProps = {
  events: Event[]
  currentDate: Date
  onAddEvent?: (event: Event) => void
  onUpdateEvent?: (eventId: string, updates: Partial<Event>) => void
  onDeleteEvent?: (eventId: string, updates: Partial<Event>) => void

}