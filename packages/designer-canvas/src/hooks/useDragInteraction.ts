import { useCallback, useEffect, useRef, useState } from 'react'
import { useShellContext } from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

interface UseDragInteractionParams {
  layerId: string
  /** Pixel scale — typically `1 / zoom`. */
  scale?: number
}

/**
 * Pointer-driven drag for a single layer. Returns props to spread on the
 * draggable element. Holds Shift for axis-locked movement.
 *
 * Multi-select drag (move all selected layers) is handled by spreading
 * onPointerDown on each selected frame and dispatching UPDATE_LAYERS in the
 * same frame — this hook handles the single-layer case.
 */
export function useDragInteraction({ layerId, scale = 1 }: UseDragInteractionParams) {
  const { state, dispatch } = useCanvasContext()
  const { selectedIds } = useShellContext()
  const [dragging, setDragging] = useState(false)
  const startRef = useRef<{
    pointerX: number
    pointerY: number
    initial: Map<string, { x: number; y: number }>
  } | null>(null)

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (state.readOnly) return
      const layer = state.layers.find((l) => l.id === layerId)
      if (!layer || layer.isLocked) return

      // If layer is part of selection, drag all selected. Otherwise drag just this one.
      const ids = selectedIds.includes(layerId) ? selectedIds : [layerId]
      const initial = new Map<string, { x: number; y: number }>()
      for (const id of ids) {
        const l = state.layers.find((x) => x.id === id)
        if (l) initial.set(id, { x: l.x, y: l.y })
      }

      startRef.current = { pointerX: e.clientX, pointerY: e.clientY, initial }
      setDragging(true)
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [state, selectedIds, layerId],
  )

  useEffect(() => {
    if (!dragging) return

    const onMove = (e: PointerEvent) => {
      const start = startRef.current
      if (!start) return
      let dx = (e.clientX - start.pointerX) * scale
      let dy = (e.clientY - start.pointerY) * scale
      if (e.shiftKey) {
        // Axis-lock to the larger delta.
        if (Math.abs(dx) > Math.abs(dy)) dy = 0
        else dx = 0
      }
      const updates: Array<{ id: string; updates: { x: number; y: number } }> = []
      start.initial.forEach((origin, id) => {
        updates.push({ id, updates: { x: origin.x + dx, y: origin.y + dy } })
      })
      dispatch({ type: 'UPDATE_LAYERS', payload: updates })
    }

    const onUp = () => {
      startRef.current = null
      setDragging(false)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging, dispatch, scale])

  return { dragging, onPointerDown }
}

import type * as React from 'react'
