import { useMemo } from "react";
import { useShellContext } from "@hilum/designer";
import { useCanvasContext } from "../context/CanvasContext";
import type { Layer } from "../types";

export function useLayers<TData = Record<string, unknown>>(): Layer<TData>[] {
  return useCanvasContext<TData>().state.layers;
}

export function useLayer<TData = Record<string, unknown>>(id: string): Layer<TData> | undefined {
  const layers = useLayers<TData>();
  return useMemo(() => layers.find((l) => l.id === id), [layers, id]);
}

export function useSelectedLayerIds(): string[] {
  return useShellContext().selectedIds;
}

export function useSelectedLayers<TData = Record<string, unknown>>(): Layer<TData>[] {
  const ids = useSelectedLayerIds();
  const layers = useLayers<TData>();
  return useMemo(() => layers.filter((l) => ids.includes(l.id)), [layers, ids]);
}

export function useSelectedLayer<TData = Record<string, unknown>>(): Layer<TData> | undefined {
  const selected = useSelectedLayers<TData>();
  return selected[0];
}

export function useIsLayerSelected(id: string): boolean {
  return useSelectedLayerIds().includes(id);
}
