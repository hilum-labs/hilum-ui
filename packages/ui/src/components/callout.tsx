import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const calloutVariants = cva(
  "flex w-full min-w-0 gap-3 rounded-xl border px-4 py-3.5 shadow-natural",
  {
    variants: {
      // Tinted tones: in the mid theme the pale butter tint lightens the gray
      // under white text (4.2:1 at 15%), so it is lighter there (4.9:1 at 8%).
      tone: {
        default: "border-border bg-card text-foreground",
        info: "border-brand-secondary/50 bg-brand-secondary/15 in-data-[theme=mid]:bg-brand-secondary/8 text-foreground",
        success: "border-success/25 bg-success/10 text-foreground",
        warning: "border-warning/35 bg-warning/15 in-data-[theme=mid]:bg-warning/8 text-foreground",
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
      // Icons are ≥ 3:1 on their chip: lime and butter icons on their own
      // tint were ~1.1:1 in light mode, so those chips are solid (as in
      // AppStatusBanner) with the paired foreground; on the mid gray the
      // info and destructive tints are too, as solid chips.
      tone: {
        default: "bg-muted text-muted-foreground",
        info: "bg-brand-secondary/35 text-foreground in-data-[theme=mid]:bg-brand-secondary in-data-[theme=mid]:text-ground-900",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive:
          "bg-destructive/15 text-destructive-text in-data-[theme=mid]:bg-destructive in-data-[theme=mid]:text-destructive-foreground",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

interface CalloutProps
  extends Omit<React.ComponentProps<"div">, "title">, VariantProps<typeof calloutVariants> {
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
      data-slot="callout"
      className={cn(calloutVariants({ tone, compact }), className)}
      {...props}
    >
      {icon && <div className={cn(calloutIconVariants({ tone }))}>{icon}</div>}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {title && <p className="body font-semibold text-balance">{title}</p>}
          {description && (
            <p
              data-slot="callout-description"
              className={cn(
                "body text-pretty",
                // Muted gray fell below 4.5:1 on the tinted tones (4.49:1 on
                // info, 4.39:1 on success, 3.9:1 on destructive): tinted
                // callouts use the regular foreground, the title keeps its
                // weight.
                tone === "default" ? "text-muted-foreground" : "text-foreground",
                title && "mt-1",
              )}
            >
              {description}
            </p>
          )}
          {children && <div className={cn(title || description ? "mt-2" : "")}>{children}</div>}
        </div>
        {actions && (
          <div
            data-slot="callout-actions"
            className={cn(
              "flex shrink-0 items-center gap-2 max-sm:w-full max-sm:flex-col max-sm:items-start",
              // On mobile only buttons stretch full width; badges, links and
              // other content keep their size.
              "max-sm:[&>[data-slot=button]]:self-stretch max-sm:[&>button]:self-stretch",
            )}
          >
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
