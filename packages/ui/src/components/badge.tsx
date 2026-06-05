import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 caption font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-foreground text-background",
        secondary: "bg-muted text-muted-foreground",
        outline: "border border-border text-muted-foreground bg-transparent",
        brand: "bg-brand-primary text-background",
        success: "bg-brand-secondary/20 text-muted-foreground border border-brand-secondary/50",
        warning: "bg-brand-secondary/70 text-muted-foreground border border-brand-secondary",
        destructive: "bg-destructive/10 text-destructive border border-destructive/20",
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
Badge.displayName = "Badge";

export { Badge, badgeVariants };
