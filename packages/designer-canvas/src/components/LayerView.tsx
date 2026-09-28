import { useShellContext } from "@hilum/designer";
import { cn } from "@hilum/ui";
import { useCanvasContext } from "../context/CanvasContext";
import { useDragInteraction } from "../hooks/useDragInteraction";
import { useLayerRenderer } from "../renderer/RendererProvider";
import type { Layer } from "../types";

interface LayerViewProps {
  layer: Layer<unknown>;
  /** Disable interactions (used by DesignerStaticFrame). */
  staticMode?: boolean;
}

/**
 * Internal: renders a single layer at its computed position. Wraps the
 * app-supplied renderer with position / size / rotation / opacity, and
 * wires drag + click-to-select.
 */
function LayerView({ layer, staticMode = false }: LayerViewProps) {
  const { state } = useCanvasContext();
  const { selectedIds, setSelectedIds, readOnly, activeTool } = useShellContext();
  const Renderer = useLayerRenderer(layer.type);
  const { onPointerDown } = useDragInteraction({
    layerId: layer.id,
    scale: 1 / state.zoom,
  });

  const selected = selectedIds.includes(layer.id);
  const isVisible = layer.isVisible !== false;

  if (!isVisible) return null;

  const transform = `rotate(${layer.rotation ?? 0}deg)`;
  const cursor = layer.isLocked ? "default" : "move";
  // Flip actions (TRANSFORM_LAYERS) store -1 in data._flipX / data._flipY.
  const flipTransform = getFlipTransform(layer.data);

  return (
    <div
      data-layer-id={layer.id}
      onPointerDown={
        staticMode
          ? undefined
          : (e) => {
              if (readOnly) return;
              if (e.button !== 0) return;
              // The hand tool pans the canvas instead (see DesignerCanvas).
              if (activeTool === "hand") return;
              let nextSelection = selectedIds;
              if (!selected) {
                nextSelection = e.shiftKey ? [...selectedIds, layer.id] : [layer.id];
                setSelectedIds(nextSelection);
              }
              // Pass the new selection explicitly: `selectedIds` from context
              // won't reflect it until the next render.
              onPointerDown(e, nextSelection);
            }
      }
      className={cn("absolute", !staticMode && "cursor-move", layer.isLocked && "cursor-default")}
      style={{
        left: layer.x,
        top: layer.y,
        width: layer.width,
        height: layer.height,
        opacity: layer.opacity ?? 1,
        transform,
        cursor: staticMode ? "default" : cursor,
      }}
    >
      <div
        className="size-full"
        data-layer-content
        style={flipTransform ? { transform: flipTransform } : undefined}
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
    </div>
  );
}

function getFlipTransform(data: unknown): string | undefined {
  if (typeof data !== "object" || data === null) return undefined;
  const { _flipX, _flipY } = data as { _flipX?: unknown; _flipY?: unknown };
  const sx = _flipX === -1 ? -1 : 1;
  const sy = _flipY === -1 ? -1 : 1;
  return sx === 1 && sy === 1 ? undefined : `scale(${sx}, ${sy})`;
}

function FallbackRenderer({ layer }: { layer: Layer<unknown> }) {
  return (
    <div
      className="size-full flex items-center justify-center bg-white border border-dashed border-ground-300 caption text-ground-400"
      title={`No renderer registered for type "${layer.type}"`}
    >
      {layer.type}
    </div>
  );
}

export { LayerView };
export type { LayerViewProps };
