"use client";

import * as React from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import type { GroupProps, SeparatorProps } from "react-resizable-panels";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/utils";

// react-resizable-panels v4 uses `orientation` and `elementRef` instead of
// the older `direction` prop + React.forwardRef pattern.

type ResizablePanelGroupProps = Omit<GroupProps, "orientation"> & {
  /** Alias for `orientation` — matches the common shadcn/ui API. */
  direction?: "horizontal" | "vertical";
  orientation?: "horizontal" | "vertical";
};

function ResizablePanelGroup({
  className,
  direction,
  orientation,
  ...props
}: ResizablePanelGroupProps) {
  const resolvedOrientation = orientation ?? direction ?? "horizontal";
  return (
    <Group
      orientation={resolvedOrientation}
      className={cn(
        "flex h-full w-full",
        resolvedOrientation === "vertical" && "flex-col",
        className
      )}
      {...props}
    />
  );
}
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = Panel;

type ResizableHandleProps = SeparatorProps & {
  withHandle?: boolean;
};

function ResizableHandle({ className, withHandle = true, ...props }: ResizableHandleProps) {
  return (
    <Separator
      className={cn(
        "relative flex shrink-0 items-center justify-center bg-taupe-100",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary/50",
        // Horizontal (default): vertical bar
        "[&:not([aria-orientation=vertical])]:h-full [&:not([aria-orientation=vertical])]:w-px",
        // Vertical: horizontal bar
        "[aria-orientation=vertical]:h-px [aria-orientation=vertical]:w-full",
        // Wider hit target via pseudo-element
        "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
        "[aria-orientation=vertical]:after:left-0 [aria-orientation=vertical]:after:h-1 [aria-orientation=vertical]:after:w-full [aria-orientation=vertical]:after:translate-x-0 [aria-orientation=vertical]:after:-translate-y-1/2",
        // Active drag state
        "active:bg-brand-primary/30",
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-5 w-3 items-center justify-center rounded-sm border border-taupe-100 bg-white shadow-natural">
          <GripVertical size={10} className="text-taupe-400" />
        </div>
      )}
    </Separator>
  );
}
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
