import * as React from "react";
import { cn } from "../lib/utils";

const Kbd = React.forwardRef<HTMLElement, React.ComponentProps<"kbd">>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-taupe-200 bg-taupe-50 px-1.5 font-mono caption-xs font-medium text-taupe-500",
        className,
      )}
      {...props}
    />
  ),
);
Kbd.displayName = "Kbd";

export { Kbd };
