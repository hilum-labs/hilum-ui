// Generic CanvasState reducer.
//
// Per PHASE_0_AUDIT.md §P0.4, layer-mutating actions that depend on
// selection accept an explicit `targetLayerIds: string[]` payload. This
// decouples the reducer from ShellContext's selection store.

import type { GridContainer, GridItem, Layer } from "../types";
import type { CanvasState } from "./state";

/* ============================================================== *
 *  Action types                                                    *
 * ============================================================== */

export type CanvasAction<TData = Record<string, unknown>> =
  // Layer CRUD
  | { type: "SET_LAYERS"; payload: Layer<TData>[] }
  | { type: "ADD_LAYER"; payload: Layer<TData> }
  | { type: "UPDATE_LAYER"; payload: { id: string; updates: Partial<Layer<TData>> } }
  | { type: "UPDATE_LAYERS"; payload: Array<{ id: string; updates: Partial<Layer<TData>> }> }
  | { type: "DELETE_LAYER"; payload: string }
  | { type: "DELETE_LAYERS"; payload: string[] }
  | { type: "REORDER_LAYERS"; payload: { fromIndex: number; toIndex: number } }
  // Selection-driven (caller passes targetLayerIds — see P0.4)
  | { type: "NUDGE_LAYERS"; payload: { targetLayerIds: string[]; dx: number; dy: number } }
  | {
      type: "ALIGN_LAYERS";
      payload: {
        targetLayerIds: string[];
        align: "left" | "center" | "right" | "top" | "middle" | "bottom";
      };
    }
  | {
      type: "DISTRIBUTE_LAYERS";
      payload: { targetLayerIds: string[]; axis: "horizontal" | "vertical" };
    }
  | { type: "GROUP_LAYERS"; payload: { targetLayerIds: string[]; groupId: string } }
  | { type: "UNGROUP_LAYERS"; payload: { targetLayerIds: string[] } }
  | {
      type: "ARRANGE_LAYERS";
      payload: { targetLayerIds: string[]; mode: "front" | "back" | "forward" | "backward" };
    }
  | { type: "TRANSFORM_LAYERS"; payload: { targetLayerIds: string[]; mode: "flip-h" | "flip-v" } }
  | {
      type: "SET_LAYER_PROPERTY";
      payload: { targetLayerIds: string[]; key: keyof Layer<TData>; value: unknown };
    }
  // Viewport
  | { type: "SET_ZOOM"; payload: number }
  | { type: "SET_PAN"; payload: { x: number; y: number } }
  | { type: "SET_FRAME_SIZE"; payload: { width: number; height: number } }
  // Artboard chrome
  | { type: "SET_ARTBOARD_NAME"; payload: string }
  | { type: "SET_ARTBOARD_COLOR"; payload: string }
  | { type: "SET_ARTBOARD_OPACITY"; payload: number }
  | { type: "SET_ARTBOARD_CLIP_CONTENT"; payload: boolean }
  // Grid
  | { type: "SET_GRID_CONTAINER"; payload: GridContainer }
  | { type: "CLEAR_GRID_CONTAINER" }
  | { type: "UPDATE_GRID_CONTAINER"; payload: Partial<GridContainer> }
  // Theme
  | { type: "SET_UI_COLOR"; payload: "light" | "mid" | "dark" }
  | { type: "SET_CANVAS_COLOR"; payload: "light" | "mid" | "dark" }
  | { type: "SET_ACCENT_COLOR"; payload: string }
  // Clipboard
  | { type: "COPY_LAYERS"; payload: { targetLayerIds: string[] } }
  | { type: "PASTE_LAYERS"; payload?: { offset?: { dx: number; dy: number } } }
  | { type: "CLEAR_CLIPBOARD" }
  // Read-only
  | { type: "SET_READ_ONLY"; payload: boolean };

/* ============================================================== *
 *  Reducer                                                         *
 * ============================================================== */

