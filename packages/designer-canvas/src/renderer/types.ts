import type { ComponentType } from 'react'
import type { Layer } from '../types'

/**
 * Renderer for a single layer kind. Receives the layer + a few context
 * flags. Apps register one of these per `layer.type` they support.
 *
 * Position / size / rotation / opacity are applied by the package via a
 * wrapper element — the renderer should focus on the **content** of the
 * layer (text, image, shape path, etc.). It can use `data` for kind-specific
 * fields.
 */
export interface LayerRendererContext {
  selected: boolean
  /** Current zoom — useful for scaling stroke width or rendering text crisply. */
  zoom: number
  /** Read-only mode (no interactivity). */
  readOnly: boolean
}

export type LayerRendererProps<TData = unknown> = {
  layer: Layer<TData>
  ctx: LayerRendererContext
}

export type LayerRenderer<TData = unknown> = ComponentType<LayerRendererProps<TData>>

/** Map of `layer.type` → renderer. */
export type RendererRegistry = Record<string, LayerRenderer<unknown>>
