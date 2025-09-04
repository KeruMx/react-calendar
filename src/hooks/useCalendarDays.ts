import { useMemo } from "react";
import { generateCalendarDays } from "../lib/lib";

export default function useCalendarDays(date: Date) {
  return useMemo(() => generateCalendarDays(date), [date]);
}