export function canvasReducer<TData>(
  state: CanvasState<TData>,
  action: CanvasAction<TData>,
): CanvasState<TData> {
  if (state.readOnly && action.type !== "SET_READ_ONLY" && !isReadActionAllowed(action.type)) {
    return state;
  }

  switch (action.type) {
    /* ---------------- Layer CRUD ---------------- */

    case "SET_LAYERS":
      return { ...state, layers: action.payload };

    case "ADD_LAYER":
      return { ...state, layers: [...state.layers, action.payload] };

    case "UPDATE_LAYER": {
      const { id, updates } = action.payload;
      return {
        ...state,
        layers: state.layers.map((l) => (l.id === id ? { ...l, ...updates } : l)),
      };
    }

    case "UPDATE_LAYERS": {
      const map = new Map(action.payload.map((u) => [u.id, u.updates]));
      return {
        ...state,
        layers: state.layers.map((l) => (map.has(l.id) ? { ...l, ...map.get(l.id)! } : l)),
      };
    }

    case "DELETE_LAYER":
      return { ...state, layers: state.layers.filter((l) => l.id !== action.payload) };

    case "DELETE_LAYERS": {
      const ids = new Set(action.payload);
      return { ...state, layers: state.layers.filter((l) => !ids.has(l.id)) };
    }

    case "REORDER_LAYERS": {
      const { fromIndex, toIndex } = action.payload;
      const next = [...state.layers];
      const [moved] = next.splice(fromIndex, 1);
      if (moved) next.splice(toIndex, 0, moved);
      return { ...state, layers: next };
    }

    /* ---------------- Selection-driven mutations ---------------- */

    case "NUDGE_LAYERS": {
      const { targetLayerIds, dx, dy } = action.payload;
      const ids = new Set(targetLayerIds);
      return {
        ...state,
        layers: state.layers.map((l) =>
          ids.has(l.id) && !l.isLocked ? { ...l, x: l.x + dx, y: l.y + dy } : l,
        ),
      };
    }

    case "ALIGN_LAYERS":
      return {
        ...state,
        layers: alignLayers(state.layers, action.payload.targetLayerIds, action.payload.align),
      };

    case "DISTRIBUTE_LAYERS":
      return {
        ...state,
        layers: distributeLayers(state.layers, action.payload.targetLayerIds, action.payload.axis),
      };

    case "GROUP_LAYERS": {
      const { targetLayerIds, groupId } = action.payload;
      const ids = new Set(targetLayerIds);
      return {
        ...state,
        layers: state.layers.map((l) => (ids.has(l.id) ? { ...l, groupId } : l)),
      };
    }

    case "UNGROUP_LAYERS": {
      const ids = new Set(action.payload.targetLayerIds);
      return {
        ...state,
        layers: state.layers.map((l) => {
          if (!ids.has(l.id)) return l;
          const { groupId: _gid, ...rest } = l;
          return rest as Layer<TData>;
        }),
      };
    }

    case "ARRANGE_LAYERS":
      return {
        ...state,
        layers: arrangeLayers(state.layers, action.payload.targetLayerIds, action.payload.mode),
      };

    case "TRANSFORM_LAYERS": {
      const { targetLayerIds, mode } = action.payload;
      const ids = new Set(targetLayerIds);
      return {
        ...state,
        layers: state.layers.map((l) => {
          if (!ids.has(l.id) || l.isLocked) return l;
          const data = l.data as Record<string, unknown>;
          const flipKey = mode === "flip-h" ? "_flipX" : "_flipY";
          const current = (data[flipKey] as number) ?? 1;
          return { ...l, data: { ...data, [flipKey]: -current } as TData };
        }),
      };
    }

    case "SET_LAYER_PROPERTY": {
      const { targetLayerIds, key, value } = action.payload;
      const ids = new Set(targetLayerIds);
      return {
        ...state,
        layers: state.layers.map((l) =>
          ids.has(l.id) ? ({ ...l, [key]: value } as Layer<TData>) : l,
        ),
      };
    }

    /* ---------------- Viewport ---------------- */

    case "SET_ZOOM":
      return { ...state, zoom: clamp(action.payload, 0.05, 32) };

    case "SET_PAN":
      return { ...state, pan: action.payload };

    case "SET_FRAME_SIZE":
      return { ...state, frameSize: action.payload };

    /* ---------------- Artboard ---------------- */

    case "SET_ARTBOARD_NAME":
      return { ...state, artboardName: action.payload };
    case "SET_ARTBOARD_COLOR":
      return { ...state, artboardColor: action.payload };
    case "SET_ARTBOARD_OPACITY":
      return { ...state, artboardOpacity: clamp(action.payload, 0, 1) };
    case "SET_ARTBOARD_CLIP_CONTENT":
      return { ...state, artboardClipContent: action.payload };

    /* ---------------- Grid ---------------- */

    case "SET_GRID_CONTAINER":
      return { ...state, gridContainer: action.payload };
    case "CLEAR_GRID_CONTAINER":
      return { ...state, gridContainer: undefined };
    case "UPDATE_GRID_CONTAINER":
      return state.gridContainer
        ? { ...state, gridContainer: { ...state.gridContainer, ...action.payload } }
        : state;

    /* ---------------- Theme ---------------- */

    case "SET_UI_COLOR":
      return { ...state, uiColor: action.payload };
    case "SET_CANVAS_COLOR":
      return { ...state, canvasColor: action.payload };
    case "SET_ACCENT_COLOR":
      return { ...state, accentColor: action.payload };

    /* ---------------- Clipboard ---------------- */

    case "COPY_LAYERS": {
      const ids = new Set(action.payload.targetLayerIds);
      const copied = state.layers.filter((l) => ids.has(l.id)).map(deepClone);
      return { ...state, copiedLayers: copied };
    }

    case "PASTE_LAYERS": {
      if (!state.copiedLayers || state.copiedLayers.length === 0) return state;
      const offset = action.payload?.offset ?? { dx: 16, dy: 16 };
      const fresh = state.copiedLayers.map((l) => ({
        ...deepClone(l),
        id: generateId(),
        x: l.x + offset.dx,
        y: l.y + offset.dy,
      }));
      return { ...state, layers: [...state.layers, ...fresh] };
    }

    case "CLEAR_CLIPBOARD":
      return { ...state, copiedLayers: null };

    /* ---------------- Read-only ---------------- */

    case "SET_READ_ONLY":
      return { ...state, readOnly: action.payload };

    default:
      return state;
  }
}

