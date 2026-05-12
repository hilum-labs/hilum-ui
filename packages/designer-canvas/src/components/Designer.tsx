import type { ReactNode } from "react";
import { CanvasProvider } from "../context/CanvasProvider";
import { RendererProvider } from "../renderer/RendererProvider";
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
  children: ReactNode;
}

/**
 * Root provider for a canvas-editor app. Mounts ShellProvider (selection,
 * tool, read-only) + CanvasProvider (layers, viewport, artboard) +
 * RendererProvider (per-type renderers).
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
  children,
}: DesignerProps<TData>) {
  return (
    <CanvasProvider<TData>
      initial={initial}
      services={services}
      readOnly={readOnly}
      onChange={onChange}
    >
      <RendererProvider renderers={renderers}>{children}</RendererProvider>
    </CanvasProvider>
  );
}

export { Designer };
export type { DesignerProps };
