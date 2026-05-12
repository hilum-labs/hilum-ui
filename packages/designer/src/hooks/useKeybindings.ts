import { useEffect } from "react";

export interface KeybindingConfig {
  /** Lower-case key (e.g. 'z', 'arrowup', 'escape', '+', '-'). */
  key: string;
  ctrl?: boolean;
  /** Cmd on macOS. Use both `meta` and `ctrl: true` if you want both. */
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  /**
   * Treat both ctrl and meta as the same modifier (for cross-platform
   * shortcuts like Cmd+Z / Ctrl+Z). Default: false. Set to true to match
   * either modifier.
   */
  mod?: boolean;
  action: (event: KeyboardEvent) => void;
  /** Don't run when target is an input / textarea / contenteditable. Default: true. */
  skipInputs?: boolean;
  /** Call event.preventDefault() before action. Default: true. */
  preventDefault?: boolean;
}

interface UseKeybindingsOptions {
  /** Skip all bindings entirely. */
  disabled?: boolean;
  /** Element to attach the listener to. Default: window. */
  target?: Window | HTMLElement | null;
}

/**
 * Generic keyboard shortcut registry. Engine-agnostic — the package doesn't
 * know what an action does. Pass an array of bindings; the hook attaches
 * a single keydown listener and dispatches on match.
 *
 * @hilum/designer-canvas wires its standard editor shortcuts (Cmd+Z, V, T,
 * arrow nudge, etc.) on top of this hook.
 */
export function useKeybindings(
  bindings: KeybindingConfig[],
  { disabled, target }: UseKeybindingsOptions = {},
) {
  useEffect(() => {
    if (disabled) return;
    const node = target ?? (typeof window !== "undefined" ? window : null);
    if (!node) return;

    const handler = (rawEvent: Event) => {
      const e = rawEvent as KeyboardEvent;

      const tgt = e.target as HTMLElement | null;
      const isInput =
        tgt instanceof HTMLInputElement ||
        tgt instanceof HTMLTextAreaElement ||
        tgt instanceof HTMLSelectElement ||
        tgt?.isContentEditable === true;

      const key = e.key.toLowerCase();

      for (const b of bindings) {
        if (b.key.toLowerCase() !== key) continue;
        if (b.skipInputs !== false && isInput) continue;

        const ctrlMatches = b.ctrl ? e.ctrlKey : !e.ctrlKey || b.mod;
        const metaMatches = b.meta ? e.metaKey : !e.metaKey || b.mod;
        const modMatches = b.mod ? e.ctrlKey || e.metaKey : true;
        const shiftMatches = b.shift ? e.shiftKey : !e.shiftKey;
        const altMatches = b.alt ? e.altKey : !e.altKey;

        if (!modMatches) continue;
        if (!b.mod && (!ctrlMatches || !metaMatches)) continue;
        if (!shiftMatches || !altMatches) continue;

        if (b.preventDefault !== false) e.preventDefault();
        b.action(e);
        return;
      }
    };

    (node as Window).addEventListener("keydown", handler);
    return () => (node as Window).removeEventListener("keydown", handler);
  }, [bindings, disabled, target]);
}
