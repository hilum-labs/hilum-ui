import { useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { ShellProvider } from "@hilum/designer";
import { CanvasContextProvider } from "./CanvasContext";
import { CanvasHistoryProvider } from "./CanvasHistory";
import { canvasReducer } from "./reducer";
import { createInitialState } from "./state";
import type { CanvasState } from "./state";
import type { CanvasAction } from "./reducer";
import type { CanvasServices } from "../services/types";
import type { Layer } from "../types";

interface CanvasProviderProps<TData = Record<string, unknown>> {
  initial?: Partial<CanvasState<TData>>;
  /** Optional injected services — see PHASE_0_AUDIT.md §P0.6. */
  services?: CanvasServices;
  /** Read-only mode (e.g. for thumbnails). */
  readOnly?: boolean;
  /** Receive every state transition. Useful for syncing to external storage. */
  onChange?: (state: CanvasState<TData>) => void;
  /** Maximum undo depth of the shared layer history. Default: 100. */
  historyLimit?: number;
  children: ReactNode;
}

/**
 * Mounts ShellContext (from @hilum/designer), CanvasContext and the shared
 * layer history. Selection lives in ShellContext; layers / viewport /
 * artboard live here; undo / redo is read with `useHistoryActions()`.
 *
 * The reducer is generic on TData; apps narrow it by passing a typed
 * `initial.layerTypes` array.
 */
export function CanvasProvider<TData = Record<string, unknown>>({
  initial,
  services = {},
  readOnly = false,
  onChange,
  historyLimit,
  children,
}: CanvasProviderProps<TData>) {
  // Initial state is captured once at mount.
  const [initialState] = useState(() => createInitialState<TData>({ ...initial, readOnly }));

  const reducer = canvasReducer as (
    s: CanvasState<TData>,
    a: CanvasAction<TData>,
  ) => CanvasState<TData>;
  // `revision` counts committed state transitions. It lives in the reducer
  // state (rather than a ref bumped during render) so it's always consistent
  // with the `state` it's published alongside. No-op actions (reducer returns
  // the same object) don't bump it.
  const [{ state, revision }, dispatch] = useReducer(
    (current: { state: CanvasState<TData>; revision: number }, action: CanvasAction<TData>) => {
      const next = reducer(current.state, action);
      return next === current.state ? current : { state: next, revision: current.revision + 1 };
    },
    { state: initialState, revision: 0 },
  );

  // Map `Layer.id → Layer.type` so DesignerPane.showFor works without the
  // shell knowing about the canvas. See @hilum/designer/ShellContext.
  const resolveKind = useMemo(() => {
    const map = new Map<string, string>();
    for (const l of state.layers as Layer<TData>[]) map.set(l.id, l.type);
    return (id: string) => map.get(id);
  }, [state.layers]);

  // Notify after each committed state (including the initial one). Calling
  // onChange during render would run a parent's setState mid-render and fire
  // for renders that didn't change state; an effect keyed on `state` fires
  // exactly once per transition. The latest callback is read through a ref so
  // an inline `onChange` doesn't re-trigger the notification.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });
  useEffect(() => {
    onChangeRef.current?.(state);
  }, [state]);

  const value = useMemo(
    () => ({ state, dispatch, services, revision }),
    [state, dispatch, services, revision],
  );

  return (
    <ShellProvider readOnly={readOnly} resolveKind={resolveKind}>
      <CanvasContextProvider value={value as never}>
        <CanvasHistoryProvider {...(historyLimit !== undefined && { limit: historyLimit })}>
          {children}
        </CanvasHistoryProvider>
      </CanvasContextProvider>
    </ShellProvider>
  );
}
