"use client";

import * as React from "react";
import { MotionConfig, MotionConfigContext, useReducedMotion } from "framer-motion";

/**
 * Reduced-motion policy for Hilum components.
 *
 * - `"user"` (default): follow the OS `prefers-reduced-motion` setting.
 * - `"always"`: always reduce (positional/transform/layout motion is instant,
 *   opacity and colour still fade).
 * - `"never"`: always animate, regardless of the OS setting.
 */
type ReducedMotionSetting = "user" | "always" | "never";

const HilumMotionContext = React.createContext<ReducedMotionSetting | null>(null);

interface HilumProviderProps {
  children: React.ReactNode;
  /** Defaults to `"user"`. */
  reducedMotion?: ReducedMotionSetting;
}

/**
 * App-level provider for Hilum. Currently configures motion: wraps framer-motion
 * `MotionConfig` so every Hilum component (and your own `motion.*` elements)
 * honours `prefers-reduced-motion` — movement becomes instant, opacity/colour
 * transitions remain.
 *
 * Optional: Hilum components already respect `prefers-reduced-motion` without
 * it. Use it to change the policy (`reducedMotion="always" | "never"`) or to
 * extend the same behaviour to your own framer-motion animations.
 */
function HilumProvider({ children, reducedMotion = "user" }: HilumProviderProps) {
  return (
    <HilumMotionContext.Provider value={reducedMotion}>
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </HilumMotionContext.Provider>
  );
}
HilumProvider.displayName = "HilumProvider";

/** Alias of {@link HilumProvider} for apps that prefer the descriptive name. */
const MotionProvider = HilumProvider;

/**
 * The reduced-motion setting Hilum components should apply here: the nearest
 * HilumProvider's value, else an explicit non-default framer-motion
 * MotionConfig, else `"user"` (framer-motion's own default is `"never"`, which
 * would ignore the OS preference).
 */
function useHilumReducedMotionSetting(): ReducedMotionSetting {
  const hilum = React.useContext(HilumMotionContext);
  const framer = React.useContext(MotionConfigContext).reducedMotion;
  if (hilum) return hilum;
  if (framer === "always") return "always";
  return "user";
}

/**
 * True when Hilum animations should be reduced here. Use for imperative
 * animations (`animate(value, target, transition)`) that MotionConfig can't
 * reach.
 */
function usePrefersReducedMotion(): boolean {
  const setting = useHilumReducedMotionSetting();
  const os = useReducedMotion() ?? false;
  if (setting === "always") return true;
  if (setting === "never") return false;
  return os;
}

/**
 * Wraps children in `MotionConfig` with Hilum's reduced-motion setting.
 * Context-only: renders no DOM. Other MotionConfig options (transition, nonce,
 * …) are inherited from any parent MotionConfig.
 */
function MotionSafe({ children }: { children: React.ReactNode }) {
  const setting = useHilumReducedMotionSetting();
  // Always render the provider (rather than only when the setting differs) so
  // the element tree stays stable if the policy changes at runtime.
  return <MotionConfig reducedMotion={setting}>{children}</MotionConfig>;
}

export {
  HilumProvider,
  MotionProvider,
  MotionSafe,
  useHilumReducedMotionSetting,
  usePrefersReducedMotion,
};
export type { HilumProviderProps, ReducedMotionSetting };
