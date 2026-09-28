import { useMemo } from "react";
import { useKeybindings, useShellContext, type KeybindingConfig } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import { useCanvasHistory } from "../context/CanvasHistory";
import { useZoom } from "./useZoom";

export interface UseCanvasKeyboardShortcutsOptions {
  /** Turn all shortcuts off. */
  disabled?: boolean;
  /** Arrow-key nudge distance in px. Default 1; Shift multiplies by 10. */
  nudge?: number;
}

/**
 * Standard canvas editor shortcuts. `<Designer>` mounts this unless
 * `keyboardShortcuts={false}`; apps using `<CanvasProvider>` directly can
 * call it themselves.
 *
 * | Shortcut                       | Action                          |
 * | ------------------------------ | ------------------------------- |
 * | Mod+Z                          | Undo                            |
 * | Mod+Shift+Z, Mod+Y             | Redo                            |
 * | Delete / Backspace             | Delete selected layers          |
 * | Mod+A                          | Select all visible layers       |
 * | Arrow keys (Shift = ×10)       | Nudge selected layers           |
 * | Mod+D                          | Duplicate selected layers       |
 * | Mod+G / Mod+Shift+G            | Group / ungroup                 |
 * | Mod+= / Mod+- / Mod+0          | Zoom in / out / reset           |
 * | V / H                          | Select / hand tool              |
 *
 * Mod is Cmd on macOS and Ctrl elsewhere. Shortcuts are ignored while focus
 * is in an input, textarea, select or contentEditable element.
 */
export function useCanvasKeyboardShortcuts({
  disabled = false,
  nudge = 1,
}: UseCanvasKeyboardShortcutsOptions = {}) {
  const { state, dispatch } = useCanvasContext();
  const { selectedIds, setSelectedIds, setActiveTool, readOnly } = useShellContext();
  const { undo, redo } = useCanvasHistory();
  const { zoomIn, zoomOut, resetZoom } = useZoom();
  const locked = readOnly || state.readOnly;

  const bindings = useMemo<KeybindingConfig[]>(() => {
    const move = (dx: number, dy: number) => () => {
      if (selectedIds.length === 0) return;
      dispatch({ type: "NUDGE_LAYERS", payload: { targetLayerIds: selectedIds, dx, dy } });
    };
    const remove = () => {
      if (selectedIds.length === 0) return;
      dispatch({ type: "DELETE_LAYERS", payload: selectedIds });
      setSelectedIds([]);
    };
    const selectAll = () =>
      setSelectedIds(state.layers.filter((l) => l.isVisible !== false).map((l) => l.id));

    const duplicate = () => {
      if (selectedIds.length === 0) return;
      dispatch({ type: "COPY_LAYERS", payload: { targetLayerIds: selectedIds } });
      dispatch({ type: "PASTE_LAYERS" });
    };
    const group = () => {
      if (selectedIds.length < 2) return;
      const groupId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `group-${Date.now()}`;
      dispatch({ type: "GROUP_LAYERS", payload: { targetLayerIds: selectedIds, groupId } });
    };
    const ungroup = () => {
      if (selectedIds.length === 0) return;
      dispatch({ type: "UNGROUP_LAYERS", payload: { targetLayerIds: selectedIds } });
    };

    const view: KeybindingConfig[] = [
      { key: "a", code: "KeyA", mod: "platform", action: selectAll },
      { key: "=", code: "Equal", mod: "platform", action: zoomIn },
      { key: "+", mod: "platform", shift: true, action: zoomIn },
      { key: "-", code: "Minus", mod: "platform", action: zoomOut },
      { key: "0", code: "Digit0", mod: "platform", action: resetZoom },
      { key: "v", code: "KeyV", action: () => setActiveTool("select") },
      { key: "h", code: "KeyH", action: () => setActiveTool("hand") },
    ];
    if (locked) return view;

    const big = nudge * 10;
    return [
      { key: "z", code: "KeyZ", mod: "platform", action: undo },
      { key: "z", code: "KeyZ", mod: "platform", shift: true, action: redo },
      { key: "y", code: "KeyY", mod: "platform", action: redo },
      { key: "delete", action: remove },
      { key: "backspace", action: remove },
      { key: "arrowleft", action: move(-nudge, 0) },
      { key: "arrowright", action: move(nudge, 0) },
      { key: "arrowup", action: move(0, -nudge) },
      { key: "arrowdown", action: move(0, nudge) },
      { key: "arrowleft", shift: true, action: move(-big, 0) },
      { key: "arrowright", shift: true, action: move(big, 0) },
      { key: "arrowup", shift: true, action: move(0, -big) },
      { key: "arrowdown", shift: true, action: move(0, big) },
      { key: "d", code: "KeyD", mod: "platform", action: duplicate },
      { key: "g", code: "KeyG", mod: "platform", action: group },
      { key: "g", code: "KeyG", mod: "platform", shift: true, action: ungroup },
      ...view,
    ];
  }, [
    locked,
    nudge,
    selectedIds,
    state.layers,
    dispatch,
    setSelectedIds,
    setActiveTool,
    undo,
    redo,
    zoomIn,
    zoomOut,
    resetZoom,
  ]);

  useKeybindings(bindings, { disabled });
}
