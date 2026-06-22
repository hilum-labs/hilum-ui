"use client";

import * as React from "react";
import { Toggle } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "body font-medium whitespace-nowrap rounded-md",
    "transition-[background-color,border-color,box-shadow,color,opacity,scale] duration-150 outline-none active:scale-[0.96]",
    "focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-muted-foreground",
          "hover:bg-muted hover:text-foreground",
          "data-[state=on]:bg-muted data-[state=on]:text-foreground",
        ],
        outline: [
          "border border-border bg-card text-muted-foreground shadow-natural",
          "hover:bg-muted hover:text-foreground",
          "data-[state=on]:bg-muted data-[state=on]:text-foreground data-[state=on]:border-border",
        ],
        brand: [
          "bg-transparent text-muted-foreground",
          "hover:bg-muted hover:text-foreground",
          "data-[state=on]:bg-brand-primary data-[state=on]:text-background",
        ],
      },
      size: {
        sm: "h-8 gap-1.5 px-3",
        default: "h-10 px-3",
        lg: "h-11 px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof Toggle.Root>, VariantProps<typeof toggleVariants> {}

const ToggleRoot = React.forwardRef<React.ComponentRef<typeof Toggle.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <Toggle.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
ToggleRoot.displayName = "Toggle";

export { ToggleRoot as Toggle, toggleVariants };