/* ============================================================== *
 *  Helpers                                                         *
 * ============================================================== */

function isReadActionAllowed(type: string): boolean {
  return (
    type === "SET_ZOOM" ||
    type === "SET_PAN" ||
    type === "SET_UI_COLOR" ||
    type === "SET_CANVAS_COLOR"
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function deepClone<T>(v: T): T {
  if (typeof structuredClone === "function") return structuredClone(v);
  return JSON.parse(JSON.stringify(v));
}

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto)
    return (crypto as Crypto).randomUUID();
  return `layer-${Math.random().toString(36).slice(2, 11)}`;
}

function alignLayers<TData>(
  layers: Layer<TData>[],
  ids: string[],
  align: "left" | "center" | "right" | "top" | "middle" | "bottom",
): Layer<TData>[] {
  const idSet = new Set(ids);
  const targets = layers.filter((l) => idSet.has(l.id));
  if (targets.length < 2) return layers;

  let value = 0;
  switch (align) {
    case "left":
      value = Math.min(...targets.map((l) => l.x));
      break;
    case "right": {
      const maxRight = Math.max(...targets.map((l) => l.x + l.width));
      return layers.map((l) => (idSet.has(l.id) ? { ...l, x: maxRight - l.width } : l));
    }
    case "center": {
      const minX = Math.min(...targets.map((l) => l.x));
      const maxX = Math.max(...targets.map((l) => l.x + l.width));
      const center = (minX + maxX) / 2;
      return layers.map((l) => (idSet.has(l.id) ? { ...l, x: center - l.width / 2 } : l));
    }
    case "top":
      value = Math.min(...targets.map((l) => l.y));
      return layers.map((l) => (idSet.has(l.id) ? { ...l, y: value } : l));
    case "bottom": {
      const maxBottom = Math.max(...targets.map((l) => l.y + l.height));
      return layers.map((l) => (idSet.has(l.id) ? { ...l, y: maxBottom - l.height } : l));
    }
    case "middle": {
      const minY = Math.min(...targets.map((l) => l.y));
      const maxY = Math.max(...targets.map((l) => l.y + l.height));
      const middle = (minY + maxY) / 2;
      return layers.map((l) => (idSet.has(l.id) ? { ...l, y: middle - l.height / 2 } : l));
    }
  }

  return layers.map((l) => (idSet.has(l.id) ? { ...l, x: value } : l));
}

