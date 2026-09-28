import { describe, it, expect, vi, afterEach } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useShellContext, type ShellContextValue } from "@hilum/designer";
import { Designer, type DesignerProps } from "../components/Designer";
import { DesignerCanvas } from "../components/DesignerCanvas";
import { DesignerFrame } from "../components/DesignerFrame";
import { ActionUndoRedo } from "../actions/ActionUndoRedo";
import { useCanvasContext, type CanvasContextValue } from "../context/CanvasContext";
import { useHistoryActions } from "../hooks/useHistoryActions";
import type { CanvasHistoryValue } from "../context/CanvasHistory";
import type { Layer } from "../types";

function makeLayer(id: string, x: number, y: number, w = 100, h = 100): Layer {
  return { id, type: "rect", x, y, width: w, height: h, rotation: 0, opacity: 1, data: {} };
}

interface Handles {
  canvas: CanvasContextValue;
  shell: ShellContextValue;
  history: CanvasHistoryValue;
}

function Probe({ onValue }: { onValue: (h: Handles) => void }) {
  onValue({ canvas: useCanvasContext(), shell: useShellContext(), history: useHistoryActions() });
  return null;
}

function setup(
  props: Partial<DesignerProps> = {},
  layers = [makeLayer("a", 0, 0), makeLayer("b", 200, 0)],
) {
  const handles: Partial<Handles> = {};
  const utils = render(
    <Designer initial={{ layers }} {...props}>
      <ActionUndoRedo />
      <ActionUndoRedo />
      <DesignerCanvas>
        <DesignerFrame />
      </DesignerCanvas>
      <Probe onValue={(v) => Object.assign(handles, v)} />
    </Designer>,
  );
  const h = handles as Handles;
  const layer = (id: string) => h.canvas.state.layers.find((l) => l.id === id)!;
  const el = (id: string) =>
    utils.container.querySelector(`[data-layer-id="${id}"]`) as HTMLElement;
  return { ...utils, h, layer, el };
}

function pointer(type: string, init: PointerEventInit, target: EventTarget = window) {
  act(() => {
    target.dispatchEvent(
      new PointerEvent(type, { bubbles: true, cancelable: true, button: 0, ...init }),
    );
  });
}

function drag(
  target: HTMLElement,
  from: [number, number],
  moves: [number, number][],
  init: PointerEventInit = {},
) {
  pointer("pointerdown", { clientX: from[0], clientY: from[1], ...init }, target);
  for (const [x, y] of moves) pointer("pointermove", { clientX: x, clientY: y });
  pointer("pointerup", { clientX: moves.at(-1)![0], clientY: moves.at(-1)![1] });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("history", () => {
  it("undo applies the post-undo layers (not the stale pre-undo state)", () => {
    const { h, layer } = setup();
    act(() =>
      h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x: 10 } } }),
    );
    act(() =>
      h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x: 20 } } }),
    );
    act(() => h.history.undo());
    expect(layer("a").x).toBe(10);
    act(() => h.history.undo());
    expect(layer("a").x).toBe(0);
    expect(h.history.canUndo).toBe(false);
    act(() => h.history.redo());
    expect(layer("a").x).toBe(10);
    act(() => h.history.redo());
    expect(layer("a").x).toBe(20);
    expect(h.history.canRedo).toBe(false);
  });

  it("is shared by every <ActionUndoRedo>", () => {
    const { h, layer } = setup();
    const [undo1, undo2] = screen.getAllByRole("button", { name: "Undo" });
    expect(undo1).toBeDisabled();
    expect(undo2).toBeDisabled();
    act(() =>
      h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x: 10 } } }),
    );
    expect(undo1).toBeEnabled();
    expect(undo2).toBeEnabled();
    fireEvent.click(undo2!);
    expect(layer("a").x).toBe(0);
    expect(undo1).toBeDisabled();
    expect(screen.getAllByRole("button", { name: "Redo" })[0]).toBeEnabled();
  });

  it("undo is disabled while read-only", () => {
    const { h, layer } = setup();
    act(() =>
      h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x: 10 } } }),
    );
    act(() => h.canvas.dispatch({ type: "SET_READ_ONLY", payload: true }));
    expect(h.history.canUndo).toBe(false);
    act(() => h.history.undo());
    expect(layer("a").x).toBe(10);
    act(() => h.canvas.dispatch({ type: "SET_READ_ONLY", payload: false }));
    act(() => h.history.undo());
    expect(layer("a").x).toBe(0);
  });

  it("respects historyLimit", () => {
    const { h, layer } = setup({ historyLimit: 2 });
    for (const x of [1, 2, 3, 4]) {
      act(() => h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x } } }));
    }
    act(() => {
      h.history.undo();
      h.history.undo();
      h.history.undo();
    });
    expect(layer("a").x).toBe(2);
  });
});

