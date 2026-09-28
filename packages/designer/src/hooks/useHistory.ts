import { useCallback, useEffect, useRef, useState } from "react";

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export interface UseHistoryOptions {
  /**
   * Maximum number of undo steps kept. The oldest entries are dropped once
   * the limit is exceeded. Default: 100. Pass `Infinity` for an unbounded
   * stack.
   */
  limit?: number;
}

export interface UseHistoryReturn<T> {
  state: T;
  /**
   * Record a new state. Use when the user makes a logical edit. Pushes the
   * current `state` into `past` and clears `future` — unless a transaction is
   * open, in which case the edit is folded into the transaction's single
   * entry (see `beginTransaction`).
   */
  setState: (next: T | ((prev: T) => T)) => void;
  /** Replace `state` without pushing onto the history stack. */
  replaceState: (next: T | ((prev: T) => T)) => void;
  /**
   * Step back one entry. Returns the new present state so callers can apply
   * it synchronously (e.g. dispatch it to a reducer) without waiting for a
   * re-render. Commits an open transaction first.
   */
  undo: () => T;
  /** Step forward one entry. Returns the new present state. */
  redo: () => T;
  reset: (next: T) => void;
  /**
   * Start grouping edits into one undo step — e.g. at the start of a drag
   * gesture. Every `setState` until `commitTransaction` updates the present
   * state without pushing, and the commit records a single entry. Calls nest;
   * only the outermost commit records.
   */
  beginTransaction: () => void;
  /** Close the open transaction, recording one entry if the state changed. */
  commitTransaction: () => void;
  /** Close the open transaction and restore the state from before it began. */
  cancelTransaction: () => void;
  /** Latest present state, readable synchronously from event handlers. */
  getState: () => T;
  canUndo: boolean;
  canRedo: boolean;
  /** Number of past entries (undo depth). */
  pastSize: number;
  /** Number of future entries (redo depth). */
  futureSize: number;
}

export const DEFAULT_HISTORY_LIMIT = 100;

function trim<T>(past: T[], limit: number): T[] {
  const max = Math.max(0, limit);
  return past.length > max ? past.slice(past.length - max) : past;
}

function resolve<T>(next: T | ((prev: T) => T), prev: T): T {
  return typeof next === "function" ? (next as (p: T) => T)(prev) : next;
}

/**
 * Generic, engine-agnostic undo/redo stack.
 *
 * @hilum/designer-canvas wires this with `useHistory<Layer[]>(layers)`.
 * A form-builder app could wire `useHistory<FormSchema>(schema)`.
 */
export function useHistory<T>(
  initial: T,
  { limit = DEFAULT_HISTORY_LIMIT }: UseHistoryOptions = {},
): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initial,
    future: [],
  });

  // The ref is the source of truth for transitions so `undo()` / `redo()`
  // can return the resulting state synchronously and several calls in one
  // tick compose correctly. React state mirrors it for rendering.
  const historyRef = useRef(history);
  const limitRef = useRef(limit);
  useEffect(() => {
    limitRef.current = limit;
  }, [limit]);
  const txRef = useRef<{ base: T; depth: number } | null>(null);

  const commit = useCallback((next: HistoryState<T>) => {
    if (next === historyRef.current) return;
    historyRef.current = next;
    setHistory(next);
  }, []);

  const setState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = historyRef.current;
      const value = resolve(next, prev.present);
      if (Object.is(value, prev.present)) return;
      if (txRef.current) {
        commit({ ...prev, present: value });
        return;
      }
      commit({
        past: trim([...prev.past, prev.present], limitRef.current),
        present: value,
        future: [],
      });
    },
    [commit],
  );

  const replaceState = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = historyRef.current;
      commit({ ...prev, present: resolve(next, prev.present) });
    },
    [commit],
  );

  const beginTransaction = useCallback(() => {
    if (txRef.current) txRef.current.depth += 1;
    else txRef.current = { base: historyRef.current.present, depth: 1 };
  }, []);

  const commitTransaction = useCallback(() => {
    const tx = txRef.current;
    if (!tx) return;
    tx.depth -= 1;
    if (tx.depth > 0) return;
    txRef.current = null;
    const prev = historyRef.current;
    if (Object.is(tx.base, prev.present)) return;
    commit({
      past: trim([...prev.past, tx.base], limitRef.current),
      present: prev.present,
      future: [],
    });
  }, [commit]);

  const cancelTransaction = useCallback(() => {
    const tx = txRef.current;
    if (!tx) return;
    txRef.current = null;
    commit({ ...historyRef.current, present: tx.base });
  }, [commit]);

  const flushTransaction = useCallback(() => {
    if (!txRef.current) return;
    txRef.current.depth = 1;
    commitTransaction();
  }, [commitTransaction]);

  const undo = useCallback((): T => {
    flushTransaction();
    const prev = historyRef.current;
    if (prev.past.length === 0) return prev.present;
    const previous = prev.past[prev.past.length - 1]!;
    commit({
      past: prev.past.slice(0, -1),
      present: previous,
      future: [prev.present, ...prev.future],
    });
    return previous;
  }, [commit, flushTransaction]);

  const redo = useCallback((): T => {
    flushTransaction();
    const prev = historyRef.current;
    if (prev.future.length === 0) return prev.present;
    const [next, ...rest] = prev.future;
    commit({
      past: trim([...prev.past, prev.present], limitRef.current),
      present: next!,
      future: rest,
    });
    return next!;
  }, [commit, flushTransaction]);

  const reset = useCallback(
    (next: T) => {
      txRef.current = null;
      commit({ past: [], present: next, future: [] });
    },
    [commit],
  );

  const getState = useCallback(() => historyRef.current.present, []);

  return {
    state: history.present,
    setState,
    replaceState,
    undo,
    redo,
    reset,
    beginTransaction,
    commitTransaction,
    cancelTransaction,
    getState,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    pastSize: history.past.length,
    futureSize: history.future.length,
  };
}