function distributeLayers<TData>(
  layers: Layer<TData>[],
  ids: string[],
  axis: "horizontal" | "vertical",
): Layer<TData>[] {
  const idSet = new Set(ids);
  const targets = layers.filter((l) => idSet.has(l.id));
  if (targets.length < 3) return layers;

  if (axis === "horizontal") {
    const sorted = [...targets].sort((a, b) => a.x - b.x);
    const first = sorted[0]!;
    const last = sorted[sorted.length - 1]!;
    const totalSpan = last.x + last.width - first.x;
    const totalWidth = sorted.reduce((s, l) => s + l.width, 0);
    const gap = (totalSpan - totalWidth) / (sorted.length - 1);
    let cursor = first.x;
    const updates = new Map<string, number>();
    for (const l of sorted) {
      updates.set(l.id, cursor);
      cursor += l.width + gap;
    }
    return layers.map((l) => (updates.has(l.id) ? { ...l, x: updates.get(l.id)! } : l));
  } else {
    const sorted = [...targets].sort((a, b) => a.y - b.y);
    const first = sorted[0]!;
    const last = sorted[sorted.length - 1]!;
    const totalSpan = last.y + last.height - first.y;
    const totalHeight = sorted.reduce((s, l) => s + l.height, 0);
    const gap = (totalSpan - totalHeight) / (sorted.length - 1);
    let cursor = first.y;
    const updates = new Map<string, number>();
    for (const l of sorted) {
      updates.set(l.id, cursor);
      cursor += l.height + gap;
    }
    return layers.map((l) => (updates.has(l.id) ? { ...l, y: updates.get(l.id)! } : l));
  }
}

function arrangeLayers<TData>(
  layers: Layer<TData>[],
  ids: string[],
  mode: "front" | "back" | "forward" | "backward",
): Layer<TData>[] {
  const idSet = new Set(ids);
  const indices = layers.map((l, i) => (idSet.has(l.id) ? i : -1)).filter((i) => i >= 0);
  if (indices.length === 0) return layers;

  switch (mode) {
    case "front": {
      const targets = indices.map((i) => layers[i]!);
      const others = layers.filter((l) => !idSet.has(l.id));
      return [...others, ...targets];
    }
    case "back": {
      const targets = indices.map((i) => layers[i]!);
      const others = layers.filter((l) => !idSet.has(l.id));
      return [...targets, ...others];
    }
    case "forward": {
      const next = [...layers];
      // Move each selected layer forward by 1, last selected first to avoid collisions.
      for (let i = indices.length - 1; i >= 0; i--) {
        const idx = indices[i]!;
        if (idx < next.length - 1) {
          [next[idx], next[idx + 1]] = [next[idx + 1]!, next[idx]!];
        }
      }
      return next;
    }
    case "backward": {
      const next = [...layers];
      for (let i = 0; i < indices.length; i++) {
        const idx = indices[i]!;
        if (idx > 0) {
          [next[idx], next[idx - 1]] = [next[idx - 1]!, next[idx]!];
        }
      }
      return next;
    }
  }
}

export const __test = { alignLayers, distributeLayers, arrangeLayers };
