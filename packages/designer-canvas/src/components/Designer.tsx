import type { ReactNode } from "react";
import { CanvasProvider } from "../context/CanvasProvider";
import { RendererProvider } from "../renderer/RendererProvider";
import { useCanvasKeyboardShortcuts } from "../hooks/useCanvasKeyboardShortcuts";
import type { CanvasState } from "../context/state";
import type { CanvasServices } from "../services/types";
import type { RendererRegistry } from "../renderer/types";

interface DesignerProps<TData = Record<string, unknown>> {
  /** Initial canvas state. Layers, frame size, theme. */
  initial?: Partial<CanvasState<TData>>;
  /** Renderers per layer type. */
  renderers?: RendererRegistry;
  /** Optional injected services (paths, fonts, units, image upload). */
  services?: CanvasServices;
  /** Read-only mode (e.g. for previews). */
  readOnly?: boolean;
  /** Receive every state transition. */
  onChange?: (state: CanvasState<TData>) => void;
  /**
   * Enable the built-in canvas keyboard shortcuts (undo / redo, delete,
   * select all, arrow nudge, duplicate, group, zoom, V / H tools).
   * Default: true. See
   * `useCanvasKeyboardShortcuts`.
   */
  keyboardShortcuts?: boolean;
  /** Maximum undo depth. Default: 100. */
  historyLimit?: number;
  children: ReactNode;
}

/**
 * Root provider for a canvas-editor app. Mounts ShellProvider (selection,
 * tool, read-only) + CanvasProvider (layers, viewport, artboard, shared
 * undo / redo history) + RendererProvider (per-type renderers), and wires
 * the standard keyboard shortcuts.
 *
 * Place <DesignerCanvas><DesignerFrame /></DesignerCanvas> inside, or
 * compose with @hilum/designer's chrome (DesignerShell, Toolbar, etc.).
 */
function Designer<TData = Record<string, unknown>>({
  initial,
  renderers = {},
  services = {},
  readOnly,
  onChange,
  keyboardShortcuts = true,
  historyLimit,
  children,
}: DesignerProps<TData>) {
  return (
    <CanvasProvider<TData>
      {...(initial !== undefined && { initial })}
      services={services}
      {...(readOnly !== undefined && { readOnly })}
      {...(onChange !== undefined && { onChange })}
      {...(historyLimit !== undefined && { historyLimit })}
    >
      <CanvasKeyboardShortcuts disabled={!keyboardShortcuts} />
      <RendererProvider renderers={renderers}>{children}</RendererProvider>
    </CanvasProvider>
  );
}

function CanvasKeyboardShortcuts({ disabled }: { disabled: boolean }) {
  useCanvasKeyboardShortcuts({ disabled });
  return null;
}

export { Designer };
export type { DesignerProps };
