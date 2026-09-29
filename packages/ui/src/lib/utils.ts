import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Whether an event's native target is inside the element handling it. React
 * bubbles synthetic events through portals, so a click in a Dialog or menu
 * opened from a row also reaches the row's handlers; this tells them apart.
 */
export function isOwnEvent(event: { currentTarget: EventTarget; target: EventTarget }): boolean {
  return (event.currentTarget as Node).contains(event.target as Node);
}
