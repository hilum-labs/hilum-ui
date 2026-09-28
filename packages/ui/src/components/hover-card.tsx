"use client";

import * as React from "react";
import { HoverCard } from "radix-ui";
import { cn } from "../lib/utils";
import { motionClasses } from "../lib/interaction";

const HoverCardRoot = HoverCard.Root;

function HoverCardTrigger(props: React.ComponentProps<typeof HoverCard.Trigger>) {
  return <HoverCard.Trigger data-slot="hover-card-trigger" {...props} />;
}
HoverCardTrigger.displayName = "HoverCardTrigger";

function HoverCardContent({
  className,
  align = "center",
  sideOffset = 6,
  ...props
}: React.ComponentProps<typeof HoverCard.Content>) {
  return (
    <HoverCard.Portal>
      <HoverCard.Content
        data-slot="hover-card-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-50 w-64 rounded-xl border border-border bg-card p-4 shadow-elevated outline-none",
          motionClasses,
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
          "data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2",
          className,
        )}
        {...props}
      />
    </HoverCard.Portal>
  );
}
HoverCardContent.displayName = "HoverCardContent";

export { HoverCardRoot as HoverCard, HoverCardTrigger, HoverCardContent };
