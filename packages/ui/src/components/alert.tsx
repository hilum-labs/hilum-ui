import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl px-4 py-3.5 body [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-3.5 [&>svg~*]:ps-6",
  {
    variants: {
      // Text is ≥ 4.5:1 and icons ≥ 3:1 in light, mid and dark: muted and
      // red text on these tints were 3.8–4.3:1, and the 40–70% butter tints
      // under light text in dark mode. Tinted variants use the regular
      // foreground (as Callout); warning is the token warning surface.
      variant: {
        default: "bg-muted text-muted-foreground [&>svg]:text-muted-foreground",
        info: "bg-brand-secondary/25 in-data-[theme=mid]:bg-brand-secondary/8 text-foreground [&>svg]:text-foreground",
        success:
          "bg-brand-secondary/15 in-data-[theme=mid]:bg-brand-secondary/8 text-foreground [&>svg]:text-foreground",
        warning: "bg-warning text-warning-foreground [&>svg]:text-warning-foreground",
        destructive: "bg-destructive/10 text-foreground [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface AlertProps extends React.ComponentProps<"div">, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
Alert.displayName = "Alert";

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("mb-0.5 body font-semibold leading-tight text-balance", className)}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p data-slot="alert-description" className={cn("body text-pretty", className)} {...props} />
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
