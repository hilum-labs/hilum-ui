"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { controlSurfaceClasses, focusRingClasses, motionClasses } from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import type { ControlDensity, ControlMobileSurface } from "./input";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  density?: ControlDensity;
  mobileDensity?: ControlDensity;
  mobileSurface?: ControlMobileSurface;
}

const textareaDensityClasses: Record<ControlDensity, string> = {
  default: "min-h-[80px] px-3 py-2",
  compact: "min-h-16 px-2.5 py-1.5",
};

const textareaMobileDensityClasses: Record<ControlDensity, string> = {
  default: "",
  compact: "max-sm:min-h-16 max-sm:px-2.5 max-sm:py-1.5",
};

const textareaMobileSurfaceClasses: Record<ControlMobileSurface, string> = {
  default: "",
  flush:
    "max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:bg-transparent max-sm:px-0 max-sm:shadow-none max-sm:focus-visible:ring-0 max-sm:focus-visible:ring-offset-0",
};

function Textarea({
  className,
  density = "default",
  mobileDensity = "default",
  mobileSurface = "default",
  ...props
}: TextareaProps) {
  const shape = useShape();

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full",
        textareaDensityClasses[density],
        textareaMobileDensityClasses[mobileDensity],
        shape.input,
        "body text-foreground placeholder:text-muted-foreground",
        "resize-none",
        controlSurfaceClasses,
        motionClasses,
        focusRingClasses,
        textareaMobileSurfaceClasses[mobileSurface],
        "focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
