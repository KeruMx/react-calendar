import { differenceInMinutes, isSameDay } from "date-fns";
import React, { useEffect, useState } from "react";
import { DayEventProps, Event } from "../lib/types";
import useSortedEvents from "../hooks/useSortedEvents";
import { PopoverCustom } from "./popover";

export const DayEvent = (props:  DayEventProps ) => {
	const { events, currentDate, onAddEvent, onUpdateEvent, onDeleteEvent } = props;
	const [groupedEvents, setGroupedEvents] = useState<Event[][]>([]);
	const [open, setOpen] = useState(false);
	const [event, setEvent] = useState<Event | null>(null);
	const { sortedEvents } = useSortedEvents(events, currentDate);
	const { log } = console;
	useEffect(() => {
		if (sortedEvents && sortedEvents.length > 0){
			fillEventsDay();
		}
			
	}, [sortedEvents]);

	const fillEventsDay = () => {
		const newFilteredEvents = (sortedEvents.filter((event) => isSameDay(event.start, currentDate)));
		const newGroupedEvents: Event[][] = [];
		let currentGroup: Event[] = [];
		newFilteredEvents.forEach((event) => {
			const overlaps = currentGroup.some(e => e.end > event.start);

			if (currentGroup.length === 0 || overlaps) {
				currentGroup.push(event);
			} else {
				newGroupedEvents.push(currentGroup);
				currentGroup = [event];
			}
		});
		if (currentGroup.length > 0) {
			newGroupedEvents.push(currentGroup);
		}
		setGroupedEvents(newGroupedEvents);
	};
	const getEventStyle = (event: Event, groupSize: number = 1, column: number) => {
		const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
		const startMinutes = differenceInMinutes(event.start, startOfDay);
		const durationMinutes = differenceInMinutes(event.end, event.start);
		const height = (durationMinutes / 60) * 50; // 50px = 1 hora
		const top = (startMinutes / 60) * 50; // 50px = 1 hora
		const width = `calc(100% / ${groupSize} - 5px)`;
		const left = `calc(${(100 / groupSize) * column}% + 5px)`;
		return {
			position: "absolute" as const,
			top: `${top}px`,
			height: `${height}px`,
			width,
			left,
			padding: "5px",
			borderRadius: "4px",
			boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
		};
	};

	return (
		<div className="relative w-[calc(100%-3.5rem)] left-14 h-full">
			{groupedEvents.map((group, index) => {
				const groupSize = group.length;
				return (
					<div
						key={index}
						className={`absolute grid grid-cols-[${groupSize}] w-full`}
						// style={{
						// 	display: "grid",
						// 	gridTemplateColumns: `repeat(${groupSize}, 1fr)`,
						// 	gap: "4px",
						// }}
					>
						{group.map((event, col) => {
							const eventElement = (
								<div
									key={event.id + event.start.getTime()} // Un identificador único
									className={`${event.color || "bg-blue-400"} cursor-pointer opacity-70 p-2 rounded-lg shadow text-sm `}
									style={getEventStyle(event, group.length, col)}
									// onClick={(e) => handleClick(event, e)}
								>
									{event.title}
								</div>
							);

							return <PopoverCustom key={event.id + event.start.getTime()} event={event} children={eventElement} onAddEvent={onAddEvent} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />;
						})}
					</div>
				)
			})}
			{/* <HoverCardCustom event={event} open={open} children={null}/> */}
		</div>
	);
};
