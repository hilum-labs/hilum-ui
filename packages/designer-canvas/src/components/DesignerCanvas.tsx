import { useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@hilum/ui'
import { useCanvasContext } from '../context/CanvasContext'

interface DesignerCanvasProps {
  className?: string
  children?: ReactNode
}

/**
 * Pan / zoom viewport. Wraps an inner transform layer that applies the
 * canvas state's pan + zoom. Children (typically `<DesignerFrame>` and
 * overlays) are rendered inside the transform.
 */
function DesignerCanvas({ className, children }: DesignerCanvasProps) {
  const { state, dispatch } = useCanvasContext()
  const ref = useRef<HTMLDivElement>(null)

  // Wheel zoom + ctrl/cmd-pan, Trackpad two-finger pan.
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const onWheel = (e: WheelEvent) => {
      // Pinch-zoom (ctrlKey on macOS trackpad).
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const factor = Math.exp(-e.deltaY * 0.01)
        const next = Math.min(32, Math.max(0.05, state.zoom * factor))
        dispatch({ type: 'SET_ZOOM', payload: next })
      } else {
        // Two-finger pan.
        e.preventDefault()
        dispatch({
          type: 'SET_PAN',
          payload: { x: state.pan.x - e.deltaX, y: state.pan.y - e.deltaY },
        })
      }
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [state.zoom, state.pan, dispatch])

  return (
    <div
      ref={ref}
      className={cn('relative flex-1 overflow-hidden bg-taupe-100 select-none', className)}
      data-canvas-root
    >
      <div
        className="absolute inset-0 origin-center"
        style={{
          transform: `translate(${state.pan.x}px, ${state.pan.y}px) scale(${state.zoom})`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export { DesignerCanvas }
export type { DesignerCanvasProps }
