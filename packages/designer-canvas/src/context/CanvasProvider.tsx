import { useMemo, useReducer, useRef, type ReactNode } from 'react'
import { ShellProvider } from '@hilum/designer'
import { CanvasContextProvider } from './CanvasContext'
import { canvasReducer } from './reducer'
import { createInitialState } from './state'
import type { CanvasState } from './state'
import type { CanvasAction } from './reducer'
import type { CanvasServices } from '../services/types'
import type { Layer } from '../types'

interface CanvasProviderProps<TData = Record<string, unknown>> {
  initial?: Partial<CanvasState<TData>>
  /** Optional injected services — see PHASE_0_AUDIT.md §P0.6. */
  services?: CanvasServices
  /** Read-only mode (e.g. for thumbnails). */
  readOnly?: boolean
  /** Receive every state transition. Useful for syncing to external storage. */
  onChange?: (state: CanvasState<TData>) => void
  children: ReactNode
}

/**
 * Mounts both ShellContext (from @hilum/designer) and CanvasContext.
 * Selection lives in ShellContext; layers / viewport / artboard live here.
 *
 * The reducer is generic on TData; apps narrow it by passing a typed
 * `initial.layerTypes` array.
 */
export function CanvasProvider<TData = Record<string, unknown>>({
  initial,
  services = {},
  readOnly = false,
  onChange,
  children,
}: CanvasProviderProps<TData>) {
  const initialState = useMemo(
    () => createInitialState<TData>({ ...initial, readOnly }),
    [], // initial state captured once at mount
  )

  const reducer = canvasReducer as (s: CanvasState<TData>, a: CanvasAction<TData>) => CanvasState<TData>
  const [state, dispatch] = useReducer(reducer, initialState)

  const revisionRef = useRef(0)
  if (state !== initialState) revisionRef.current += 0 // touched on every render

  // Map `Layer.id → Layer.type` so DesignerPane.showFor works without the
  // shell knowing about the canvas. See @hilum/designer/ShellContext.
  const resolveKind = useMemo(() => {
    const map = new Map<string, string>()
    for (const l of state.layers as Layer<TData>[]) map.set(l.id, l.type)
    return (id: string) => map.get(id)
  }, [state.layers])

  // Notify on changes (effect-style; useReducer commits before).
  if (onChange) {
    // Avoid scheduling effects for every dispatch — call inline. Idempotent.
    onChange(state)
  }

  const value = useMemo(
    () => ({ state, dispatch, services, revision: revisionRef.current }),
    [state, dispatch, services],
  )

  return (
    <ShellProvider readOnly={readOnly} resolveKind={resolveKind}>
      <CanvasContextProvider value={value as never}>{children}</CanvasContextProvider>
    </ShellProvider>
  )
}
