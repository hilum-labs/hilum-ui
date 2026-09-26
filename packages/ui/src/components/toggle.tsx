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
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
    "compact:rounded-[5px] compact:text-[12px] compact:gap-1.5 [&_svg:not([class*='size-'])]:compact:size-3.5",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-muted-foreground",
          "hover:bg-hover hover:text-foreground",
          "data-[state=on]:bg-active data-[state=on]:text-foreground",
        ],
        outline: [
          "border border-border bg-card text-muted-foreground shadow-natural",
          "hover:bg-hover hover:text-foreground hover:border-border-strong",
          "data-[state=on]:bg-active data-[state=on]:text-foreground data-[state=on]:border-border-strong",
        ],
        brand: [
          "bg-transparent text-muted-foreground",
          "hover:bg-hover hover:text-foreground",
          "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        ],
      },
      size: {
        sm: "h-8 gap-1.5 px-3 compact:h-6 compact:px-2",
        default: "h-10 px-3 compact:h-6 compact:px-2",
        lg: "h-11 px-4 compact:h-7 compact:px-2.5",
        icon: "size-9 compact:size-6",
        "icon-sm": "size-8 compact:size-6",
        "icon-lg": "size-11 compact:size-7",
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