describe("drag", () => {
  it("one gesture is one undo step", () => {
    const { h, layer, el } = setup();
    drag(
      el("a"),
      [0, 0],
      [
        [5, 0],
        [10, 0],
        [30, 5],
      ],
    );
    expect(layer("a")).toMatchObject({ x: 30, y: 5 });
    act(() => h.history.undo());
    expect(layer("a")).toMatchObject({ x: 0, y: 0 });
    expect(h.history.canUndo).toBe(false);
  });

  it("groups moves even when pointerup lands in the same batch", () => {
    const { h, layer, el } = setup();
    act(() => {
      el("a").dispatchEvent(
        new PointerEvent("pointerdown", { bubbles: true, button: 0, clientX: 0, clientY: 0 }),
      );
    });
    act(() => {
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 10, clientY: 0 }));
      window.dispatchEvent(new PointerEvent("pointermove", { clientX: 40, clientY: 0 }));
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: 40, clientY: 0 }));
    });
    expect(layer("a").x).toBe(40);
    act(() => h.history.undo());
    expect(layer("a").x).toBe(0);
  });

  it("scales pointer deltas by zoom", () => {
    const { h, layer, el } = setup();
    act(() => h.canvas.dispatch({ type: "SET_ZOOM", payload: 2 }));
    drag(el("a"), [0, 0], [[40, 20]]);
    expect(layer("a")).toMatchObject({ x: 20, y: 10 });
  });

  it("shift-click then drag moves the whole selection", () => {
    const { h, layer, el } = setup();
    pointer("pointerdown", { clientX: 0, clientY: 0 }, el("a"));
    pointer("pointerup", { clientX: 0, clientY: 0 });
    expect(h.shell.selectedIds).toEqual(["a"]);

    drag(el("b"), [0, 0], [[15, 25]], { shiftKey: true });
    expect(h.shell.selectedIds).toEqual(["a", "b"]);
    expect(layer("a")).toMatchObject({ x: 15, y: 25 });
    expect(layer("b")).toMatchObject({ x: 215, y: 25 });
  });

  it("does not move locked layers in a multi-selection", () => {
    const { h, layer, el } = setup({}, [
      makeLayer("a", 0, 0),
      { ...makeLayer("b", 200, 0), isLocked: true },
    ]);
    act(() => h.shell.setSelectedIds(["a", "b"]));
    drag(el("a"), [0, 0], [[10, 0]]);
    expect(layer("a").x).toBe(10);
    expect(layer("b").x).toBe(200);
  });
});

describe("marquee", () => {
  function frameOf(container: HTMLElement) {
    const frame = container.querySelector("[data-frame]") as HTMLElement;
    // happy-dom has no layout; the frame is 800×600 at zoom 1.
    vi.spyOn(frame, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 800,
      height: 600,
      right: 800,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    return frame;
  }

  it("selects intersecting layers on pointerup", () => {
    const { h, container } = setup({}, [
      makeLayer("a", 0, 0),
      makeLayer("b", 200, 0),
      makeLayer("c", 500, 400),
    ]);
    const frame = frameOf(container);
    pointer("pointerdown", { clientX: 50, clientY: 50 }, frame);
    pointer("pointermove", { clientX: 120, clientY: 80 });
    expect(container.querySelector("[data-marquee]")).not.toBeNull();
    pointer("pointermove", { clientX: 250, clientY: 150 });
    pointer("pointerup", { clientX: 250, clientY: 150 });
    expect(h.shell.selectedIds).toEqual(["a", "b"]);
    expect(container.querySelector("[data-marquee]")).toBeNull();
  });

  it("shift-marquee adds to the selection", () => {
    const { h, container } = setup({}, [
      makeLayer("a", 0, 0),
      makeLayer("b", 200, 0),
      makeLayer("c", 500, 400),
    ]);
    act(() => h.shell.setSelectedIds(["c"]));
    const frame = frameOf(container);
    pointer("pointerdown", { clientX: 250, clientY: 50, shiftKey: true }, frame);
    pointer("pointermove", { clientX: 260, clientY: 60, shiftKey: true });
    pointer("pointerup", { clientX: 260, clientY: 60, shiftKey: true });
    expect(h.shell.selectedIds).toEqual(["c", "b"]);
  });

  it("maps coordinates through the zoomed frame rect", () => {
    const { h, container } = setup({}, [makeLayer("a", 0, 0), makeLayer("b", 600, 400)]);
    const frame = container.querySelector("[data-frame]") as HTMLElement;
    // Zoom 0.5: the 800×600 frame occupies 400×300 screen px.
    vi.spyOn(frame, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      right: 400,
      bottom: 300,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });
    pointer("pointerdown", { clientX: 290, clientY: 190 }, frame);
    pointer("pointermove", { clientX: 310, clientY: 210 });
    pointer("pointerup", { clientX: 310, clientY: 210 });
    expect(h.shell.selectedIds).toEqual(["b"]);
  });
});

