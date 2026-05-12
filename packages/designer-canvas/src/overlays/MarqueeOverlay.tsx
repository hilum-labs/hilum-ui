import { useEffect, useState, type RefObject } from 'react'
import { useShellContext } from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

interface MarqueeOverlayProps {
  /** Ref to the frame element this marquee is constrained to. */
  containerRef: RefObject<HTMLDivElement | null>
}

/**
 * Click-and-drag marquee selection. Listens for pointerdown on the frame
 * background; on drag, paints a translucent rectangle and selects all
 * layers whose bounding box intersects it on pointerup.
 */
function MarqueeOverlay({ containerRef }: MarqueeOverlayProps) {
  const { state } = useCanvasContext()
  const { setSelectedIds, readOnly } = useShellContext()
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  useEffect(() => {
    const node = containerRef.current
    if (!node || readOnly) return

    let start: { x: number; y: number } | null = null

    const onDown = (e: PointerEvent) => {
      // Only when user pressed directly on the frame background, not a layer.
      if (e.target !== node) return
      if (e.button !== 0) return
      const rect = node.getBoundingClientRect()
      // Coordinates in artboard-pixels (frame element is unscaled by zoom
      // because zoom is applied to a parent container).
      start = {
        x: ((e.clientX - rect.left) / rect.width) * state.frameSize.width,
        y: ((e.clientY - rect.top) / rect.height) * state.frameSize.height,
      }
      setBox({ x: start.x, y: start.y, w: 0, h: 0 })
    }

    const onMove = (e: PointerEvent) => {
      if (!start) return
      const rect = node.getBoundingClientRect()
      const cx = ((e.clientX - rect.left) / rect.width) * state.frameSize.width
      const cy = ((e.clientY - rect.top) / rect.height) * state.frameSize.height
      setBox({
        x: Math.min(start.x, cx),
        y: Math.min(start.y, cy),
        w: Math.abs(cx - start.x),
        h: Math.abs(cy - start.y),
      })
    }

    const onUp = (e: PointerEvent) => {
      if (!start || !box) {
        start = null
        setBox(null)
        return
      }
      // Compute intersection.
      const x0 = box.x
      const y0 = box.y
      const x1 = box.x + box.w
      const y1 = box.y + box.h
      const intersects = state.layers.filter((l) => {
        const lx0 = l.x
        const ly0 = l.y
        const lx1 = l.x + l.width
        const ly1 = l.y + l.height
        return lx0 < x1 && lx1 > x0 && ly0 < y1 && ly1 > y0
      })
      const ids = intersects.map((l) => l.id)
      if (e.shiftKey) {
        setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])))
      } else {
        setSelectedIds(ids)
      }
      start = null
      setBox(null)
    }

    node.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      node.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [containerRef, readOnly, state.frameSize, state.layers, setSelectedIds, box])

  if (!box || (box.w < 2 && box.h < 2)) return null

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        background: 'color-mix(in srgb, var(--brand-primary) 10%, transparent)',
        outline: '1px solid var(--brand-primary)',
      }}
      aria-hidden
    />
  )
}

export { MarqueeOverlay }
export type { MarqueeOverlayProps }
