import { createContext, useContext, type Dispatch } from 'react'
import type { CanvasAction } from './reducer'
import type { CanvasState } from './state'
import type { CanvasServices } from '../services/types'

export interface CanvasContextValue<TData = Record<string, unknown>> {
  state: CanvasState<TData>
  dispatch: Dispatch<CanvasAction<TData>>
  services: CanvasServices
  /** Bumped on each commit. Apps can use it as a memoization key. */
  revision: number
}

// `unknown` here is fine — consumers narrow via the typed hooks below.
const CanvasContext = createContext<CanvasContextValue<unknown> | null>(null)

export function useCanvasContext<TData = Record<string, unknown>>(): CanvasContextValue<TData> {
  const ctx = useContext(CanvasContext as unknown as React.Context<CanvasContextValue<TData> | null>)
  if (!ctx) {
    throw new Error(
      '@hilum/designer-canvas: useCanvasContext must be used inside <Designer> / <CanvasProvider>.',
    )
  }
  return ctx
}

export const CanvasContextProvider = CanvasContext.Provider as unknown as React.Provider<
  CanvasContextValue<unknown>
>

import type * as React from 'react'
