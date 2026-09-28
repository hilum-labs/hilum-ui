"use client";

import * as React from "react";
import { Toaster as SonnerToaster, toast, useSonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;
type ToastOptions = NonNullable<Parameters<typeof toast>[1]>;

/**
 * Toast host. Mount once near the app root; fire toasts with the re-exported
 * `toast()` API so apps never import `sonner` directly:
 *
 *   import { Toaster, toast } from "@hilum/ui";
 *   toast.success("Product saved");
 *   toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Could not save" });
 *
 * Colours come from Hilum tokens, so the default `theme="system"` only
 * affects Sonner's built-in icons and close button.
 */
function Toaster({ theme = "system", position = "bottom-right", ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme={theme}
      position={position}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans text-sm group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-elevated group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-brand-primary group-[.toast]:text-background group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium",
          success: "group-[.toaster]:border-brand-secondary/40 group-[.toaster]:text-foreground",
          error:
            "group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20",
          warning:
            "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning/40",
          info: "group-[.toaster]:border-border",
        },
      }}
      {...props}
    />
  );
}

export { Toaster, toast, useSonner };
export type { ToasterProps, ToastOptions };
