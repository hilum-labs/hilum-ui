"use client";

import * as React from "react";
import { Toggle } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const toggleVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "body font-medium whitespace-nowrap rounded-md",
    "transition-all duration-150 outline-none",
    "focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-taupe-600",
          "hover:bg-taupe-100 hover:text-taupe-900",
          "data-[state=on]:bg-taupe-100 data-[state=on]:text-taupe-900",
        ],
        outline: [
          "border border-taupe-200 bg-white text-taupe-600 shadow-natural",
          "hover:bg-taupe-50 hover:text-taupe-900",
          "data-[state=on]:bg-taupe-100 data-[state=on]:text-taupe-900 data-[state=on]:border-taupe-300",
        ],
        brand: [
          "bg-transparent text-taupe-600",
          "hover:bg-taupe-100 hover:text-taupe-900",
          "data-[state=on]:bg-brand-primary data-[state=on]:text-white",
        ],
      },
      size: {
        sm: "h-8 gap-1.5 px-3",
        default: "h-9 px-3",
        lg: "h-10 px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
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
