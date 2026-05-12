import { useCallback, useState } from 'react'

interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

interface UseHistoryReturn<T> {
  state: T
  /**
   * Record a new state. Use when the user makes a logical edit. Pushes the
   * current `state` into `past` and clears `future`. Pass `{ skipHistory: true }`
   * (via a separate setter) to overwrite without pushing — apps that need that
   * can set state directly via a wrapper.
   */
  setState: (next: T | ((prev: T) => T)) => void
  /** Replace `state` without pushing onto the history stack. */
  replaceState: (next: T | ((prev: T) => T)) => void
  undo: () => void
  redo: () => void
  reset: (next: T) => void
  canUndo: boolean
  canRedo: boolean
  /** Number of past entries (undo depth). */
  pastSize: number
  /** Number of future entries (redo depth). */
  futureSize: number
}

/**
 * Generic, engine-agnostic undo/redo stack.
 *
 * @hilum/designer-canvas wires this with `useHistory<Layer[]>(layers)`.
 * A form-builder app could wire `useHistory<FormSchema>(schema)`.
 */
export function useHistory<T>(initial: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initial,
    future: [],
  })

  const setState = useCallback((next: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev.present) : next
      if (Object.is(value, prev.present)) return prev
      return {
        past: [...prev.past, prev.present],
        present: value,
        future: [],
      }
    })
  }, [])

  const replaceState = useCallback((next: T | ((prev: T) => T)) => {
    setHistory((prev) => {
      const value = typeof next === 'function' ? (next as (p: T) => T)(prev.present) : next
      return { ...prev, present: value }
    })
  }, [])

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev
      const past = prev.past.slice(0, -1)
      const previous = prev.past[prev.past.length - 1]!
      return {
        past,
        present: previous,
        future: [prev.present, ...prev.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev
      const [next, ...rest] = prev.future
      return {
        past: [...prev.past, prev.present],
        present: next!,
        future: rest,
      }
    })
  }, [])

  const reset = useCallback((next: T) => {
    setHistory({ past: [], present: next, future: [] })
  }, [])

  return {
    state: history.present,
    setState,
    replaceState,
    undo,
    redo,
    reset,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    pastSize: history.past.length,
    futureSize: history.future.length,
  }
}
