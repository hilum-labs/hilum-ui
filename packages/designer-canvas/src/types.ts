// @hilum/designer-canvas — generic types.
// See PHASE_0_AUDIT.md §P0.4 for the recommended shape.

/**
 * Generic Layer shape. Apps narrow `TData` per kind.
 *
 * Geometry (x, y, width, height, rotation, opacity) is first-class typed
 * — Pappery used to bury these in `cssVars: Record<string,string>`. The
 * package's reducer reads them directly.
 *
 * `type` is an open string; apps register renderers per type via the
 * RendererProvider. Apps narrow it via TypeScript discriminated unions:
 *
 *   type AppLayer =
 *     | Layer<TextData> & { type: 'text' }
 *     | Layer<ImageData> & { type: 'image' }
 */
export interface Layer<TData = Record<string, unknown>> {
  id: string
  type: string
  name?: string

  /** Position in the artboard's coordinate system (typically pixels). */
  x: number
  y: number
  width: number
  height: number

  /** Degrees, clockwise. Optional — defaults to 0. */
  rotation?: number
  /** 0–1. Optional — defaults to 1. */
  opacity?: number

  /** Render-time flags. */
  isLocked?: boolean
  isVisible?: boolean

  /** Used by group / ungroup actions. */
  groupId?: string

  /** Optional grid placement (set when canvas is in grid mode). */
  gridItem?: GridItem

  /** Kind-specific fields. Apps narrow this. */
  data: TData
}

export interface GridItem {
  /** Column start (1-based, like CSS grid-column). */
  x: number
  /** Row start. */
  y: number
  /** Column span. */
  w: number
  /** Row span. */
  h: number
}

export interface FrameSize {
  width: number
  height: number
}

export interface GridContainer {
  /** Number of columns. */
  cols: number
  /** Number of rows. */
  rows: number
  /** Gap between cells (px). */
  gap: number
  /** Padding around the grid (px). */
  padding: number
}

export interface PanState {
  x: number
  y: number
}

/* ============================================================== *
 *  Layer-type registry — apps declare the kinds their app supports *
 * ============================================================== */

export interface LayerTypeDescriptor<TData = unknown> {
  /** Layer kind identifier (matches `Layer.type`). */
  type: string
  /** Display label for menus, picker UIs. */
  label: string
  /** Default `data` payload when adding a new layer of this kind. */
  defaultData: TData
  /** Default size when adding a new layer of this kind. */
  defaultSize?: { width: number; height: number }
  /** Optional icon component. */
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

/* ============================================================== *
 *  Theme — see PLATFORM_PLAN.md §6 (uses Hilum brand)              *
 * ============================================================== */

export type SurfaceTheme = 'light' | 'mid' | 'dark'

import type * as React from 'react'
