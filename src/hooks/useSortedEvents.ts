import { useEffect, useState } from "react";
import { Event } from "../lib/types";
export default function useSortedEvents(events: Event[], currentDate: Date): { sortedEvents: Event[] } {
	const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
	useEffect(() => {		
		setSortedEvents([...events].sort((a, b) => a.start.getTime() - b.start.getTime()));
	}, [events, currentDate]);

	return { sortedEvents };
}