import { useState, useCallback } from "react";

export default function useSelectedDay() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const openDay = useCallback((d: Date) => setSelectedDay(d), []);
  const closeDay = useCallback(() => setSelectedDay(null), []);
  return { selectedDay, openDay, closeDay };
}
