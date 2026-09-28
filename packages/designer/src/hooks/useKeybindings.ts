import { useEffect, useLayoutEffect, useRef } from "react";

export interface KeybindingConfig {
  /**
   * `KeyboardEvent.key` to match, case-insensitive (e.g. 'z', 'arrowup',
   * 'escape', '+', '-'). Layout-dependent: prefer `code` for letter
   * shortcuts that must work on non-Latin layouts or with Option held.
   */
  key?: string;
  /**
   * `KeyboardEvent.code` to match, case-insensitive (e.g. 'KeyZ', 'Digit0',
   * 'Space'). Physical key, independent of layout. When both `key` and `code`
   * are set, either one matching is enough.
   */
  code?: string;
  ctrl?: boolean;
  /** Cmd on macOS. Use both `meta` and `ctrl: true` if you want both. */
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /**
   * Primary shortcut modifier.
   * - `"platform"` — Cmd on Apple platforms, Ctrl elsewhere (the other one
   *   must not be held unless `ctrl` / `meta` asks for it). Use this for
   *   standard shortcuts like undo (mod+Z).
   * - `true` — either Ctrl or Cmd (legacy behaviour).
   * Default: no modifier.
   */
  mod?: boolean | "platform";
  action: (event: KeyboardEvent) => void;
  /**
   * Also fire while focus is in an input / textarea / select /
   * contentEditable element. Default: false.
   */
  allowInInputs?: boolean;
  /**
   * @deprecated Use `allowInInputs` (`skipInputs: false` is equivalent to
   * `allowInInputs: true`).
   */
  skipInputs?: boolean;
  /** Call event.preventDefault() before action. Default: true. */
  preventDefault?: boolean;
}

export interface UseKeybindingsOptions {
  /** Skip all bindings entirely. */
  disabled?: boolean;
  /** Element to attach the listener to. Default: window. */
  target?: Window | HTMLElement | null;
  /**
   * Platform used to resolve `mod: "platform"`. Default: detected from
   * `navigator` (`"apple"` on macOS / iOS).
   */
  platform?: "apple" | "other";
}

/** True on macOS / iOS, where the primary shortcut modifier is Cmd. */
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent || "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

const EDITABLE_SELECTOR =
  'input, textarea, select, [contenteditable=""], [contenteditable="true"], [contenteditable="plaintext-only"]';

/** Whether keyboard focus is in a text-entry control. */
function isEditableTarget(target: EventTarget | null): boolean {
  let el: Element | null = target instanceof Element ? target : null;
  // Events dispatched on window/document: fall back to the focused element.
  if (!el || el === document.body || el === document.documentElement) {
    el = typeof document !== "undefined" ? document.activeElement : null;
  }
  if (!el) return false;
  if ((el as HTMLElement).isContentEditable) return true;
  return el.closest(EDITABLE_SELECTOR) !== null;
}

function keyMatches(b: KeybindingConfig, e: KeyboardEvent): boolean {
  if (
    b.key !== undefined &&
    typeof e.key === "string" &&
    b.key.toLowerCase() === e.key.toLowerCase()
  ) {
    return true;
  }
  if (
    b.code !== undefined &&
    typeof e.code === "string" &&
    b.code.toLowerCase() === e.code.toLowerCase()
  ) {
    return true;
  }
  return false;
}

function modifiersMatch(b: KeybindingConfig, e: KeyboardEvent, apple: boolean): boolean {
  if (b.shift ? !e.shiftKey : e.shiftKey) return false;
  if (b.alt ? !e.altKey : e.altKey) return false;

  if (b.mod === "platform") {
    const primary = apple ? e.metaKey : e.ctrlKey;
    const other = apple ? e.ctrlKey : e.metaKey;
    const otherRequired = apple ? b.ctrl : b.meta;
    return primary && (otherRequired ? other : !other);
  }
  if (b.mod) return e.ctrlKey || e.metaKey;

  return (b.ctrl ? e.ctrlKey : !e.ctrlKey) && (b.meta ? e.metaKey : !e.metaKey);
}

/** Whether `event` triggers `binding`. Exported for custom dispatchers. */
export function matchesKeybinding(
  binding: KeybindingConfig,
  event: KeyboardEvent,
  platform: "apple" | "other" = isApplePlatform() ? "apple" : "other",
): boolean {
  return keyMatches(binding, event) && modifiersMatch(binding, event, platform === "apple");
}

/**
 * Generic keyboard shortcut registry. Engine-agnostic — the package doesn't
 * know what an action does. Pass an array of bindings; the hook attaches
 * a single keydown listener and dispatches to the first match.
 *
 * Bindings are read through a ref, so passing a new inline array on every
 * render does not re-subscribe the listener.
 *
 * `<Designer>` from @hilum/designer-canvas uses this hook for its built-in
 * canvas shortcuts (undo / redo, delete, select all, arrow nudge, tools).
 */
export function useKeybindings(
  bindings: KeybindingConfig[],
  { disabled, target, platform }: UseKeybindingsOptions = {},
) {
  const bindingsRef = useRef(bindings);
  useLayoutEffect(() => {
    bindingsRef.current = bindings;
  });

  useEffect(() => {
    if (disabled) return;
    const node = target ?? (typeof window !== "undefined" ? window : null);
    if (!node) return;
    const resolvedPlatform = platform ?? (isApplePlatform() ? "apple" : "other");

    const handler = (rawEvent: Event) => {
      const e = rawEvent as KeyboardEvent;
      const inInput = isEditableTarget(e.target);

      for (const b of bindingsRef.current) {
        if (!matchesKeybinding(b, e, resolvedPlatform)) continue;
        const allowInInputs = b.allowInInputs ?? b.skipInputs === false;
        if (inInput && !allowInInputs) continue;

        if (b.preventDefault !== false) e.preventDefault();
        b.action(e);
        return;
      }
    };

    (node as Window).addEventListener("keydown", handler);
    return () => (node as Window).removeEventListener("keydown", handler);
  }, [disabled, target, platform]);
}
