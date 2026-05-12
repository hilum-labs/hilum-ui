import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-taupe-900 text-white",
        secondary: "bg-taupe-100 text-taupe-700",
        outline: "border border-taupe-200 text-taupe-600 bg-transparent",
        brand: "bg-brand-primary text-white",
        success: "bg-brand-secondary/20 text-taupe-800 border border-brand-secondary/50",
        warning: "bg-brand-secondary/70 text-taupe-700 border border-brand-secondary",
        destructive: "bg-red-50 text-red-700 border border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
