import * as React from "react";
import { cn } from "../lib/utils";
import {
  segmentedItemActiveClasses,
  segmentedItemClasses,
  segmentedTrackClasses,
} from "../lib/interaction";

/**
 * Segmented control: a track of ButtonGroupItems with a raised chip for the
 * active item. Extra props (`role="toolbar"`, `aria-label`, …) reach the track.
 * Under data-density="compact" it is the 24px editor-chrome segmented control;
 * add `w-full` to stretch the items evenly across the row.
 */
interface ButtonGroupProps extends React.ComponentProps<"div"> {
  children: React.ReactNode;
}

function ButtonGroup({ children, className, ...props }: ButtonGroupProps) {
  return (
    <div data-slot="button-group" className={cn(segmentedTrackClasses, className)} {...props}>
      {children}
    </div>
  );
}

interface ButtonGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Shows the item as selected. `aria-pressed="true"` does the same. */
  active?: boolean;
}

function ButtonGroupItem({ active, className, children, ...props }: ButtonGroupItemProps) {
  const pressed = props["aria-pressed"];
  const isActive = active || pressed === true || pressed === "true";
  return (
    <button
      type="button"
      data-slot="button-group-item"
      className={cn(segmentedItemClasses, isActive && segmentedItemActiveClasses, className)}
      {...props}
    >
      {children}
    </button>
  );
}

ButtonGroup.displayName = "ButtonGroup";
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem };
export type { ButtonGroupProps, ButtonGroupItemProps };
