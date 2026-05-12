import { describe, it, expect } from 'vitest'
import { canvasReducer, __test } from './reducer'
import { createInitialState } from './state'
import type { Layer } from '../types'

const { alignLayers, distributeLayers, arrangeLayers } = __test

function makeLayer(id: string, x: number, y: number, w = 100, h = 100): Layer<Record<string, unknown>> {
  return {
    id,
    type: 'rect',
    x,
    y,
    width: w,
    height: h,
    rotation: 0,
    opacity: 1,
    isLocked: false,
    isVisible: true,
    data: {},
  }
}

/* ============================================================== *
 *  Reducer — layer CRUD                                            *
 * ============================================================== */

describe('canvasReducer — layer CRUD', () => {
  it('ADD_LAYER appends a layer', () => {
    const state = createInitialState()
    const next = canvasReducer(state, { type: 'ADD_LAYER', payload: makeLayer('a', 0, 0) })
    expect(next.layers).toHaveLength(1)
    expect(next.layers[0]!.id).toBe('a')
  })

  it('UPDATE_LAYER patches a single layer', () => {
    const state = { ...createInitialState(), layers: [makeLayer('a', 0, 0), makeLayer('b', 50, 50)] }
    const next = canvasReducer(state, {
      type: 'UPDATE_LAYER',
      payload: { id: 'a', updates: { x: 10 } },
    })
    expect(next.layers[0]!.x).toBe(10)
    expect(next.layers[1]!.x).toBe(50)
  })

  it('UPDATE_LAYERS patches many layers in one pass', () => {
    const state = { ...createInitialState(), layers: [makeLayer('a', 0, 0), makeLayer('b', 0, 0), makeLayer('c', 0, 0)] }
    const next = canvasReducer(state, {
      type: 'UPDATE_LAYERS',
      payload: [
        { id: 'a', updates: { x: 10 } },
        { id: 'c', updates: { x: 30 } },
      ],
    })
    expect(next.layers.map((l) => l.x)).toEqual([10, 0, 30])
  })

  it('DELETE_LAYERS removes by id set', () => {
    const state = { ...createInitialState(), layers: [makeLayer('a', 0, 0), makeLayer('b', 0, 0), makeLayer('c', 0, 0)] }
    const next = canvasReducer(state, { type: 'DELETE_LAYERS', payload: ['a', 'c'] })
    expect(next.layers.map((l) => l.id)).toEqual(['b'])
  })

  it('REORDER_LAYERS moves a layer between indices', () => {
    const state = { ...createInitialState(), layers: [makeLayer('a', 0, 0), makeLayer('b', 0, 0), makeLayer('c', 0, 0)] }
    const next = canvasReducer(state, { type: 'REORDER_LAYERS', payload: { fromIndex: 0, toIndex: 2 } })
    expect(next.layers.map((l) => l.id)).toEqual(['b', 'c', 'a'])
  })

  it('NUDGE_LAYERS skips locked layers', () => {
    const state = {
      ...createInitialState(),
      layers: [{ ...makeLayer('a', 0, 0), isLocked: true }, makeLayer('b', 0, 0)],
    }
    const next = canvasReducer(state, {
      type: 'NUDGE_LAYERS',
      payload: { targetLayerIds: ['a', 'b'], dx: 5, dy: 7 },
    })
    expect(next.layers[0]!.x).toBe(0) // locked, unchanged
    expect(next.layers[1]!.x).toBe(5)
    expect(next.layers[1]!.y).toBe(7)
  })
})

/* ============================================================== *
 *  Reducer — viewport / artboard                                   *
 * ============================================================== */

describe('canvasReducer — viewport', () => {
  it('SET_ZOOM clamps within 0.05–32', () => {
    const state = createInitialState()
    expect(canvasReducer(state, { type: 'SET_ZOOM', payload: 1000 }).zoom).toBe(32)
    expect(canvasReducer(state, { type: 'SET_ZOOM', payload: 0.001 }).zoom).toBe(0.05)
    expect(canvasReducer(state, { type: 'SET_ZOOM', payload: 1.5 }).zoom).toBe(1.5)
  })

  it('SET_ARTBOARD_OPACITY clamps 0–1', () => {
    const state = createInitialState()
    expect(canvasReducer(state, { type: 'SET_ARTBOARD_OPACITY', payload: 1.5 }).artboardOpacity).toBe(1)
    expect(canvasReducer(state, { type: 'SET_ARTBOARD_OPACITY', payload: -0.5 }).artboardOpacity).toBe(0)
  })

  it('readOnly mode no-ops layer mutations but allows zoom + theme', () => {
    const state = { ...createInitialState(), readOnly: true, layers: [makeLayer('a', 0, 0)] }
    const stillReadOnly = canvasReducer(state, { type: 'DELETE_LAYER', payload: 'a' })
    expect(stillReadOnly.layers).toHaveLength(1)
    const zoomed = canvasReducer(state, { type: 'SET_ZOOM', payload: 2 })
    expect(zoomed.zoom).toBe(2)
  })
})

