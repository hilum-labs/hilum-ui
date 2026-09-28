import * as React from "react";
import { cn } from "../lib/utils";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1.5 font-mono caption-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
Kbd.displayName = "Kbd";

export { Kbd };
