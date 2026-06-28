import * as React from "react";
import { cn } from "../lib/utils";
import { controlSurfaceClasses, focusRingClasses, motionClasses } from "../lib/interaction";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md px-3 py-2",
        "body text-foreground placeholder:text-muted-foreground",
        "resize-none",
        controlSurfaceClasses,
        motionClasses,
        focusRingClasses,
        "focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
