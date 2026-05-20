import * as React from "react";
import { cn } from "../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full rounded-md border border-ground-200 bg-white px-3 py-1",
        "body text-ground-900 placeholder:text-ground-400",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/20 focus-visible:border-brand-primary",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-ground-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ground-900",
        className,
      )}
      {...props}
    />
  );
}
Input.displayName = "Input";

export { Input };
