import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "size-3",
        sm: "size-4",
        default: "size-5",
        lg: "size-6",
        xl: "size-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

interface SpinnerProps extends React.ComponentProps<"span">, VariantProps<typeof spinnerVariants> {
  /** Accessible name announced to screen readers. Defaults to "Loading". */
  label?: string;
}

function Spinner({ className, size, label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      data-slot="spinner"
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}
Spinner.displayName = "Spinner";

export { Spinner, spinnerVariants };
