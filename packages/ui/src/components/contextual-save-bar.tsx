"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type MotionStyle } from "framer-motion";
import { CircleAlert } from "lucide-react";
import { cn } from "../lib/utils";
import { spring } from "../lib/springs";
import { Button } from "./button";

interface ContextualSaveBarProps {
  /** Show the bar — usually `form.isDirty`. */
  open: boolean;
  /** Message on the leading edge. Default: "Unsaved changes". */
  message?: React.ReactNode;
  /** Primary action. */
  onSave?: () => void;
  /** Secondary action — resets the form to its saved state. */
  onDiscard?: () => void;
  saveLabel?: React.ReactNode;
  discardLabel?: React.ReactNode;
  /** Shows a spinner on Save and disables both actions. */
  saving?: boolean;
  /** Disable Save (e.g. while the form is invalid). */
  saveDisabled?: boolean;
  /**
   * Wire the Save button to a `<form id>` instead of `onSave` — the button
   * becomes `type="submit" form={formId}` so native validation still runs.
   */
  formId?: string;
  /**
   * `fixed` pins the bar to the viewport (default): on desktop it replaces the
   * app's top bar (top 0, full width, at least `--hilum-header-height` tall,
   * above the header), like Shopify's save bar; on mobile it sits at the
   * bottom for thumb reach. `sticky` keeps it inside its scroll container —
   * useful inside a settings pane or a dialog.
   */
  position?: "fixed" | "sticky";
  /**
   * Distance from the top of the viewport in `fixed` mode (desktop) or of the
   * scroll container in `sticky` mode. Default 0: in `fixed` mode the bar
   * overlays the app top bar instead of sitting below it. Pass e.g. your header
   * height to keep the top bar visible above the save bar.
   */
  offsetTop?: number | string;
  /**
   * Text announced to screen readers when the bar appears. Defaults to
   * `message` when it is a string, else "Unsaved changes".
   */
  announcement?: string;
  /** Accessible name of the bar's region. Default "Unsaved changes". */
  regionLabel?: string;
  /** Extra content between the message and the actions (e.g. a "Preview" link). */
  children?: React.ReactNode;
  className?: string;
}

/*
 * Stack of open bars. Only the most recently opened bar handles ⌘S / Ctrl+S,
 * so a save bar inside a dialog doesn't also save the page behind it.
 */
const openBarStack: symbol[] = [];

function useSaveBarStack(open: boolean) {
  const idRef = React.useRef<symbol | null>(null);
  if (idRef.current === null) idRef.current = Symbol("contextual-save-bar");
  React.useEffect(() => {
    if (!open) return;
    const id = idRef.current as symbol;
    openBarStack.push(id);
    return () => {
      const index = openBarStack.lastIndexOf(id);
      if (index !== -1) openBarStack.splice(index, 1);
    };
  }, [open]);
  return () => openBarStack[openBarStack.length - 1] === idRef.current;
}

/**
 * Contextual save bar — the "you have unsaved changes" strip that replaces
 * per-card Save buttons on edit screens (Shopify's contextual save bar).
 * Announces itself politely to assistive tech and binds ⌘S / Ctrl+S to Save
 * while open.
 */
function ContextualSaveBar({
  open,
  message = "Unsaved changes",
  onSave,
  onDiscard,
  saveLabel = "Save",
  discardLabel = "Discard",
  saving = false,
  saveDisabled = false,
  formId,
  position = "fixed",
  offsetTop,
  announcement,
  regionLabel = "Unsaved changes",
  children,
  className,
}: ContextualSaveBarProps) {
  const reduceMotion = useReducedMotion();
  const saveRef = React.useRef<HTMLButtonElement>(null);
  const isTopBar = useSaveBarStack(open);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        if (!isTopBar()) return;
        event.preventDefault();
        if (!saving && !saveDisabled) saveRef.current?.click();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, saving, saveDisabled, isTopBar]);

  const announcementText =
    announcement ?? (typeof message === "string" ? message : "Unsaved changes");
  const offsetStyle =
    offsetTop !== undefined
      ? ({
          "--hilum-save-bar-top": typeof offsetTop === "number" ? `${offsetTop}px` : offsetTop,
        } as React.CSSProperties)
      : undefined;

  return (
    <>
      {/* Persistent live region: it must exist before the text changes for AT to announce it. */}
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {open ? announcementText : ""}
      </span>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="contextual-save-bar"
            role="region"
            aria-label={regionLabel}
            data-slot="contextual-save-bar"
            data-position={position}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={spring.fast}
            className={cn(
              "z-(--z-sticky) flex min-w-0 items-center gap-3 border-border bg-foreground px-4 py-2.5 text-background",
              position === "fixed"
                ? "fixed inset-x-0 bottom-0 border-t pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:top-[var(--hilum-save-bar-top,0px)] sm:bottom-auto sm:min-h-[var(--hilum-header-height,0px)] sm:border-t-0 sm:border-b sm:pb-2.5"
                : "sticky top-[var(--hilum-save-bar-top,0px)] rounded-xl shadow-elevated",
              className,
            )}
            {...(offsetStyle ? { style: offsetStyle as MotionStyle } : {})}
          >
            <p className="body-sm flex min-w-0 flex-1 items-center gap-2 font-medium">
              <CircleAlert className="size-4 shrink-0 opacity-70" aria-hidden="true" />
              <span className="truncate">{message}</span>
            </p>
            {children}
            <div className="flex shrink-0 items-center gap-2">
              {onDiscard && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-background/80 hover:bg-background/10 hover:text-background"
                  onClick={onDiscard}
                  disabled={saving}
                >
                  {discardLabel}
                </Button>
              )}
              <Button
                ref={saveRef}
                size="sm"
                variant="brand"
                {...(formId
                  ? { type: "submit" as const, form: formId }
                  : { type: "button" as const })}
                {...(onSave ? { onClick: onSave } : {})}
                loading={saving}
                disabled={saveDisabled}
              >
                {saveLabel}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

ContextualSaveBar.displayName = "ContextualSaveBar";

/**
 * Warn before the tab closes / reloads while `dirty` is true. Pair with
 * ContextualSaveBar; route-level blocking belongs to your router.
 */
function useUnsavedChangesWarning(dirty: boolean) {
  React.useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Legacy browsers require returnValue to be set.
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}

export { ContextualSaveBar, useUnsavedChangesWarning };
export type { ContextualSaveBarProps };
