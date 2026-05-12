import type { ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerHeaderProps {
  /** Left-aligned content — file name, breadcrumbs, project switcher. */
  left?: ReactNode;
  /** Center content — typically the active document title. */
  center?: ReactNode;
  /** Right-aligned content — share, export, presence, account. */
  right?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Top bar of an editor app. Slot-driven — the chrome doesn't know what
 * goes in each region. Use <DesignerHeader left={...} center={...} right={...} />.
 */
function DesignerHeader({ left, center, right, className, children }: DesignerHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-12 items-center justify-between gap-3 border-b border-taupe-100 bg-white px-3 shrink-0",
        className,
      )}
    >
      <div className="flex items-center gap-2 min-w-0">{left}</div>
      {center && <div className="flex items-center gap-2 min-w-0">{center}</div>}
      <div className="flex items-center gap-2 min-w-0">{right}</div>
      {children}
    </header>
  );
}

export { DesignerHeader };
export type { DesignerHeaderProps };
