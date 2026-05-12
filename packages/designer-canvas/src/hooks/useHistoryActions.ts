import { useEffect, useRef } from 'react'
import { useHistory } from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'
import type { Layer } from '../types'

/**
 * Wires `@hilum/designer`'s generic `useHistory<T>` to the canvas reducer.
 *
 * Apps don't usually use this directly — `<Designer>` mounts it. The pattern:
 * the reducer commits state on every dispatch; this hook syncs the layers
 * slice into the history stack when changes are user-initiated.
 *
 * For now, the canvas's reducer doesn't directly track history (history lives
 * in @hilum/designer's hook). Apps that want canvas-level undo/redo wire
 * `useHistory<Layer[]>(initialLayers)` and dispatch `SET_LAYERS` to apply
 * undo / redo results.
 */
export function useHistoryActions<TData = Record<string, unknown>>() {
  const { state, dispatch } = useCanvasContext<TData>()
  const initialRef = useRef(state.layers)
  const hist = useHistory<Layer<TData>[]>(initialRef.current)

  // When state.layers changes (user dispatched a mutation), push to history.
  // Skip the initial mount and any echo from undo/redo.
  const lastSeenRef = useRef(state.layers)
  useEffect(() => {
    if (state.layers === lastSeenRef.current) return
    if (state.layers === hist.state) {
      // We just reflected an undo/redo result; don't re-push.
      lastSeenRef.current = state.layers
      return
    }
    hist.setState(state.layers)
    lastSeenRef.current = state.layers
  }, [state.layers, hist])

  const undo = () => {
    hist.undo()
    // Apply the new history.state to the reducer on the next tick.
    queueMicrotask(() => dispatch({ type: 'SET_LAYERS', payload: hist.state }))
  }

  const redo = () => {
    hist.redo()
    queueMicrotask(() => dispatch({ type: 'SET_LAYERS', payload: hist.state }))
  }

  return { undo, redo, canUndo: hist.canUndo, canRedo: hist.canRedo }
}
