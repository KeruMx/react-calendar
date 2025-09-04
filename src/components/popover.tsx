import { Popover } from "radix-ui";
import React, { useEffect, useState } from "react";
import { PopoverProps } from "../lib/types";
import { Form } from "./form";
import { useMousePosition } from "../hooks/useMousePosition";
export const PopoverCustom = (props: PopoverProps) => {
	const { event, onAddEvent, onUpdateEvent, onDeleteEvent } = props;
	const { log } = console;
	const { x, y } = useMousePosition();
	const [open, setOpen] = useState(false);
	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<Popover.Trigger asChild>
				{props.children}
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content className="bg-white rounded-md p-5 drop-shadow-lg"
					avoidCollisions={true}
					align="center"
					
					/* side={`${(y && ((window.innerHeight + 100) / 2) < y) ? "top" : "left"}`} */ 
					>
					<Form event={event} onAddEvent={onAddEvent} onUpdateEvent={onUpdateEvent} onDeleteEvent={onDeleteEvent} />
					<Popover.Arrow />
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	)
};
