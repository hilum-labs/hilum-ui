"use client";

import * as React from "react";
import { cn } from "../lib/utils";
import { controlSurfaceClasses, inputFocusClasses, motionClasses } from "../lib/interaction";
import { useShape } from "../lib/shape-context";
import { useFieldControl } from "../lib/field-context";
import type { ControlDensity, ControlMobileSurface } from "./input";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  density?: ControlDensity;
  mobileDensity?: ControlDensity;
  mobileSurface?: ControlMobileSurface;
}

const textareaDensityClasses: Record<ControlDensity, string> = {
  default: "min-h-20 px-3 py-2",
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
  id,
  disabled,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-required": ariaRequired,
  ...props
}: TextareaProps) {
  const shape = useShape();
  const fieldProps = useFieldControl({
    id,
    disabled,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
  });

  return (
    <textarea
      data-slot="textarea"
      {...fieldProps}
      className={cn(
        "flex w-full",
        textareaDensityClasses[density],
        textareaMobileDensityClasses[mobileDensity],
        shape.input,
        "body text-foreground placeholder:text-muted-foreground",
        "resize-none",
        controlSurfaceClasses,
        motionClasses,
        inputFocusClasses,
        textareaMobileSurfaceClasses[mobileSurface],
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        // Editor-chrome density (data-density="compact" ancestor).
        "compact:text-[12px] compact:rounded-[5px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
export type { TextareaProps };
