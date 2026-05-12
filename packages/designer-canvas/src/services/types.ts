// Optional service interfaces consumers may inject for advanced features.
// See PHASE_0_AUDIT.md §P0.6.
//
// The package itself is WASM-free and bundles no concrete service. Apps that
// need text-on-paths, font registries, or thumbnails pass their own
// implementations via <CanvasProvider services={...}>.

export interface TextMetrics {
  ascent: number;
  descent: number;
  width: number;
  height: number;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface ShadowResult {
  path: string;
  shadow: string;
  blur: number;
}

export interface OutlineResult {
  path: string;
  outline: string;
  width: number;
}

export interface PathEffectResult {
  path: string;
  shadow: string;
  needsBlur: boolean;
  blur: number;
}

/**
 * Path / geometry service. Pappery injects a WASM-backed implementation; apps
 * that don't need text-on-paths or warps can omit this.
 */
export interface PathService {
  /** Boolean union of two SVG path strings. */
  union(pathA: string, pathB: string): string;

  /** SVG path for text rendered in a registered font. */
  getTextPath(
    text: string,
    fontName: string,
    fontSize: number,
    options?: {
      letterSpacing?: number;
      underline?: boolean;
      strikethrough?: boolean;
    },
  ): string;

  /** Detailed metrics for laid-out text. */
  getTextMetrics(
    text: string,
    fontName: string,
    fontSize: number,
    options?: { letterSpacing?: number },
  ): TextMetrics;

  /** Warp a path — arch, wave, flag, custom kinds. */
  warpPath(pathData: string, warpType: string, amount: number): string;

  /** Simple shape constructors. */
  createRectangle(width: number, height: number): string;
  createTriangle(width: number, height: number): string;
  createCircle(radius: number): string;

  /** Path effects. */
  getShadow(pathData: string, offset: number, angle: number, blur: number): ShadowResult;
  getOutline(pathData: string, outlineWidth: number): OutlineResult;
  getPathEffect(
    pathData: string,
    shadowType: string,
    offset: number,
    angle: number,
    blur: number,
    outlineWidth: number,
  ): PathEffectResult;

  /** Pattern fills. */
  getDecorationPattern(
    pathData: string,
    pattern: string,
    lineWeight: number,
    lineDistance: number,
    baseSize: number,
  ): string;

  /** Layer thumbnails (Worker-friendly). */
  renderThumbnail(
    layersJson: string,
    frameWidth: number,
    frameHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint8Array | null;
}

export interface FontDescriptor {
  family: string;
  /** App-defined source enum (Pappery: 'google'|'local'|'upload'). */
  source: string;
  loaded: boolean;
  weights?: number[];
}

/** Font orchestration service. */
export interface FontService {
  fonts: FontDescriptor[];
  loadFont(family: string, weight?: string | number): Promise<string>;
  getAvailableWeights(family: string): number[];
  isFontLoaded(family: string, weight?: string | number): boolean;
  getFontKey(family: string, weight?: string | number): string;
}

/* ============================================================== *
 *  Pluggable conversion helpers — replace P0.3 edge cases          *
 * ============================================================== */

/** Convert between display unit (e.g. mm) and the canvas's internal pixels. */
export interface UnitConverter {
  /** Display value → internal pixels. */
  toPx(value: number): number;
  /** Internal pixels → display value. */
  fromPx(pixels: number): number;
  /** Symbol (e.g. "px", "mm", "in"). Used as suffix in InputNumber. */
  unit: string;
  /** Decimal precision for display. Default: 0. */
  precision?: number;
}

/** Pluggable image upload. Default: in-memory blob URL. */
export type UploadImage = (file: File) => Promise<{ url: string; assetId?: string }>;

/* ============================================================== *
 *  Service container                                               *
 * ============================================================== */

export interface CanvasServices {
  paths?: PathService | null;
  fonts?: FontService | null;
  /** Unit display / conversion. Default: identity / "px". */
  units?: UnitConverter | null;
  /** Image upload. Default: blob URL. */
  uploadImage?: UploadImage | null;
}
