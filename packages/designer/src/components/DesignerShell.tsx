import type { ReactNode } from "react";
import { cn, DensityProvider, type Density } from "@hilum/ui";

interface DesignerShellProps {
  className?: string;
  /**
   * Control density for everything inside the shell. Editor chrome defaults
   * to `"compact"` (24px controls, 28px rows, 12px text); pass `"default"` to
   * keep standard Hilum sizing.
   */
  density?: Density;
  children: ReactNode;
}

/**
 * Root layout for an editor app — full viewport, themed surface.
 * Place a <DesignerHeader>, <DesignerSidebar>, <DesignerPanel>, and the
 * canvas content as children.
 */
function DesignerShell({ className, density = "compact", children }: DesignerShellProps) {
  return (
    <DensityProvider density={density} wrap={false}>
      <div
        data-designer-shell
        data-density={density}
        className={cn(
          "flex flex-col h-screen w-screen overflow-hidden bg-canvas text-foreground",
          className,
        )}
      >
        {children}
      </div>
    </DensityProvider>
  );
}

export { DesignerShell };
export type { DesignerShellProps };
