import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-xl px-4 py-3.5 body [&>svg]:absolute [&>svg]:start-4 [&>svg]:top-3.5 [&>svg~*]:ps-6",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground [&>svg]:text-muted-foreground",
        info: "bg-brand-secondary/40 text-muted-foreground [&>svg]:text-muted-foreground",
        success: "bg-brand-secondary/15 text-muted-foreground [&>svg]:text-muted-foreground",
        warning: "bg-brand-secondary/70 text-muted-foreground [&>svg]:text-muted-foreground",
        destructive: "bg-destructive/10 text-destructive [&>svg]:text-destructive/70",
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
    <p
      data-slot="alert-description"
      className={cn("body text-pretty opacity-90", className)}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
