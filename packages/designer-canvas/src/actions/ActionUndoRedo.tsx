import { Undo2, Redo2 } from "lucide-react";
import { DesignerToolbarButton, DesignerToolbarGroup } from "@hilum/designer";
import { useHistoryActions } from "../hooks/useHistoryActions";

function ActionUndoRedo() {
  const { undo, redo, canUndo, canRedo } = useHistoryActions();

  return (
    <DesignerToolbarGroup>
      <DesignerToolbarButton
        label="Undo"
        icon={Undo2}
        shortcut="⌘Z"
        onClick={undo}
        disabled={!canUndo}
      />
      <DesignerToolbarButton
        label="Redo"
        icon={Redo2}
        shortcut="⇧⌘Z"
        onClick={redo}
        disabled={!canRedo}
      />
    </DesignerToolbarGroup>
  );
}

export { ActionUndoRedo };
