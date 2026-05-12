import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistory } from './useHistory'

describe('useHistory', () => {
  it('initial state has present, no past, no future', () => {
    const { result } = renderHook(() => useHistory(0))
    expect(result.current.state).toBe(0)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
    expect(result.current.pastSize).toBe(0)
    expect(result.current.futureSize).toBe(0)
  })

  it('setState pushes onto past and clears future', () => {
    const { result } = renderHook(() => useHistory(0))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    expect(result.current.state).toBe(2)
    expect(result.current.canUndo).toBe(true)
    expect(result.current.pastSize).toBe(2)
  })

  it('undo and redo traverse the stack', () => {
    const { result } = renderHook(() => useHistory(0))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.undo())
    expect(result.current.state).toBe(1)
    expect(result.current.canRedo).toBe(true)
    act(() => result.current.undo())
    expect(result.current.state).toBe(0)
    expect(result.current.canUndo).toBe(false)
    act(() => result.current.redo())
    expect(result.current.state).toBe(1)
  })

  it('setState after undo clears future', () => {
    const { result } = renderHook(() => useHistory(0))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.undo())
    expect(result.current.canRedo).toBe(true)
    act(() => result.current.setState(99))
    expect(result.current.canRedo).toBe(false)
    expect(result.current.state).toBe(99)
  })

  it('replaceState swaps present without growing past', () => {
    const { result } = renderHook(() => useHistory(0))
    act(() => result.current.setState(1))
    act(() => result.current.replaceState(42))
    expect(result.current.state).toBe(42)
    expect(result.current.pastSize).toBe(1) // unchanged by replaceState
  })

  it('reset clears the entire stack', () => {
    const { result } = renderHook(() => useHistory(0))
    act(() => result.current.setState(1))
    act(() => result.current.setState(2))
    act(() => result.current.reset(99))
    expect(result.current.state).toBe(99)
    expect(result.current.canUndo).toBe(false)
    expect(result.current.canRedo).toBe(false)
  })

  it('functional setState receives previous state', () => {
    const { result } = renderHook(() => useHistory(10))
    act(() => result.current.setState((prev) => prev + 5))
    expect(result.current.state).toBe(15)
  })

  it('Object.is no-op skip prevents redundant history entries', () => {
    const { result } = renderHook(() => useHistory(7))
    act(() => result.current.setState(7)) // same value
    expect(result.current.pastSize).toBe(0)
  })

  it('works with arrays as the generic type', () => {
    const { result } = renderHook(() => useHistory<number[]>([1, 2]))
    act(() => result.current.setState([1, 2, 3]))
    act(() => result.current.undo())
    expect(result.current.state).toEqual([1, 2])
  })
})
