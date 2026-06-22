import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@hilum/ui";
import { useShellContext } from "../shell/ShellContext";

interface DesignerPaneProps {
  /**
   * Predicate or list of allowed kinds. The pane renders only when matched.
   *
   * - `string[]`: render when at least one selected ID resolves to one of
   *   these kinds (requires `ShellContext.resolveKind`).
   * - `(selectedIds: string[]) => boolean`: full predicate.
   * - omitted: always render.
   */
  showFor?: string[] | ((selectedIds: string[]) => boolean);
  collapsible?: boolean;
  defaultOpen?: boolean;
  className?: string;
  children: ReactNode;
}

interface DesignerPaneTitleProps {
  className?: string;
  children: ReactNode;
  /** Right-aligned action / control. */
  action?: ReactNode;
}

interface DesignerPaneContentProps {
  className?: string;
  children: ReactNode;
}

/**
 * Collapsible inspector section. Use inside a <DesignerPanel>.
 *
 * <DesignerPane showFor={["text"]} collapsible>
 *   <DesignerPaneTitle>Typography</DesignerPaneTitle>
 *   <DesignerPaneContent>...</DesignerPaneContent>
 * </DesignerPane>
 */
function DesignerPane({
  showFor,
  collapsible = false,
  defaultOpen = true,
  className,
  children,
}: DesignerPaneProps) {
  const { selectedIds, resolveKind } = useShellContext();
  const [open, setOpen] = useState(defaultOpen);

  // Visibility check.
  let visible = true;
  if (typeof showFor === "function") {
    visible = showFor(selectedIds);
  } else if (Array.isArray(showFor)) {
    if (!resolveKind) {
      // No resolver: best effort — show only if any IDs are selected.
      visible = selectedIds.length > 0;
    } else {
      visible = selectedIds.some((id) => {
        const kind = resolveKind(id);
        return kind != null && showFor.includes(kind);
      });
    }
  }
  if (!visible) return null;

  return (
    <PaneContext.Provider value={{ open, toggle: () => setOpen((v) => !v), collapsible }}>
      <section
        className={cn(
          "flex min-w-0 max-w-full flex-col overflow-x-hidden border-b border-border last:border-b-0",
          className,
        )}
      >
        {children}
      </section>
    </PaneContext.Provider>
  );
}

function DesignerPaneTitle({ className, children, action }: DesignerPaneTitleProps) {
  const { open, toggle, collapsible } = usePaneContext();

  const Tag = collapsible ? "button" : "div";
  return (
    <Tag
      type={collapsible ? "button" : undefined}
      onClick={collapsible ? toggle : undefined}
      className={cn(
        "flex min-h-10 w-full items-center justify-between gap-2 px-3 py-2 text-left",
        "caption-xs uppercase tracking-wider font-semibold text-muted-foreground",
        collapsible && "hover:text-foreground transition-colors",
        className,
      )}
    >
      <span className="flex items-center gap-1.5">
        {collapsible && (
          <ChevronDown
            size={12}
            className={cn("transition-transform duration-150", !open && "-rotate-90")}
          />
        )}
        {children}
      </span>
      {action && <span className="ml-auto">{action}</span>}
    </Tag>
  );
}

function DesignerPaneContent({ className, children }: DesignerPaneContentProps) {
  const { open } = usePaneContext();
  if (!open) return null;
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-col gap-2 overflow-x-hidden px-3 pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- internal pane context (so title and content stay in sync) ---

import { createContext, useContext } from "react";

interface PaneCtx {
  open: boolean;
  toggle: () => void;
  collapsible: boolean;
}
const PaneContext = createContext<PaneCtx>({ open: true, toggle: () => {}, collapsible: false });
function usePaneContext() {
  return useContext(PaneContext);
}

export { DesignerPane, DesignerPaneTitle, DesignerPaneContent };
export type { DesignerPaneProps, DesignerPaneTitleProps, DesignerPaneContentProps };
