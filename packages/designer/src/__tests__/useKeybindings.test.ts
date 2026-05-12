import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeybindings } from "../hooks/useKeybindings";

function fireKeydown(
  key: string,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean; shiftKey?: boolean; altKey?: boolean } = {},
  target: EventTarget = window,
) {
  const event = new KeyboardEvent("keydown", {
    key,
    bubbles: true,
    cancelable: true,
    ctrlKey: modifiers.ctrlKey ?? false,
    metaKey: modifiers.metaKey ?? false,
    shiftKey: modifiers.shiftKey ?? false,
    altKey: modifiers.altKey ?? false,
  });
  target.dispatchEvent(event);
  return event;
}

describe("useKeybindings", () => {
  it("calls action when matching key is pressed", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "v", action }]));
    fireKeydown("v");
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("does not call action for non-matching key", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "v", action }]));
    fireKeydown("b");
    expect(action).not.toHaveBeenCalled();
  });

  it("matches ctrl modifier", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", ctrl: true, action }]));
    fireKeydown("z", { ctrlKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("does not fire ctrl binding without ctrl held", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", ctrl: true, action }]));
    fireKeydown("z");
    expect(action).not.toHaveBeenCalled();
  });

  it("matches meta modifier", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", meta: true, action }]));
    fireKeydown("z", { metaKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("matches shift modifier", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", shift: true, action }]));
    fireKeydown("z", { shiftKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("does not fire when shift is held but not required", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "v", action }]));
    fireKeydown("v", { shiftKey: true });
    expect(action).not.toHaveBeenCalled();
  });

  it("mod:true matches ctrl OR meta", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", mod: true, action }]));
    fireKeydown("z", { ctrlKey: true });
    fireKeydown("z", { metaKey: true });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("disabled option suppresses all bindings", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "v", action }], { disabled: true }));
    fireKeydown("v");
    expect(action).not.toHaveBeenCalled();
  });

  it("skipInputs=false fires even when target is an input", () => {
    const action = vi.fn();
    const { unmount } = renderHook(() => useKeybindings([{ key: "s", skipInputs: false, action }]));
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();
    const event = new KeyboardEvent("keydown", { key: "s", bubbles: true, cancelable: true });
    Object.defineProperty(event, "target", { value: input });
    window.dispatchEvent(event);
    expect(action).toHaveBeenCalledTimes(1);
    document.body.removeChild(input);
    unmount();
  });

  it("removes listener on unmount", () => {
    const action = vi.fn();
    const { unmount } = renderHook(() => useKeybindings([{ key: "x", action }]));
    unmount();
    fireKeydown("x");
    expect(action).not.toHaveBeenCalled();
  });

  it("dispatches to a custom target element", () => {
    const action = vi.fn();
    const div = document.createElement("div");
    document.body.appendChild(div);
    renderHook(() => useKeybindings([{ key: "q", action }], { target: div }));
    const event = new KeyboardEvent("keydown", { key: "q", bubbles: true, cancelable: true });
    div.dispatchEvent(event);
    expect(action).toHaveBeenCalledTimes(1);
    document.body.removeChild(div);
  });

  it("prevents default when preventDefault is not false", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "p", action }]));
    const event = fireKeydown("p");
    expect(event.defaultPrevented).toBe(true);
  });

  it("does not prevent default when preventDefault=false", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "p", action, preventDefault: false }]));
    const event = fireKeydown("p");
    expect(event.defaultPrevented).toBe(false);
  });

  it("is case-insensitive for key matching", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "ArrowUp", action }]));
    fireKeydown("arrowup");
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("fires on first matching binding and stops", () => {
    const first = vi.fn();
    const second = vi.fn();
    renderHook(() =>
      useKeybindings([
        { key: "z", action: first },
        { key: "z", action: second },
      ]),
    );
    fireKeydown("z");
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });
});
