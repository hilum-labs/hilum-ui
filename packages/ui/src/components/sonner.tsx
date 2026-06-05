"use client";

import * as React from "react";
import { Toaster as SonnerToaster } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

function Toaster({ ...props }: ToasterProps) {
  return (
    <SonnerToaster
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast font-sans text-sm group-[.toaster]:bg-white group-[.toaster]:text-ground-900 group-[.toaster]:border group-[.toaster]:border-ground-100 group-[.toaster]:shadow-elevated group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-ground-500 group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-brand-primary group-[.toast]:text-white group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-ground-100 group-[.toast]:text-ground-600 group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium",
          success: "group-[.toaster]:border-brand-secondary/40 group-[.toaster]:text-ground-900",
          error:
            "group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/20",
          warning:
            "group-[.toaster]:bg-warning group-[.toaster]:text-warning-foreground group-[.toaster]:border-warning/40",
          info: "group-[.toaster]:border-ground-200",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };
