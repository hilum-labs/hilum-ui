import * as React from "react";
import { Progress } from "radix-ui";
import { cn } from "../lib/utils";

function ProgressRoot({ className, value, ...props }: React.ComponentProps<typeof Progress.Root>) {
  return (
    <Progress.Root
      data-slot="progress"
      // The track uses the border colour: visible on cards and pages in both
      // themes (muted matched the card surface in dark mode).
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-border", className)}
      value={value}
      {...props}
    >
      <Progress.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 bg-brand-primary transition-transform"
        style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
      />
    </Progress.Root>
  );
}
ProgressRoot.displayName = "Progress";

export { ProgressRoot as Progress };
