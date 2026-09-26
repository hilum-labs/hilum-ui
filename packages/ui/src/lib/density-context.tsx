"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Control density.
 *
 * - `default` — the standard Hilum sizing (40px inputs, 32px buttons, 40px
 *   menu rows). Used everywhere unless something opts in.
 * - `compact` — editor-chrome sizing (Figma / Framer / Linear inspectors):
 *   24px controls, 28px rows and menu items, 12px text, 11px labels, 8px
 *   horizontal padding, 4–6px radii.
 *
 * Density is carried two ways so it works for both CSS and portalled UI:
 *   1. the `data-density="compact"` attribute on an ancestor element drives the
 *      `compact:` Tailwind variant and the `--density-*` CSS variables emitted
 *      in tokens.css;
 *   2. React context, so portalled content (menus, popovers, select lists)
 *      can re-apply the attribute on its own root outside the DOM subtree.
 */
type Density = "default" | "compact";

const DensityContext = createContext<Density>("default");

function useDensity(): Density {
  return useContext(DensityContext);
}

interface DensityProviderProps {
  density: Density;
  children: ReactNode;
  /**
   * Render a `display: contents` wrapper carrying `data-density` (default).
   * Pass `false` when you already set `data-density` on your own element and
   * only need the React context (e.g. for portalled menus).
   */
  wrap?: boolean;
}

function DensityProvider({ density, children, wrap = true }: DensityProviderProps) {
  return (
    <DensityContext.Provider value={density}>
      {wrap ? (
        <div data-density={density} style={{ display: "contents" }}>
          {children}
        </div>
      ) : (
        children
      )}
    </DensityContext.Provider>
  );
}

/**
 * Props to spread on a portalled content root so it inherits the density of
 * the tree that opened it. Returns `{}` in default density so markup is
 * unchanged for non-editor consumers.
 */
function useDensityAttributes(): { "data-density"?: Density } {
  const density = useDensity();
  return density === "default" ? {} : { "data-density": density };
}

export { DensityContext, DensityProvider, useDensity, useDensityAttributes };
export type { Density, DensityProviderProps };
