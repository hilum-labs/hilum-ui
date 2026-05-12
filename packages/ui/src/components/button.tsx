import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "../lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "body font-medium whitespace-nowrap",
    "transition-all duration-150 outline-none",
    "focus-visible:ring-2 focus-visible:ring-brand-primary/30 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary text-white hover:bg-brand-primary/90 active:bg-brand-primary/80",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        outline:
          "bg-white text-taupe-700 shadow-natural hover:bg-taupe-50 rounded-xl",
        secondary:
          "bg-taupe-100 text-taupe-700 hover:bg-taupe-200",
        brand:
          "bg-brand-secondary text-taupe-900 hover:bg-brand-secondary/90 active:bg-brand-secondary/80",
        ghost:
          "text-taupe-600 hover:bg-taupe-100 hover:text-taupe-900",
        link: "text-taupe-900 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md",
        xs: "h-6 gap-1 px-2 caption rounded-md",
        sm: "h-8 gap-1.5 px-3 rounded-md",
        lg: "h-10 px-6 rounded-md",
        icon: "size-9 rounded-md",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
