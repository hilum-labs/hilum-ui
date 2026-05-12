import * as React from "react";
import { cn } from "../lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-taupe-200 bg-white px-3 py-2",
        "body text-taupe-900 placeholder:text-taupe-400",
        "resize-none transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-taupe-900/15 focus-visible:border-taupe-400",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-taupe-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
