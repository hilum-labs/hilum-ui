import { useRef, type ReactNode } from "react";
import { cn } from "@hilum/ui";
import { useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import { LayerView } from "./LayerView";
import { LayerSelectionOverlay } from "../overlays/LayerSelectionOverlay";
import { MarqueeOverlay } from "../overlays/MarqueeOverlay";
import { GridOverlay } from "../overlays/GridOverlay";

interface DesignerFrameProps {
  className?: string;
  /** Hide the selection overlay (e.g. for a custom one). */
  hideSelectionOverlay?: boolean;
  /** Hide the marquee selection box. */
  hideMarquee?: boolean;
  /** Show the grid overlay. */
  showGrid?: boolean;
  children?: ReactNode;
}

/**
 * Interactive layer container. Renders the artboard, all layers via the
 * RendererProvider, the marquee selection box, the selection handles, and
 * an optional grid.
 */
function DesignerFrame({
  className,
  hideSelectionOverlay = false,
  hideMarquee = false,
  showGrid = false,
  children,
}: DesignerFrameProps) {
  const { state } = useCanvasContext();
  const { setSelectedIds } = useShellContext();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerDown={(e) => {
        // Click on the frame background = clear selection.
        if (e.target === ref.current) setSelectedIds([]);
      }}
      className={cn("relative shadow-elevated", className)}
      style={{
        width: state.frameSize.width,
        height: state.frameSize.height,
        background: state.artboardColor,
        opacity: state.artboardOpacity,
        overflow: state.artboardClipContent ? "hidden" : "visible",
      }}
      data-frame
    >
      {showGrid && <GridOverlay />}
      {state.layers.map((l) => (
        <LayerView key={l.id} layer={l} />
      ))}
      {!hideSelectionOverlay && <LayerSelectionOverlay />}
      {!hideMarquee && <MarqueeOverlay containerRef={ref} />}
      {children}
    </div>
  );
}

export { DesignerFrame };
export type { DesignerFrameProps };
