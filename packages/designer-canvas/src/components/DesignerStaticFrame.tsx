import { cn } from "@hilum/ui";
import { useCanvasContext } from "../context/CanvasContext";
import { LayerView } from "./LayerView";

interface DesignerStaticFrameProps {
  className?: string;
  /** Override frame size — used by thumbnails to render at a custom resolution. */
  width?: number;
  height?: number;
}

/**
 * Read-only render of the canvas — no interactivity, no overlays. Use for
 * dashboard thumbnails or print previews. The same renderers from
 * <RendererProvider> are used; their `ctx.readOnly` will be true.
 */
function DesignerStaticFrame({ className, width, height }: DesignerStaticFrameProps) {
  const { state } = useCanvasContext();
  const w = width ?? state.frameSize.width;
  const h = height ?? state.frameSize.height;

  return (
    <div
      className={cn("relative", className)}
      style={{
        width: w,
        height: h,
        background: state.artboardColor,
        opacity: state.artboardOpacity,
        overflow: state.artboardClipContent ? "hidden" : "visible",
      }}
      data-static-frame
    >
      {state.layers.map((l) => (
        <LayerView key={l.id} layer={l} staticMode />
      ))}
    </div>
  );
}

export { DesignerStaticFrame };
export type { DesignerStaticFrameProps };
