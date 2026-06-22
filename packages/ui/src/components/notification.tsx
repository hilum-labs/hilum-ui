import * as React from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "../lib/utils";

interface NotificationAction {
  label: string;
  onClick?: () => void;
  variant?: "default" | "ghost";
}

interface NotificationProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  actions?: NotificationAction[];
  onClose?: () => void;
  className?: string;
}

const variantConfig = {
  default: { icon: null, iconClass: "text-muted-foreground" },
  success: {
    icon: CheckCircle,
    iconClass: "bg-brand-secondary/25 text-muted-foreground rounded-full p-1",
  },
  error: { icon: AlertCircle, iconClass: "text-destructive" },
  warning: {
    icon: AlertTriangle,
    iconClass: "bg-brand-secondary/80 text-muted-foreground rounded-full p-1",
  },
  info: { icon: Info, iconClass: "text-muted-foreground" },
};

function Notification({
  title,
  description,
  icon,
  variant = "default",
  actions,
  onClose,
  className,
}: NotificationProps) {
  const config = variantConfig[variant];
  const DefaultIcon = config.icon;

  const resolvedIcon = icon ?? (DefaultIcon ? <DefaultIcon size={20} /> : null);

  return (
    <div
      className={cn(
        "pointer-events-auto w-full max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-elevated",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          {resolvedIcon && (
            <div className={cn("shrink-0 mt-0.5", config.iconClass)}>{resolvedIcon}</div>
          )}

          {/* Body */}
          <div className="min-w-0 flex-1">
            <p className="body font-semibold text-foreground text-balance">{title}</p>
            {description && (
              <p className="mt-0.5 body text-muted-foreground text-pretty">{description}</p>
            )}

            {/* Actions */}
            {actions && actions.length > 0 && (
              <div className="mt-3 flex gap-3">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={action.onClick}
                    className={cn(
                      "min-h-10 body font-semibold transition-colors",
                      action.variant === "ghost"
                        ? "text-muted-foreground hover:text-muted-foreground"
                        : "text-foreground hover:text-muted-foreground",
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close */}
          {onClose && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-[color,scale] hover:text-muted-foreground active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              >
                <span className="sr-only">Close</span>
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Notification.displayName = "Notification";

export { Notification };