describe("viewport", () => {
  const root = (c: HTMLElement) => c.querySelector("[data-canvas-root]") as HTMLElement;
  // happy-dom's WheelEvent ignores modifier keys in its init dict.
  const wheel = (init: WheelEventInit & { ctrlKey?: boolean; shiftKey?: boolean }) => {
    const e = new WheelEvent("wheel", { cancelable: true, ...init });
    Object.defineProperty(e, "ctrlKey", { value: init.ctrlKey ?? false });
    Object.defineProperty(e, "shiftKey", { value: init.shiftKey ?? false });
    return e;
  };

  it("subscribes the wheel listener once and accumulates wheel pans", () => {
    const add = vi.spyOn(HTMLElement.prototype, "addEventListener");
    const { h, container } = setup();
    const canvasRoot = root(container);
    const wheelSubs = () =>
      add.mock.calls.filter(([t], i) => t === "wheel" && add.mock.contexts[i] === canvasRoot)
        .length;
    expect(wheelSubs()).toBe(1);

    act(() => {
      root(container).dispatchEvent(wheel({ deltaY: 100 }));
      root(container).dispatchEvent(wheel({ deltaY: 100 }));
    });
    expect(h.canvas.state.pan).toEqual({ x: 0, y: -200 });
    // Line-mode deltas (Firefox mouse wheel) are converted to pixels.
    act(() => {
      root(container).dispatchEvent(wheel({ deltaY: 3, deltaMode: 1 }));
    });
    expect(h.canvas.state.pan).toEqual({ x: 0, y: -248 });
    // Shift+wheel pans horizontally.
    act(() => {
      root(container).dispatchEvent(wheel({ deltaY: 10, shiftKey: true }));
    });
    expect(h.canvas.state.pan).toEqual({ x: -10, y: -248 });
    expect(wheelSubs()).toBe(1);
  });

  it("ctrl+wheel zooms with a bounded step", () => {
    const { h, container } = setup();
    act(() => {
      root(container).dispatchEvent(wheel({ deltaY: -1000, ctrlKey: true }));
    });
    expect(h.canvas.state.zoom).toBeCloseTo(Math.exp(0.5));
  });

  it("hand tool drags pan the canvas instead of moving or selecting layers", () => {
    const { h, layer, el } = setup();
    act(() => h.shell.setActiveTool("hand"));
    drag(el("a"), [0, 0], [[30, 40]]);
    expect(h.canvas.state.pan).toEqual({ x: 30, y: 40 });
    expect(layer("a").x).toBe(0);
    expect(h.shell.selectedIds).toEqual([]);
  });

  it("holding Space pans; releasing it restores normal dragging", () => {
    const { h, layer, el } = setup();
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: " ", code: "Space" }));
    });
    drag(el("a"), [0, 0], [[5, 5]]);
    expect(h.canvas.state.pan).toEqual({ x: 5, y: 5 });
    expect(layer("a").x).toBe(0);
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: " ", code: "Space" }));
    });
    drag(el("a"), [0, 0], [[5, 0]]);
    expect(layer("a").x).toBe(5);
  });
});

describe("rendering", () => {
  it("renders flips from data._flipX / _flipY", () => {
    const { h, el } = setup();
    const content = () => el("a").querySelector("[data-layer-content]") as HTMLElement;
    expect(content().style.transform).toBe("");
    act(() =>
      h.canvas.dispatch({
        type: "TRANSFORM_LAYERS",
        payload: { targetLayerIds: ["a"], mode: "flip-h" },
      }),
    );
    expect(content().style.transform).toBe("scale(-1, 1)");
    act(() =>
      h.canvas.dispatch({
        type: "TRANSFORM_LAYERS",
        payload: { targetLayerIds: ["a"], mode: "flip-v" },
      }),
    );
    expect(content().style.transform).toBe("scale(-1, -1)");
    act(() =>
      h.canvas.dispatch({
        type: "TRANSFORM_LAYERS",
        payload: { targetLayerIds: ["a"], mode: "flip-h" },
      }),
    );
    expect(content().style.transform).toBe("scale(1, -1)");
  });
});

