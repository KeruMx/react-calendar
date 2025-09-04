import React, { useState } from 'react';
import { FormProps, Event } from '../lib/types';
import { format } from "date-fns";
export const Form = (props: FormProps) => {
	const { log } = console;
	const { event, onAddEvent, onUpdateEvent, onDeleteEvent } = props;
	const [title, setTitle] = useState<string>(event?.title || '');
	const [fechaInicio, setFechaInicio] = useState<string>(event && event.start ? `${format(event.start, 'yyyy-MM-dd')}` : '');
	const [horaInicio, setHoraInicio] = useState<string>(event && event.start ? `${format(event.start, 'HH:mm')}` : '');
	const [horaFin, setHoraFin] = useState<string>(event && event.end ? `${format(event.end, 'HH:mm')}` : '');
	const handleClick = (e: React.MouseEvent<HTMLFormElement>) => {
		e.preventDefault();
		const newEvent: Event = {
			title: title,
			id: event?.id || '',
			start: new Date(fechaInicio + 'T' + horaInicio),
			end: new Date(fechaInicio + 'T' + horaFin),
			color: event?.color || ''
		}
		log("event", event?.start);
		log("newEvent", newEvent?.start);
		log("fecha Inicio", fechaInicio);
		log("horia Inicio", horaInicio);
		log("horia fin", horaFin);
		if (event && event.id) {
			// onUpdate && onUpdate(newEvent);
			onUpdateEvent && onUpdateEvent(event.id, newEvent);
		} else {
			onAddEvent && onAddEvent(newEvent);
		}
	}
		return (
			<>
				<form className="flex flex-col space-y-1" onSubmit={handleClick}>
				<label>
					<span className="text-sm ">Title</span>
					<input onChange={(e) => setTitle(e.target.value)} type="text" className="w-full p-1 border border-gray-400 rounded-md" defaultValue={title} />
				</label>
				<label>
					<span className="text-sm ">Fecha Inicio</span>																						{/* "2018-07-22" */}
					<input onChange={(e) => setFechaInicio(e.target.value)} type="date" className="w-full p-1 border border-gray-400 rounded-md" defaultValue={fechaInicio} />
				</label>
				<div className='flex space-x-1'>
					<label>
						<span className="text-sm ">Hora Inicio</span>
						<input onChange={(e) => setHoraInicio(e.target.value)} type="time" className="w-full p-1 border border-gray-400 rounded-md" defaultValue={horaInicio} />
					</label>
					<label>
						<span className="text-sm ">Hora Fin</span>
						<input onChange={(e) => setHoraFin(e.target.value)} type="time" className="w-full p-1 border border-gray-400 rounded-md" defaultValue={horaFin} />
					</label>
				</div>
				<label>
				<span className="text-sm ">Color</span>
				</label>
				<button className="bg-blue-600 text-white  p-1 rounded-md cursor-pointer" type='submit'>Guardar</button>
			</form>
		</>
	)
}