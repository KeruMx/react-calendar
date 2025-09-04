import { useMemo } from "react";
import useCalendarDays from "./useCalendarDays";
import useSortedEvents from "./useSortedEvents";
import { Event } from "../lib/types";
import { isSameDay } from "date-fns";

export function useCalendarData(date: Date, events: Event[]) {
  const calendarDays = useCalendarDays(date);
  const { sortedEvents } = useSortedEvents(events, date);
  const today = useMemo(() => new Date(), []);
  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    for (const ev of sortedEvents) {
      const key = ev.start.toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [sortedEvents]);
  const getEventsForDay = (day: Date) => eventsByDay.get(day.toDateString()) || [];
  const isToday = (day: Date) => isSameDay(day, today);
  return { calendarDays, sortedEvents, today, getEventsForDay, isToday };
}