describe("keyboard shortcuts", () => {
  const key = (init: KeyboardEventInit) =>
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init }),
      );
    });

  it("undo / redo with Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y", () => {
    const { h, layer } = setup();
    act(() =>
      h.canvas.dispatch({ type: "UPDATE_LAYER", payload: { id: "a", updates: { x: 10 } } }),
    );
    key({ key: "z", code: "KeyZ", ctrlKey: true });
    expect(layer("a").x).toBe(0);
    key({ key: "Z", code: "KeyZ", ctrlKey: true, shiftKey: true });
    expect(layer("a").x).toBe(10);
    key({ key: "z", code: "KeyZ", ctrlKey: true });
    key({ key: "y", code: "KeyY", ctrlKey: true });
    expect(layer("a").x).toBe(10);
  });

  it("Delete / Backspace remove the selection", () => {
    const { h } = setup({}, [makeLayer("a", 0, 0), makeLayer("b", 0, 0), makeLayer("c", 0, 0)]);
    act(() => h.shell.setSelectedIds(["a"]));
    key({ key: "Delete" });
    act(() => h.shell.setSelectedIds(["b"]));
    key({ key: "Backspace" });
    expect(h.canvas.state.layers.map((l) => l.id)).toEqual(["c"]);
    expect(h.shell.selectedIds).toEqual([]);
  });

  it("Ctrl+A selects all visible layers", () => {
    const { h } = setup({}, [makeLayer("a", 0, 0), { ...makeLayer("b", 0, 0), isVisible: false }]);
    key({ key: "a", code: "KeyA", ctrlKey: true });
    expect(h.shell.selectedIds).toEqual(["a"]);
  });

  it("arrows nudge by 1, Shift+arrows by 10", () => {
    const { h, layer } = setup();
    act(() => h.shell.setSelectedIds(["a"]));
    key({ key: "ArrowRight" });
    key({ key: "ArrowDown", shiftKey: true });
    key({ key: "ArrowLeft", shiftKey: true });
    key({ key: "ArrowUp" });
    expect(layer("a")).toMatchObject({ x: -9, y: 9 });
  });

  it("Ctrl+D duplicates, Ctrl+G / Ctrl+Shift+G group and ungroup", () => {
    const { h } = setup();
    act(() => h.shell.setSelectedIds(["a", "b"]));
    key({ key: "g", code: "KeyG", ctrlKey: true });
    const groupId = h.canvas.state.layers[0]!.groupId;
    expect(groupId).toBeTruthy();
    expect(h.canvas.state.layers[1]!.groupId).toBe(groupId);
    key({ key: "G", code: "KeyG", ctrlKey: true, shiftKey: true });
    expect(h.canvas.state.layers.every((l) => l.groupId === undefined)).toBe(true);
    key({ key: "d", code: "KeyD", ctrlKey: true });
    expect(h.canvas.state.layers).toHaveLength(4);
  });

  it("Ctrl+= / Ctrl+- / Ctrl+0 zoom", () => {
    const { h } = setup();
    key({ key: "=", code: "Equal", ctrlKey: true });
    expect(h.canvas.state.zoom).toBe(1.5);
    key({ key: "-", code: "Minus", ctrlKey: true });
    key({ key: "-", code: "Minus", ctrlKey: true });
    expect(h.canvas.state.zoom).toBe(0.75);
    key({ key: "0", code: "Digit0", ctrlKey: true });
    expect(h.canvas.state.zoom).toBe(1);
  });

  it("V / H switch tools", () => {
    const { h } = setup();
    key({ key: "h", code: "KeyH" });
    expect(h.shell.activeTool).toBe("hand");
    key({ key: "v", code: "KeyV" });
    expect(h.shell.activeTool).toBe("select");
  });

  it("are ignored while typing in an input", () => {
    const { h } = setup();
    act(() => h.shell.setSelectedIds(["a"]));
    const input = document.createElement("input");
    document.body.appendChild(input);
    act(() => {
      input.dispatchEvent(new KeyboardEvent("keydown", { key: "Backspace", bubbles: true }));
    });
    expect(h.canvas.state.layers).toHaveLength(2);
    input.remove();
  });

  it("keyboardShortcuts={false} disables them", () => {
    const { h } = setup({ keyboardShortcuts: false });
    act(() => h.shell.setSelectedIds(["a"]));
    key({ key: "Delete" });
    expect(h.canvas.state.layers).toHaveLength(2);
  });

  it("read-only canvases keep only non-mutating shortcuts", () => {
    const { h } = setup({ readOnly: true });
    key({ key: "a", code: "KeyA", ctrlKey: true });
    expect(h.shell.selectedIds).toEqual(["a", "b"]);
    key({ key: "Delete" });
    expect(h.canvas.state.layers).toHaveLength(2);
  });
});
