import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { LayerRenderer, RendererRegistry } from "./types";

const RendererContext = createContext<RendererRegistry>({});

interface RendererProviderProps {
  /** Map of layer.type → renderer. Apps register their kinds here. */
  renderers: RendererRegistry;
  children: ReactNode;
}

/**
 * Pluggable renderer registry. Apps mount this near the canvas root and
 * pass `{ [layerType]: Component }`. The package never ships concrete
 * renderers — Pappery's text/image/shape renderers stay in Pappery, and
 * each app supplies its own per layer kind.
 */
export function RendererProvider({ renderers, children }: RendererProviderProps) {
  const value = useMemo(() => renderers, [renderers]);
  return <RendererContext.Provider value={value}>{children}</RendererContext.Provider>;
}

export function useLayerRenderer(type: string): LayerRenderer<unknown> | undefined {
  return useContext(RendererContext)[type];
}

export function useAllRenderers(): RendererRegistry {
  return useContext(RendererContext);
}
