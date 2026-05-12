import { useCallback } from 'react'
import { useCanvasContext } from '../context/CanvasContext'

interface UseZoomReturn {
  zoom: number
  setZoom: (next: number) => void
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  /** Fit zoom to bring the artboard into view, given an outer container. */
  fitZoom: (container: { width: number; height: number }, padding?: number) => void
}

const ZOOM_STEPS = [0.05, 0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24, 32]

function nextStep(zoom: number, dir: 'in' | 'out'): number {
  if (dir === 'in') {
    return ZOOM_STEPS.find((s) => s > zoom) ?? ZOOM_STEPS[ZOOM_STEPS.length - 1]!
  }
  let prev = ZOOM_STEPS[0]!
  for (const s of ZOOM_STEPS) {
    if (s >= zoom) break
    prev = s
  }
  return prev
}

export function useZoom(): UseZoomReturn {
  const { state, dispatch } = useCanvasContext()

  const setZoom = useCallback((next: number) => dispatch({ type: 'SET_ZOOM', payload: next }), [dispatch])

  const zoomIn = useCallback(
    () => dispatch({ type: 'SET_ZOOM', payload: nextStep(state.zoom, 'in') }),
    [dispatch, state.zoom],
  )

  const zoomOut = useCallback(
    () => dispatch({ type: 'SET_ZOOM', payload: nextStep(state.zoom, 'out') }),
    [dispatch, state.zoom],
  )

  const resetZoom = useCallback(() => dispatch({ type: 'SET_ZOOM', payload: 1 }), [dispatch])

  const fitZoom = useCallback(
    ({ width, height }: { width: number; height: number }, padding = 64) => {
      const ratio = Math.min(
        (width - padding) / state.frameSize.width,
        (height - padding) / state.frameSize.height,
      )
      dispatch({ type: 'SET_ZOOM', payload: Math.max(0.05, Math.min(32, ratio)) })
      dispatch({ type: 'SET_PAN', payload: { x: 0, y: 0 } })
    },
    [dispatch, state.frameSize],
  )

  return { zoom: state.zoom, setZoom, zoomIn, zoomOut, resetZoom, fitZoom }
}
