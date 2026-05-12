import { Plus, Minus, Maximize2 } from "lucide-react";
import { DesignerToolbarButton, DesignerToolbarGroup } from "@hilum/designer";
import { useZoom } from "../hooks/useZoom";

function ActionZoom() {
  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton label="Zoom out" icon={Minus} shortcut="⌘-" onClick={zoomOut} />
      <DesignerToolbarButton label="Reset zoom" icon={Maximize2} shortcut="⌘0" onClick={resetZoom}>
        <span className="caption-xs ml-1 tabular-nums">{Math.round(zoom * 100)}%</span>
      </DesignerToolbarButton>
      <DesignerToolbarButton label="Zoom in" icon={Plus} shortcut="⌘=" onClick={zoomIn} />
    </DesignerToolbarGroup>
  );
}

export { ActionZoom };
