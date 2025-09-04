import React from "react";
import { Event } from "../lib/types";

interface CalendarDayProps {
  day: Date;
  index: number;
  isToday: (d: Date) => boolean;
  onSelect: (d: Date) => void;
  getEventsForDay: (d: Date) => Event[];
  daysOfWeek: string[];
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, index, isToday, onSelect, getEventsForDay, daysOfWeek }) => {
  const isFirstColumn = index % 7 === 0;
  const isLastColumn = index % 7 === 6;
  const isFirstRow = index < 7;
  const events = getEventsForDay(day);

  return (
    <div
      className={`max-h-full bg-white p-2.5 cursor-pointer overflow-y-auto
        ${!isFirstColumn && "border-l"}
        ${!isLastColumn && "border-r"} 
        ${!isFirstRow ? "border-t" : ""} border-gray-200`}
      onClick={() => onSelect(day)}
    >
      {isFirstRow && (
        <div className="bg-white text-gray-400 flex justify-center items-center text-xs md:text-sm">
          {daysOfWeek[index].toUpperCase()}
        </div>
      )}
      <div className="flex justify-center items-center text-sm">
        <span className={`${isToday(day) && "bg-blue-500 rounded-full text-white h-7 w-7 flex justify-center items-center"}`}>
          {day.getDate()}
        </span>
      </div>
      {events.length > 0 && (
        <div className="flex flex-col gap-1 pt-2">
          {events.map(ev => (
            <div key={ev.id} className={`text-[10px] md:text-xs ${ev.color || "bg-blue-100"} px-1 py-0.5 rounded truncate`}>
              {ev.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(CalendarDay);
