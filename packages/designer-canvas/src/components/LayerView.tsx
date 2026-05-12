import { useShellContext } from '@hilum/designer'
import { cn } from '@hilum/ui'
import { useCanvasContext } from '../context/CanvasContext'
import { useDragInteraction } from '../hooks/useDragInteraction'
import { useLayerRenderer } from '../renderer/RendererProvider'
import type { Layer } from '../types'

interface LayerViewProps {
  layer: Layer<unknown>
  /** Disable interactions (used by DesignerStaticFrame). */
  staticMode?: boolean
}

/**
 * Internal: renders a single layer at its computed position. Wraps the
 * app-supplied renderer with position / size / rotation / opacity, and
 * wires drag + click-to-select.
 */
function LayerView({ layer, staticMode = false }: LayerViewProps) {
  const { state } = useCanvasContext()
  const { selectedIds, setSelectedIds, readOnly } = useShellContext()
  const Renderer = useLayerRenderer(layer.type)
  const { onPointerDown } = useDragInteraction({
    layerId: layer.id,
    scale: 1 / state.zoom,
  })

  const selected = selectedIds.includes(layer.id)
  const isVisible = layer.isVisible !== false

  if (!isVisible) return null

  const transform = `rotate(${layer.rotation ?? 0}deg)`
  const cursor = layer.isLocked ? 'default' : 'move'

  return (
    <div
      data-layer-id={layer.id}
      onPointerDown={
        staticMode
          ? undefined
          : (e) => {
              if (readOnly) return
              if (e.button !== 0) return
              if (!selected) {
                setSelectedIds(e.shiftKey ? [...selectedIds, layer.id] : [layer.id])
              }
              onPointerDown(e)
            }
      }
      className={cn(
        'absolute',
        !staticMode && 'cursor-move',
        layer.isLocked && 'cursor-default',
      )}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity ?? 1,
        transform,
        cursor: staticMode ? 'default' : cursor,
      }}
    >
      {Renderer ? (
        <Renderer
          layer={layer}
          ctx={{ selected, zoom: state.zoom, readOnly: readOnly || staticMode }}
        />
      ) : (
        <FallbackRenderer layer={layer} />
      )}
    </div>
  )
}

function FallbackRenderer({ layer }: { layer: Layer<unknown> }) {
  return (
    <div
      className="size-full flex items-center justify-center bg-white border border-dashed border-taupe-300 caption text-taupe-400"
      title={`No renderer registered for type "${layer.type}"`}
    >
      {layer.type}
    </div>
  )
}

export { LayerView }
export type { LayerViewProps }
