import { createContext, useContext, useId, useState, type ReactNode } from "react";
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
  /** Right-aligned action / control, e.g. a "+" icon Button. */
  action?: ReactNode;
  /**
   * Muted, normal-weight title for an empty or optional section (Figma's
   * "Fill" with only a "+"): pair it with an `action` that adds content.
   */
  muted?: boolean;
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
 *
 * In compact density (the DesignerPanel default) the title sits flush with
 * the field labels and the collapse chevron trails the title's actions.
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
  const contentId = useId();

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
    <PaneContext.Provider
      value={{ open, toggle: () => setOpen((v) => !v), collapsible, contentId }}
    >
      <section
        className={cn(
          "flex min-w-0 max-w-full flex-col overflow-x-hidden border-b border-border last:border-b-0",
          "compact:border-[color:var(--density-divider)]",
          className,
        )}
      >
        {children}
      </section>
    </PaneContext.Provider>
  );
}

function DesignerPaneTitle({ className, children, action, muted = false }: DesignerPaneTitleProps) {
  const { open, toggle, collapsible, contentId } = usePaneContext();

  // The header row holds the title, then the actions, then (compact) the
  // chevron, so the actions are never nested inside the title <button>.
  const titleClasses = "flex min-w-0 flex-1 items-center gap-1.5 self-stretch text-start";
  return (
    <div
      className={cn(
        "flex min-h-10 w-full items-center gap-2 px-3",
        "caption-xs uppercase tracking-wider font-semibold text-muted-foreground",
        // Compact: sentence-case section titles in the foreground colour.
        "compact:min-h-8 compact:text-[11px] compact:normal-case compact:tracking-normal compact:text-foreground",
        muted && "font-normal compact:text-muted-foreground",
        className,
      )}
    >
      {collapsible ? (
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={contentId}
          className={cn(
            titleClasses,
            "py-2 compact:py-1.5",
            "hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
          )}
        >
          {/* Default density: leading chevron. Compact moves it after the actions. */}
          <ChevronDown
            size={12}
            className={cn(
              "shrink-0 transition-transform duration-150 compact:hidden",
              !open && "-rotate-90",
            )}
          />
          {children}
        </button>
      ) : (
        <div className={cn(titleClasses, "py-2 compact:py-1.5")}>{children}</div>
      )}
      {action && <div className="flex shrink-0 items-center">{action}</div>}
      {collapsible && (
        // Pointer affordance only: the title button is the accessible control.
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          data-slot="designer-pane-chevron"
          onClick={toggle}
          className={cn(
            "hidden size-6 shrink-0 items-center justify-center rounded-[5px] text-muted-foreground outline-none",
            "transition-colors hover:bg-hover hover:text-foreground compact:flex",
          )}
        >
          <ChevronDown
            size={14}
            className={cn("transition-transform duration-150", !open && "-rotate-90 rtl:rotate-90")}
          />
        </button>
      )}
    </div>
  );
}

function DesignerPaneContent({ className, children }: DesignerPaneContentProps) {
  const { open, contentId } = usePaneContext();
  if (!open) return null;
  return (
    <div
      id={contentId}
      className={cn(
        // px-3 matches the title, so section titles and field labels share an edge.
        "flex min-w-0 max-w-full flex-col gap-2 overflow-x-hidden px-3 pb-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

// --- internal pane context (so title and content stay in sync) ---

interface PaneCtx {
  open: boolean;
  toggle: () => void;
  collapsible: boolean;
  /** id of the DesignerPaneContent, referenced by the title's aria-controls. */
  contentId?: string;
}
const PaneContext = createContext<PaneCtx>({ open: true, toggle: () => {}, collapsible: false });
function usePaneContext() {
  return useContext(PaneContext);
}

export { DesignerPane, DesignerPaneTitle, DesignerPaneContent };
export type { DesignerPaneProps, DesignerPaneTitleProps, DesignerPaneContentProps };
