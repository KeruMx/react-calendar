import { differenceInMinutes, format, isSameDay } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "./dialog"
import React, { useEffect } from "react" // Import React
import { DayViewModalProps } from "../lib/types"
import { Event } from "../lib/types"
import { DayEvent } from "./day-events"


export function DayViewModal({ currentDate, events, onClose, isOpen, onAddEvent, onUpdateEvent, onDeleteEvent }: DayViewModalProps) {
	useEffect(() => {
	}, [currentDate, events]);
	const hours = Array.from({ length: 24 }, (_, i) => i);


	return (
		<Dialog open={isOpen} onOpenChange={(open: any) => !open && onClose()}>
			<DialogContent>
				<DialogClose />
				<DialogHeader>
					<DialogTitle >
						{format(currentDate, "EEEE, MMMM d, yyyy")}
					</DialogTitle>
				</DialogHeader>
				<div className="mt-4 grid  gap-2 max-h-[70vh] overflow-y-auto p-6">
					<div className=" relative h-[90vh] w-full" >
						{" "}
						{/* 24 hours * 50px per hour */}
						{hours.map((hour, i) => {
							const tp = hour * 50;
							return (
								
									<div key={hour} className={`absolute w-full border-t border-gray-200 `} style={{ top: `${tp}px` }}>
										<span className=" text-sm text-gray-500">
											{format(new Date().setHours(hour), "h a")}
										</span>
									</div>
								)
						})}
						<DayEvent events={events} currentDate={currentDate} onAddEvent={onAddEvent} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />
					</div>
				</div>
			</DialogContent>
		</Dialog >
	)
}

