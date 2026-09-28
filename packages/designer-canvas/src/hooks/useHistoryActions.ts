import { useCanvasHistory, type CanvasHistoryValue } from "../context/CanvasHistory";

/**
 * Undo / redo for the canvas layers.
 *
 * History is a single instance per `<Designer>` / `<CanvasProvider>`, so
 * every caller (toolbar buttons, keyboard shortcuts, app code) shares one
 * stack. Each committed layer change is one entry; a drag gesture is grouped
 * into a single entry via `beginTransaction` / `commitTransaction`.
 *
 * The type parameter is accepted for backward compatibility only.
 */
export function useHistoryActions<_TData = Record<string, unknown>>(): CanvasHistoryValue {
  return useCanvasHistory();
}
