import React from "react";
import "./index.css";
import { DayViewModal } from "./components/day-view";
import { CalendarProps } from "./lib/types";
import { useCalendarData } from "./hooks/useCalendarData";
import useSelectedDay from "./hooks/useSelectedDay";
import CalendarDay from "./components/CalendarDay";

export default function Calendar({ date, events, onAddEvent, onUpdateEvent, onDeleteEvent }: CalendarProps) {
	const safeEvents = events || [];
	const { calendarDays, getEventsForDay, isToday } = useCalendarData(date, safeEvents);
	const { selectedDay, openDay, closeDay } = useSelectedDay();
	const daysOfWeek = React.useMemo(() => ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], []);

	return (
		<div id="container" className="inset-0 z-auto will-change-auto bg-gray-50 h-full w-full p-3">
			<div className="rounded-[30px] shadow-2xl bg-white h-full drop-shadow-2xl p-3">
				<div className="grid grid-cols-7 grid-rows-5 gap-0 w-full h-full max-h-full">
					{calendarDays.map((day, index) => (
						<CalendarDay
							key={day.toISOString() + index}
							day={day}
							index={index}
							isToday={isToday}
							onSelect={openDay}
							getEventsForDay={getEventsForDay}
							daysOfWeek={daysOfWeek}
						/>
					))}
				</div>
			</div>
			<DayViewModal
				currentDate={selectedDay || new Date()}
				events={safeEvents}
				isOpen={!!selectedDay}
				onClose={closeDay}
				onAddEvent={onAddEvent}
				onUpdateEvent={onUpdateEvent}
				onDeleteEvent={onDeleteEvent}
			/>
		</div>
	);
}
// 							>
// 								{index < 7 && (
// 									<div className="bg-white text-gray-400 flex justify-center items-center text-sm">
// 										{daysOfWeek[index].toUpperCase()}
// 									</div>
// 								)}
// 								<div className={` flex justify-center items-center text-sm  bg-white`}>
// 									<span className={`${isToday && "bg-blue-500 rounded-full text-white h-7 w-7 flex justify-center items-center"}`}>
// 										{day.getDate()}
// 									</span>
// 								</div>
// 								<div className="flex flex-wrap gap-1 pt-2">
// 									{(events && events?.length > 0) && sortedEvents
// 										.filter((event) => isSameDay(event.start, day))
// 										.map((event) => (
// 											<div key={event.id} className={`text-xs ${event.color || "bg-blue-100"} p-1 mb-1 truncate `} >
// 												{event.title}
// 											</div>
// 										))}
// 								</div>
// 							</div>
// 						)
// 					})
// 					}
// 			</div>
// 			<DayViewModal
// 				currentDate={selectedDay || new Date()}
// 				events={events || []}
// 				isOpen={!!selectedDay}
// 				onClose={closeDayView}
// 				onUpdate={onUpdate}
// 			/>
// 		</div>
// 	);
// }
