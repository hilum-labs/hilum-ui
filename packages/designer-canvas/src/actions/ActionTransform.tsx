import { FlipHorizontal, FlipVertical } from "lucide-react";
import { DesignerToolbarButton, DesignerToolbarGroup, useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";

function ActionTransform() {
  const { dispatch } = useCanvasContext();
  const { selectedIds } = useShellContext();
  const disabled = selectedIds.length === 0;

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton
        label="Flip horizontal"
        icon={FlipHorizontal}
        disabled={disabled}
        onClick={() =>
          dispatch({
            type: "TRANSFORM_LAYERS",
            payload: { targetLayerIds: selectedIds, mode: "flip-h" },
          })
        }
      />
      <DesignerToolbarButton
        label="Flip vertical"
        icon={FlipVertical}
        disabled={disabled}
        onClick={() =>
          dispatch({
            type: "TRANSFORM_LAYERS",
            payload: { targetLayerIds: selectedIds, mode: "flip-v" },
          })
        }
      />
    </DesignerToolbarGroup>
  );
}

export { ActionTransform };
