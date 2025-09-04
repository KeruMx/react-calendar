import React from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar } from '../src';
import '../src/index.css';
import { Event } from '../src/lib/types';
import { addHours } from "date-fns";
import useEvents from '../src/hooks/useEvents';

const App = () => {
	const date = new Date();
	const initialEvents: Event[] = [
		{
			id: "test-event-1",
			title: "Test Event (3 hours)",
			start: new Date(),
			end: addHours(new Date(), 2.5),
		},
		{
			id: "test-event-2",
			title: "Test Event (2 hours)",
			start: new Date(),
			end: addHours(new Date(), 2),
		},
		{
			id: "test-event-3",
			title: "Test Event (4.5 hours)",
			start: new Date(),
			end: addHours(new Date(), 2),
		},
		{
			id: "test-event-4",
			title: "Test Event (2++ hours)",
			start: addHours(new Date(), 3.5),
			end: addHours(new Date(), 4.5),
			color: "bg-red-400"
		},
		{
			id: "test-event-5",
			title: "Test Event (4.5 hours)",
			start: addHours(new Date(), 1.5),
			end: addHours(new Date(), 2.5),
		},
		{
			id: "test-event-6",
			title: "Test Event (6.5 hours)",
			start: addHours(new Date(), 8.5),
			end: addHours(new Date(), 9.5),
		},
	];

	const { events, addEvent, updateEvent, deleteEvent } = useEvents(initialEvents);

	return (
		<>
			{/* <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
				<div className="w-full flex-none md:w-64">
					asd
				</div>
				<div className="flex-grow p-6 md:overflow-y-auto md:p-12"><Calendar date={date}/></div>
			</div> */}
			<div className='flex flex-col h-screen'>
				<div id="date-range-picker" date-rangepicker className="mb-4">
					<input id="datepicker-range-start" name="start" type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Select date start" />
				</div>
				<div className='flex-grow overflow-y-auto'>
					<Calendar 
						date={date} 
						events={events} 
						onAddEvent={addEvent}
						onUpdateEvent={updateEvent}
						onDeleteEvent={deleteEvent}
					/>
				</div>
			</div>

		</>
	)
};

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(<App />);