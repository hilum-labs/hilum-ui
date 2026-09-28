import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { matchesKeybinding, useKeybindings } from "../hooks/useKeybindings";

function fireKeydown(
  key: string,
  modifiers: {
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    code?: string;
  } = {},
  target: EventTarget = window,
) {
  const event = new KeyboardEvent("keydown", {
    key,
    code: modifiers.code ?? "",
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

  it("matches by code, independent of the produced key", () => {
    const action = vi.fn();
    renderHook(() =>
      useKeybindings([{ code: "KeyZ", mod: "platform", action }], { platform: "apple" }),
    );
    // Option/layout changes e.key but not e.code.
    fireKeydown("Ω", { metaKey: true, code: "KeyZ" });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("key or code matching either is enough", () => {
    const action = vi.fn();
    renderHook(() => useKeybindings([{ key: "z", code: "KeyZ", action }]));
    fireKeydown("я", { code: "KeyZ" });
    fireKeydown("z", { code: "KeyY" });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('mod: "platform" is Cmd on Apple platforms only', () => {
    const action = vi.fn();
    renderHook(() =>
      useKeybindings([{ key: "z", mod: "platform", action }], { platform: "apple" }),
    );
    fireKeydown("z", { ctrlKey: true });
    expect(action).not.toHaveBeenCalled();
    fireKeydown("z", { metaKey: true, ctrlKey: true });
    expect(action).not.toHaveBeenCalled();
    fireKeydown("z", { metaKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('mod: "platform" is Ctrl elsewhere', () => {
    const action = vi.fn();
    renderHook(() =>
      useKeybindings([{ key: "z", mod: "platform", action }], { platform: "other" }),
    );
    fireKeydown("z", { metaKey: true });
    expect(action).not.toHaveBeenCalled();
    fireKeydown("z", { ctrlKey: true });
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('mod: "platform" respects shift', () => {
    const undo = vi.fn();
    const redo = vi.fn();
    renderHook(() =>
      useKeybindings(
        [
          { key: "z", mod: "platform", action: undo },
          { key: "z", mod: "platform", shift: true, action: redo },
        ],
        { platform: "other" },
      ),
    );
    fireKeydown("Z", { ctrlKey: true, shiftKey: true });
    expect(redo).toHaveBeenCalledTimes(1);
    expect(undo).not.toHaveBeenCalled();
  });

  it("matchesKeybinding is usable on its own", () => {
    const e = new KeyboardEvent("keydown", { key: "a", ctrlKey: true });
    expect(matchesKeybinding({ key: "a", mod: "platform", action: () => {} }, e, "other")).toBe(
      true,
    );
    expect(matchesKeybinding({ key: "a", mod: "platform", action: () => {} }, e, "apple")).toBe(
      false,
    );
  });

  it("does not re-subscribe when an inline bindings array changes", () => {
    const add = vi.spyOn(window, "addEventListener");
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ action }) => useKeybindings([{ key: "k", action }]),
      {
        initialProps: { action: first },
      },
    );
    rerender({ action: second });
    rerender({ action: second });
    const keydownSubs = add.mock.calls.filter(([type]) => type === "keydown").length;
    expect(keydownSubs).toBe(1);
    fireKeydown("k");
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    add.mockRestore();
    unmount();
  });

  it("skips bindings while focus is in an editable element", () => {
    const action = vi.fn();
    const { unmount } = renderHook(() => useKeybindings([{ key: "a", action }]));
    for (const make of [
      () => document.createElement("input"),
      () => document.createElement("textarea"),
      () => document.createElement("select"),
      () => {
        const div = document.createElement("div");
        div.setAttribute("contenteditable", "true");
        div.tabIndex = 0;
        return div;
      },
    ]) {
      const el = make();
      document.body.appendChild(el);
      el.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
      // Event on window while the element holds focus.
      el.focus();
      fireKeydown("a");
      el.blur();
      document.body.removeChild(el);
    }
    expect(action).not.toHaveBeenCalled();
    unmount();
  });

  it("skips bindings inside a contentEditable ancestor", () => {
    const action = vi.fn();
    const { unmount } = renderHook(() => useKeybindings([{ key: "a", action }]));
    const host = document.createElement("div");
    host.setAttribute("contenteditable", "");
    const child = document.createElement("span");
    host.appendChild(child);
    document.body.appendChild(host);
    child.dispatchEvent(
      new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }),
    );
    expect(action).not.toHaveBeenCalled();
    document.body.removeChild(host);
    unmount();
  });

  it("allowInInputs opts a binding in", () => {
    const action = vi.fn();
    const { unmount } = renderHook(() =>
      useKeybindings([{ key: "s", mod: true, allowInInputs: true, action }]),
    );
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true, cancelable: true }),
    );
    expect(action).toHaveBeenCalledTimes(1);
    document.body.removeChild(input);
    unmount();
  });
});