/* ============================================================== *
 *  Reducer — clipboard                                             *
 * ============================================================== */

describe('canvasReducer — clipboard', () => {
  it('COPY_LAYERS captures deep clones; PASTE_LAYERS adds with offset and new ids', () => {
    const state = { ...createInitialState(), layers: [makeLayer('a', 10, 20)] }
    const copied = canvasReducer(state, { type: 'COPY_LAYERS', payload: { targetLayerIds: ['a'] } })
    expect(copied.copiedLayers).toHaveLength(1)
    expect(copied.copiedLayers![0]!.id).toBe('a')

    const pasted = canvasReducer(copied, { type: 'PASTE_LAYERS' })
    expect(pasted.layers).toHaveLength(2)
    expect(pasted.layers[1]!.id).not.toBe('a')
    expect(pasted.layers[1]!.x).toBe(26) // 10 + 16 default offset
    expect(pasted.layers[1]!.y).toBe(36)
  })
})

/* ============================================================== *
 *  Helpers — alignLayers                                           *
 * ============================================================== */

describe('alignLayers', () => {
  it('aligns left to the minimum x', () => {
    const layers = [makeLayer('a', 50, 0), makeLayer('b', 200, 0)]
    const next = alignLayers(layers, ['a', 'b'], 'left')
    expect(next.map((l) => l.x)).toEqual([50, 50])
  })

  it('aligns right by the maximum right edge', () => {
    const layers = [makeLayer('a', 0, 0, 100, 0), makeLayer('b', 200, 0, 50, 0)]
    const next = alignLayers(layers, ['a', 'b'], 'right')
    expect(next[0]!.x + next[0]!.width).toBe(250)
    expect(next[1]!.x + next[1]!.width).toBe(250)
  })

  it('aligns center to the bounding-box center', () => {
    const layers = [makeLayer('a', 0, 0, 100, 0), makeLayer('b', 200, 0, 100, 0)]
    const next = alignLayers(layers, ['a', 'b'], 'center')
    // Bounding box: 0..300. Center = 150.
    expect(next[0]!.x).toBe(100)
    expect(next[1]!.x).toBe(100)
  })

  it('returns original layers when fewer than 2 targets', () => {
    const layers = [makeLayer('a', 50, 0)]
    expect(alignLayers(layers, ['a'], 'left')).toBe(layers)
  })
})

/* ============================================================== *
 *  Helpers — distributeLayers                                      *
 * ============================================================== */

describe('distributeLayers', () => {
  it('distributes 3 layers horizontally with even gaps', () => {
    const layers = [
      makeLayer('a', 0, 0, 100, 0),
      makeLayer('b', 110, 0, 100, 0),
      makeLayer('c', 400, 0, 100, 0),
    ]
    const next = distributeLayers(layers, ['a', 'b', 'c'], 'horizontal')
    // Total span = 0..500; total widths = 300; gap = (500-300)/2 = 100
    expect(next[0]!.x).toBe(0)
    expect(next[1]!.x).toBe(200)
    expect(next[2]!.x).toBe(400)
  })

  it('returns original layers when fewer than 3 targets', () => {
    const layers = [makeLayer('a', 0, 0), makeLayer('b', 100, 0)]
    expect(distributeLayers(layers, ['a', 'b'], 'horizontal')).toBe(layers)
  })
})

/* ============================================================== *
 *  Helpers — arrangeLayers                                         *
 * ============================================================== */

describe('arrangeLayers', () => {
  const base = [makeLayer('a', 0, 0), makeLayer('b', 0, 0), makeLayer('c', 0, 0), makeLayer('d', 0, 0)]

  it('front moves selected to the end (top of z-order)', () => {
    const next = arrangeLayers(base, ['b'], 'front')
    expect(next.map((l) => l.id)).toEqual(['a', 'c', 'd', 'b'])
  })

  it('back moves selected to the start (bottom)', () => {
    const next = arrangeLayers(base, ['c'], 'back')
    expect(next.map((l) => l.id)).toEqual(['c', 'a', 'b', 'd'])
  })

  it('forward swaps with next neighbor', () => {
    const next = arrangeLayers(base, ['a'], 'forward')
    expect(next.map((l) => l.id)).toEqual(['b', 'a', 'c', 'd'])
  })

  it('backward swaps with previous neighbor', () => {
    const next = arrangeLayers(base, ['c'], 'backward')
    expect(next.map((l) => l.id)).toEqual(['a', 'c', 'b', 'd'])
  })
})
