/**
 * True when a keyboard event target is somewhere the user is typing (text
 * inputs, textareas, selects, contentEditable), so single-key shortcuts must
 * not fire.
 */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!target || typeof (target as HTMLElement).tagName !== "string") return false;
  const el = target as HTMLElement;
  const tag = el.tagName;
  if (tag === "TEXTAREA" || tag === "SELECT") return true;
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type;
    return !["button", "checkbox", "radio", "range", "color", "submit", "reset", "file"].includes(
      type,
    );
  }
  return (
    el.isContentEditable || el.closest?.('[contenteditable=""],[contenteditable="true"]') != null
  );
}
