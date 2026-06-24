import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const calloutVariants = cva(
  "flex w-full min-w-0 gap-3 rounded-xl border px-4 py-3.5 shadow-natural",
  {
    variants: {
      tone: {
        default: "border-border bg-card text-foreground",
        info: "border-brand-secondary/50 bg-brand-secondary/15 text-foreground",
        success: "border-success/25 bg-success/10 text-foreground",
        warning: "border-warning/35 bg-warning/15 text-foreground",
        destructive: "border-destructive/25 bg-destructive/10 text-foreground",
      },
      compact: {
        true: "px-3 py-2.5",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      compact: false,
    },
  },
);

const calloutIconVariants = cva(
  "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        info: "bg-brand-secondary/35 text-muted-foreground",
        success: "bg-success/15 text-success",
        warning: "bg-warning/20 text-warning",
        destructive: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

interface CalloutProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof calloutVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

function Callout({
  title,
  description,
  icon,
  actions,
  tone = "default",
  compact = false,
  className,
  children,
  role,
  ...props
}: CalloutProps) {
  const resolvedRole = role ?? (tone === "destructive" ? "alert" : "status");

  return (
    <div
      role={resolvedRole}
      className={cn(calloutVariants({ tone, compact }), className)}
      {...props}
    >
      {icon && <div className={cn(calloutIconVariants({ tone }))}>{icon}</div>}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {title && <p className="body font-semibold text-balance">{title}</p>}
          {description && (
            <p className={cn("body text-pretty text-muted-foreground", title && "mt-1")}>
              {description}
            </p>
          )}
          {children && <div className={cn(title || description ? "mt-2" : "")}>{children}</div>}
        </div>
        {actions && (
          <div className="flex shrink-0 items-center gap-2 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

Callout.displayName = "Callout";

export { Callout };
export type { CalloutProps };
