import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@hilum/ui";

interface DesignerHeaderProps extends Omit<ComponentPropsWithoutRef<"header">, "children"> {
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
function DesignerHeader({
  left,
  center,
  right,
  className,
  children,
  ...props
}: DesignerHeaderProps) {
  return (
    <header
      data-designer-header
      className={cn(
        "grid h-12 shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-border bg-card px-3",
        className,
      )}
      {...props}
    >
      <div
        data-designer-header-slot="left"
        className="flex min-w-0 items-center gap-2 justify-self-start"
      >
        {left}
      </div>
      <div
        data-designer-header-slot="center"
        className="flex min-w-0 items-center gap-2 justify-self-center"
      >
        {center}
      </div>
      <div
        data-designer-header-slot="right"
        className="flex min-w-0 items-center gap-2 justify-self-end"
      >
        {right}
      </div>
      {children}
    </header>
  );
}

export { DesignerHeader };
export type { DesignerHeaderProps };
