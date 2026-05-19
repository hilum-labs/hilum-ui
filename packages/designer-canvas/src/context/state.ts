// Slim CanvasState — generic free-positioned canvas only.
// All Pappery domain (productType, dpi, binding*, bleed, etc.) is excluded
// per PHASE_0_AUDIT.md §P0.4.

import type {
  FrameSize,
  GridContainer,
  Layer,
  LayerTypeDescriptor,
  PanState,
  SurfaceTheme,
} from "../types";

export interface CanvasState<TData = Record<string, unknown>> {
  /** All layers in z-order. Index 0 = bottom. */
  layers: Layer<TData>[];

  /** View state. */
  zoom: number;
  pan: PanState;

  /** Artboard / frame. */
  frameSize: FrameSize;
  artboardName: string;
  artboardColor: string;
  artboardOpacity: number;
  /** Whether content is clipped to the frame bounds. */
  artboardClipContent: boolean;

  /** Optional grid layout mode. When set, layers can use `gridItem`. */
  gridContainer?: GridContainer | undefined;

  /** Clipboard: layers that have been copied / cut. */
  copiedLayers: Layer<TData>[] | null;

  /** Theme — chrome reads from here, components reference Hilum semantic vars. */
  uiColor: SurfaceTheme;
  canvasColor: SurfaceTheme;
  /** Editor accent (selection handles, snap guides). Defaults to Hilum brand-primary via CSS var. */
  accentColor: string;

  /** Renderer registry: descriptors for the layer kinds the app supports. */
  layerTypes: LayerTypeDescriptor[];

  /** When true, mutating actions no-op. */
  readOnly: boolean;
}

export function createInitialState<TData>(
  partial: Partial<CanvasState<TData>> = {},
): CanvasState<TData> {
  return {
    layers: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
    frameSize: { width: 800, height: 600 },
    artboardName: "Artboard",
    artboardColor: "#ffffff",
    artboardOpacity: 1,
    artboardClipContent: true,
    copiedLayers: null,
    uiColor: "light",
    canvasColor: "light",
    accentColor: "var(--brand-primary)",
    layerTypes: [],
    readOnly: false,
    ...partial,
  };
}
