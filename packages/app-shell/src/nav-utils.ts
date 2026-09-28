import { useState } from "react";
import type { NavItem, NavSection } from "./types";

/** True when the item itself or any nested descendant is `active`. */
function isNavItemActive(item: NavItem): boolean {
  return Boolean(item.active) || hasActiveDescendant(item);
}

/** True when any nested descendant (not the item itself) is `active`. */
function hasActiveDescendant(item: NavItem): boolean {
  return item.children?.some(isNavItemActive) ?? false;
}

/** Depth-first flattening of nav items, including nested `children`. */
function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...flattenNavItems(item.children ?? [])]);
}

/** Flatten every item (top-level and nested) across sections. */
function flattenNavSections(sections: NavSection[]): NavItem[] {
  return flattenNavItems(sections.flatMap((section) => section.items));
}

/** True when a (React or DOM) event had `preventDefault()` called on it. */
function wasDefaultPrevented(event: unknown): boolean {
  return (
    typeof event === "object" &&
    event !== null &&
    "defaultPrevented" in event &&
    Boolean((event as { defaultPrevented?: boolean }).defaultPrevented)
  );
}

/**
 * Expanded state that also opens itself whenever `forceOpen` flips to true
 * (a descendant became active after navigation). Adjusts state during render
 * instead of in an effect so there's no collapsed flash.
 */
function useExpandedState(
  initial: boolean,
  forceOpen: boolean,
): [boolean, (next: boolean) => void] {
  const [expanded, setExpanded] = useState(initial);
  const [prevForceOpen, setPrevForceOpen] = useState(forceOpen);
  if (forceOpen !== prevForceOpen) {
    setPrevForceOpen(forceOpen);
    if (forceOpen && !expanded) setExpanded(true);
  }
  return [expanded, setExpanded];
}

export {
  flattenNavItems,
  flattenNavSections,
  hasActiveDescendant,
  isNavItemActive,
  useExpandedState,
  wasDefaultPrevented,
};
