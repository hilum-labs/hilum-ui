"use client";

import * as React from "react";
import { Slider } from "radix-ui";
import { cn } from "../lib/utils";

const SliderRoot = React.forwardRef<
  React.ComponentRef<typeof Slider.Root>,
  React.ComponentPropsWithoutRef<typeof Slider.Root>
>(({ className, ...props }, ref) => (
  <Slider.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
      <Slider.Range className="absolute h-full bg-brand-primary" />
    </Slider.Track>
    <Slider.Thumb className="relative block size-4 rounded-full border-2 border-brand-primary bg-card shadow-natural transition-colors after:absolute after:left-1/2 after:top-1/2 after:size-10 after:-translate-x-1/2 after:-translate-y-1/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30 disabled:pointer-events-none disabled:opacity-50" />
  </Slider.Root>
));
SliderRoot.displayName = "Slider";

export { SliderRoot as Slider };
