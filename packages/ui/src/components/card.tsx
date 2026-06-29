import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import { motionClasses } from "../lib/interaction";

/* ------------------------------------------------------------------ */
/*  Card root                                                          */
/* ------------------------------------------------------------------ */

type CardMobileSurface = "default" | "flat" | "flush";

const cardMobileSurfaceClasses: Record<CardMobileSurface, string> = {
  default: "",
  flat: "max-sm:rounded-none max-sm:border-x-0 max-sm:border-y max-sm:bg-transparent max-sm:shadow-none",
  flush: "max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:shadow-none",
};

const cardVariants = cva(["rounded-xl", motionClasses], {
  variants: {
    variant: {
      default: "bg-card shadow-natural",
      outlined: "border border-border bg-card shadow-natural",
      elevated: "border border-border bg-card shadow-elevated",
      muted: "bg-muted shadow-natural",
      ghost: "bg-transparent",
      responsive:
        "border border-border bg-card p-5 shadow-natural sm:rounded-xl max-sm:rounded-none max-sm:border-x-0 max-sm:border-y max-sm:bg-transparent max-sm:px-0 max-sm:py-5 max-sm:shadow-none",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface CardProps extends React.ComponentProps<"div">, VariantProps<typeof cardVariants> {
  mobileSurface?: CardMobileSurface;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, mobileSurface = "default", ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn(cardVariants({ variant }), cardMobileSurfaceClasses[mobileSurface], className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

/* ------------------------------------------------------------------ */
/*  Card sub-components                                                */
/* ------------------------------------------------------------------ */

const CardHeader = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-header"
      className={cn("flex flex-col gap-1.5 p-5", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, React.ComponentProps<"h3">>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="card-title"
      className={cn("subheading text-balance text-foreground", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.ComponentProps<"p">>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn("caption text-pretty text-muted-foreground", className)}
      {...props}
    />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="card-content" className={cn("p-5 pt-0", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-footer"
      className={cn("flex items-center p-5 pt-0", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

const CardAction = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  ),
);
CardAction.displayName = "CardAction";

/* ------------------------------------------------------------------ */
/*  CardMedia — full-bleed image/gradient header                       */
/* ------------------------------------------------------------------ */

const CardMedia = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card-media"
      className={cn("relative overflow-hidden", className)}
      {...props}
    />
  ),
);
CardMedia.displayName = "CardMedia";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  CardMedia,
  cardVariants,
};
export type { CardMobileSurface, CardProps };
