import * as React from "react";
import { Progress } from "radix-ui";
import { cn } from "../lib/utils";

const ProgressRoot = React.forwardRef<
  React.ComponentRef<typeof Progress.Root>,
  React.ComponentPropsWithoutRef<typeof Progress.Root>
>(({ className, value, ...props }, ref) => (
  <Progress.Root
    ref={ref}
    className={cn("relative h-2 w-full overflow-hidden rounded-full bg-ground-100", className)}
    value={value}
    {...props}
  >
    <Progress.Indicator
      className="h-full w-full flex-1 bg-brand-primary transition-all"
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    />
  </Progress.Root>
));
ProgressRoot.displayName = "Progress";

export { ProgressRoot as Progress };
