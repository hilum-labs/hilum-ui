import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerShellProps {
  className?: string;
  children: ReactNode;
}

/**
 * Root layout for an editor app — full viewport, themed surface.
 * Place a <DesignerHeader>, <DesignerSidebar>, <DesignerPanel>, and the
 * canvas content as children.
 */
function DesignerShell({ className, children }: DesignerShellProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-screen w-screen overflow-hidden bg-ground-50 text-ground-900",
        className,
      )}
    >
      {children}
    </div>
  );
}

export { DesignerShell };
export type { DesignerShellProps };
