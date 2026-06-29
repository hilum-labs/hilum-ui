"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { controlSurfaceClasses, focusRingClasses, motionClasses } from "../lib/interaction";
import { useShape } from "../lib/shape-context";

type ControlDensity = "default" | "compact";
type ControlMobileSurface = "default" | "flush";

interface InputProps extends React.ComponentProps<"input"> {
  density?: ControlDensity;
  mobileDensity?: ControlDensity;
  mobileSurface?: ControlMobileSurface;
}

const inputDensityClasses: Record<ControlDensity, string> = {
  default: "h-10 px-3 py-1",
  compact: "h-8 px-2.5 py-1",
};

const inputMobileDensityClasses: Record<ControlDensity, string> = {
  default: "",
  compact: "max-sm:h-8 max-sm:px-2.5 max-sm:py-1",
};

const controlMobileSurfaceClasses: Record<ControlMobileSurface, string> = {
  default: "",
  flush:
    "max-sm:rounded-none max-sm:border-x-0 max-sm:border-t-0 max-sm:bg-transparent max-sm:px-0 max-sm:shadow-none max-sm:focus-visible:ring-0 max-sm:focus-visible:ring-offset-0",
};

function Input({
  className,
  type,
  density = "default",
  mobileDensity = "default",
  mobileSurface = "default",
  ...props
}: InputProps) {
  const shape = useShape();

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex w-full",
        inputDensityClasses[density],
        inputMobileDensityClasses[mobileDensity],
        shape.input,
        "body text-foreground placeholder:text-muted-foreground",
        controlSurfaceClasses,
        motionClasses,
        focusRingClasses,
        controlMobileSurfaceClasses[mobileSurface],
        "focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
Input.displayName = "Input";

export { Input };
export type { ControlDensity, ControlMobileSurface, InputProps };
