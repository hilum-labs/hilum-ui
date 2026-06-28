import * as React from "react";
import { cn } from "../lib/utils";
import { controlSurfaceClasses, focusRingClasses, motionClasses } from "../lib/interaction";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md px-3 py-1",
        "body text-foreground placeholder:text-muted-foreground",
        controlSurfaceClasses,
        motionClasses,
        focusRingClasses,
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
