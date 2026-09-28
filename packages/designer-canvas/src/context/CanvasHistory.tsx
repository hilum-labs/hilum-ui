import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useHistory } from "@hilum/designer";
import { useCanvasContext } from "./CanvasContext";
import type { Layer } from "../types";

export interface CanvasHistoryValue {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /**
   * Group every layer change until `commitTransaction` into one undo step.
   * The drag interaction wraps each gesture in a transaction.
   */
  beginTransaction: () => void;
  commitTransaction: () => void;
  /** Close the transaction and restore the layers from before it began. */
  cancelTransaction: () => void;
}

const CanvasHistoryContext = createContext<CanvasHistoryValue | null>(null);

interface CanvasHistoryProviderProps {
  /** Maximum undo depth. Default: 100. */
  limit?: number;
  children: ReactNode;
}

/**
 * Internal: one layer history per canvas. Mounted by `<CanvasProvider>` so
 * every consumer (`<ActionUndoRedo>`, keyboard shortcuts, the drag
 * interaction) shares the same stack.
 *
 * The reducer stays the source of truth: each committed `state.layers`
 * change is recorded, and undo / redo apply the resulting snapshot with
 * `SET_LAYERS`.
 */
export function CanvasHistoryProvider<TData = Record<string, unknown>>({
  limit,
  children,
}: CanvasHistoryProviderProps) {
  const { state, dispatch } = useCanvasContext<TData>();
  const [initialLayers] = useState(state.layers);
  const hist = useHistory<Layer<TData>[]>(initialLayers, limit !== undefined ? { limit } : {});
  const { setState, getState, undo: histUndo, redo: histRedo } = hist;
  const {
    beginTransaction: histBegin,
    commitTransaction: histCommit,
    cancelTransaction: histCancel,
  } = hist;

  // Commits are applied from the effect below, after the latest layers have
  // been recorded, so the last pointermove of a drag always lands inside its
  // transaction even when React hasn't flushed it by pointerup.
  const pendingCommitRef = useRef(false);
  const [commitRequest, setCommitRequest] = useState(0);

  // The reducer ignores SET_LAYERS while read-only; don't move the history
  // either, or the two would drift apart.
  const readOnlyRef = useRef(state.readOnly);
  useEffect(() => {
    readOnlyRef.current = state.readOnly;
  }, [state.readOnly]);

  useEffect(() => {
    // Record user-initiated changes. Undo / redo results are already the
    // history's present state, so recording them is an Object.is no-op.
    if (state.layers !== getState()) setState(state.layers);
    if (pendingCommitRef.current) {
      pendingCommitRef.current = false;
      histCommit();
    }
  }, [state.layers, commitRequest, getState, setState, histCommit]);

  const flushPendingCommit = useCallback(() => {
    if (!pendingCommitRef.current) return;
    pendingCommitRef.current = false;
    histCommit();
  }, [histCommit]);

  const undo = useCallback(() => {
    if (readOnlyRef.current) return;
    flushPendingCommit();
    const before = getState();
    const layers = histUndo();
    if (layers !== before) dispatch({ type: "SET_LAYERS", payload: layers });
  }, [dispatch, getState, histUndo, flushPendingCommit]);

  const redo = useCallback(() => {
    if (readOnlyRef.current) return;
    flushPendingCommit();
    const before = getState();
    const layers = histRedo();
    if (layers !== before) dispatch({ type: "SET_LAYERS", payload: layers });
  }, [dispatch, getState, histRedo, flushPendingCommit]);

  const beginTransaction = useCallback(() => {
    // A previous gesture's commit may still be queued; close it first so the
    // new transaction doesn't nest inside it.
    flushPendingCommit();
    histBegin();
  }, [flushPendingCommit, histBegin]);

  const commitTransaction = useCallback(() => {
    pendingCommitRef.current = true;
    setCommitRequest((n) => n + 1);
  }, []);

  const cancelTransaction = useCallback(() => {
    pendingCommitRef.current = false;
    const before = getState();
    histCancel();
    const restored = getState();
    if (restored !== before) dispatch({ type: "SET_LAYERS", payload: restored });
  }, [dispatch, getState, histCancel]);

  const value = useMemo<CanvasHistoryValue>(
    () => ({
      undo,
      redo,
      canUndo: hist.canUndo && !state.readOnly,
      canRedo: hist.canRedo && !state.readOnly,
      beginTransaction,
      commitTransaction,
      cancelTransaction,
    }),
    [
      undo,
      redo,
      hist.canUndo,
      hist.canRedo,
      state.readOnly,
      beginTransaction,
      commitTransaction,
      cancelTransaction,
    ],
  );

  return <CanvasHistoryContext.Provider value={value}>{children}</CanvasHistoryContext.Provider>;
}

/** The canvas's shared history, or `null` outside `<CanvasProvider>`. */
export function useOptionalCanvasHistory(): CanvasHistoryValue | null {
  return useContext(CanvasHistoryContext);
}

/** The canvas's shared undo / redo history. */
export function useCanvasHistory(): CanvasHistoryValue {
  const ctx = useContext(CanvasHistoryContext);
  if (!ctx) {
    throw new Error(
      "@hilum/designer-canvas: useCanvasHistory / useHistoryActions must be used inside <Designer> / <CanvasProvider>.",
    );
  }
  return ctx;
}
