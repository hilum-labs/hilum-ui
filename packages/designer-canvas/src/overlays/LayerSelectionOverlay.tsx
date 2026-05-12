import { useShellContext } from '@hilum/designer'
import { useCanvasContext } from '../context/CanvasContext'

/**
 * Renders blue selection rectangles around currently-selected layers.
 * Non-interactive — drag/resize handles can be added in a future iteration.
 */
function LayerSelectionOverlay() {
  const { state } = useCanvasContext()
  const { selectedIds } = useShellContext()
  if (selectedIds.length === 0) return null

  const ids = new Set(selectedIds)
  const selected = state.layers.filter((l) => ids.has(l.id))

  return (
    <>
      {selected.map((l) => (
        <div
          key={l.id}
          className="absolute pointer-events-none"
          style={{
            left: l.x,
            top: l.y,
            width: l.width,
            height: l.height,
            transform: `rotate(${l.rotation ?? 0}deg)`,
            outline: `1.5px solid ${state.accentColor}`,
            outlineOffset: -1,
          }}
          aria-hidden
        />
      ))}
    </>
  )
}

export { LayerSelectionOverlay }
