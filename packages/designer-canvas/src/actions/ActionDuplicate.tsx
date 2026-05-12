import { Copy } from "lucide-react";
import { DesignerToolbarButton, useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";

function ActionDuplicate() {
  const { dispatch } = useCanvasContext();
  const { selectedIds } = useShellContext();

  return (
    <DesignerToolbarButton
      label="Duplicate"
      icon={Copy}
      shortcut="⌘D"
      disabled={selectedIds.length === 0}
      onClick={() => {
        dispatch({ type: "COPY_LAYERS", payload: { targetLayerIds: selectedIds } });
        dispatch({ type: "PASTE_LAYERS" });
      }}
    />
  );
}

export { ActionDuplicate };
