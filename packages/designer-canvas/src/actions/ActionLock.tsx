import { Lock, Unlock, Eye, EyeOff } from "lucide-react";
import { DesignerToolbarButton, DesignerToolbarGroup, useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import { useSelectedLayers } from "../hooks/useLayers";

function ActionLock() {
  const { dispatch } = useCanvasContext();
  const { selectedIds } = useShellContext();
  const selected = useSelectedLayers();
  const disabled = selectedIds.length === 0;

  const allLocked = selected.length > 0 && selected.every((l) => l.isLocked);
  const allHidden = selected.length > 0 && selected.every((l) => l.isVisible === false);

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton
        label={allLocked ? "Unlock" : "Lock"}
        icon={allLocked ? Unlock : Lock}
        disabled={disabled}
        onClick={() =>
          dispatch({
            type: "SET_LAYER_PROPERTY",
            payload: { targetLayerIds: selectedIds, key: "isLocked", value: !allLocked },
          })
        }
      />
      <DesignerToolbarButton
        label={allHidden ? "Show" : "Hide"}
        icon={allHidden ? EyeOff : Eye}
        disabled={disabled}
        onClick={() =>
          dispatch({
            type: "SET_LAYER_PROPERTY",
            payload: { targetLayerIds: selectedIds, key: "isVisible", value: allHidden },
          })
        }
      />
    </DesignerToolbarGroup>
  );
}

export { ActionLock };
