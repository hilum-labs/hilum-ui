"use client";

import * as React from "react";
import { ScrollArea } from "radix-ui";
import { cn } from "../lib/utils";
import { motionClasses } from "../lib/interaction";

function ScrollAreaRoot({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollArea.Root>) {
  return (
    <ScrollArea.Root
      data-slot="scroll-area"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <ScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className="h-full w-full rounded-[inherit]"
      >
        {children}
      </ScrollArea.Viewport>
      <ScrollAreaScrollbar orientation="vertical" />
      <ScrollAreaScrollbar orientation="horizontal" />
      <ScrollArea.Corner />
    </ScrollArea.Root>
  );
}
ScrollAreaRoot.displayName = "ScrollArea";

function ScrollAreaScrollbar({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof ScrollArea.Scrollbar>) {
  return (
    <ScrollArea.Scrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        "flex touch-none select-none",
        motionClasses,
        orientation === "vertical" && "h-full w-2 border-s border-s-transparent p-px",
        orientation === "horizontal" && "h-2 flex-col border-t border-t-transparent p-px",
        className,
      )}
      {...props}
    >
      <ScrollArea.Thumb
        data-slot="scroll-area-thumb"
        className={cn(
          "relative flex-1 rounded-full bg-border-strong hover:bg-muted-foreground/50",
          motionClasses,
        )}
      />
    </ScrollArea.Scrollbar>
  );
}
ScrollAreaScrollbar.displayName = "ScrollAreaScrollbar";

export { ScrollAreaRoot as ScrollArea };
