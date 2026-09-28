"use client";

/**
 * Internal drop-in for `framer-motion` used by every Hilum component.
 *
 * `motion.<tag>` elements are wrapped in {@link MotionSafe}, so they honour
 * `prefers-reduced-motion` even when the app has no MotionConfig/HilumProvider:
 * with reduced motion, framer-motion makes transform, size/position (top, left,
 * width, height…) and layout animations instant while opacity/colour still
 * fade. The imperative `animate()` is wrapped to jump straight to its target
 * under the OS reduced-motion setting.
 *
 * Import from here instead of "framer-motion" inside packages/ui.
 */

import * as React from "react";
import {
  animate as framerAnimate,
  motion as framerMotion,
  type MotionStyle as FramerMotionStyle,
} from "framer-motion";
import { MotionSafe } from "./motion-provider";

export {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  Reorder,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
export type { HTMLMotionProps, MotionStyle, MotionValue, Transition } from "framer-motion";
export { usePrefersReducedMotion } from "./motion-provider";

const wrapped = new Map<PropertyKey, unknown>();

function wrap(key: PropertyKey, Component: React.ElementType) {
  function Wrapped({
    ref,
    ...props
  }: Record<string, unknown> & { ref?: React.Ref<unknown> | undefined }) {
    return <MotionSafe>{React.createElement(Component, { ...props, ref })}</MotionSafe>;
  }
  Wrapped.displayName = `MotionSafe(motion.${String(key)})`;
  return Wrapped;
}

/** `framer-motion`'s `motion`, with each element honouring reduced motion. */
export const motion = new Proxy(framerMotion, {
  get(target, key, receiver) {
    const value = Reflect.get(target, key, receiver) as unknown;
    // motion.div / motion.svg / … are component objects; `motion.create` is a plain function.
    if (typeof key !== "string" || key === "create" || value == null) return value;
    if (typeof value !== "object" && typeof value !== "function") return value;
    let cached = wrapped.get(key);
    if (!cached) {
      cached = wrap(key, value as React.ElementType);
      wrapped.set(key, cached);
    }
    return cached;
  },
}) as typeof framerMotion;

function osPrefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * `framer-motion`'s imperative `animate`, but instant when the OS asks for
 * reduced motion. Components that know the Hilum setting (via
 * `usePrefersReducedMotion`) can pass `{ duration: 0 }` themselves instead.
 */
export const animate = ((...args: unknown[]) => {
  if (osPrefersReducedMotion() && args.length >= 2) {
    const options = (args[2] ?? {}) as Record<string, unknown>;
    return (framerAnimate as (...a: unknown[]) => unknown)(args[0], args[1], {
      ...options,
      type: false,
      duration: 0,
      delay: 0,
    });
  }
  return (framerAnimate as (...a: unknown[]) => unknown)(...args);
}) as typeof framerAnimate;

/**
 * A plain React `style` object (e.g. a component's `style` / `trackStyle`
 * prop) typed for a `motion.*` element. Every CSSProperties value is a valid
 * motion style value; the types only diverge because CSSProperties declares
 * optional keys as `T | undefined`, which `exactOptionalPropertyTypes` rejects
 * for MotionStyle (framer-motion skips undefined values at runtime).
 */
export function asMotionStyle(style: React.CSSProperties | undefined): FramerMotionStyle {
  return (style ?? {}) as FramerMotionStyle;
}
