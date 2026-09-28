import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useHistory } from "./useHistory";

describe("useHistory", () => {
  it("initial state has present, no past, no future", () => {
    const { result } = renderHook(() => useHistory(0));
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    expect(result.current.pastSize).toBe(0);
    expect(result.current.futureSize).toBe(0);
  });

  it("setState pushes onto past and clears future", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.pastSize).toBe(2);
  });

  it("undo and redo traverse the stack", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    act(() => result.current.undo());
    expect(result.current.state).toBe(1);
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.undo());
    expect(result.current.state).toBe(0);
    expect(result.current.canUndo).toBe(false);
    act(() => result.current.redo());
    expect(result.current.state).toBe(1);
  });

  it("setState after undo clears future", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    act(() => result.current.undo());
    expect(result.current.canRedo).toBe(true);
    act(() => result.current.setState(99));
    expect(result.current.canRedo).toBe(false);
    expect(result.current.state).toBe(99);
  });

  it("replaceState swaps present without growing past", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.replaceState(42));
    expect(result.current.state).toBe(42);
    expect(result.current.pastSize).toBe(1); // unchanged by replaceState
  });

  it("reset clears the entire stack", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    act(() => result.current.reset(99));
    expect(result.current.state).toBe(99);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("functional setState receives previous state", () => {
    const { result } = renderHook(() => useHistory(10));
    act(() => result.current.setState((prev) => prev + 5));
    expect(result.current.state).toBe(15);
  });

  it("Object.is no-op skip prevents redundant history entries", () => {
    const { result } = renderHook(() => useHistory(7));
    act(() => result.current.setState(7)); // same value
    expect(result.current.pastSize).toBe(0);
  });

  it("works with arrays as the generic type", () => {
    const { result } = renderHook(() => useHistory<number[]>([1, 2]));
    act(() => result.current.setState([1, 2, 3]));
    act(() => result.current.undo());
    expect(result.current.state).toEqual([1, 2]);
  });

  it("undo / redo return the new present state synchronously", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    let undone: number | undefined;
    let redone: number | undefined;
    act(() => {
      undone = result.current.undo();
    });
    expect(undone).toBe(1);
    act(() => {
      redone = result.current.redo();
    });
    expect(redone).toBe(2);
    // No-op undo/redo return the current state.
    act(() => {
      redone = result.current.redo();
    });
    expect(redone).toBe(2);
  });

  it("several undos in one tick compose (no stale closure)", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.setState(2));
    let last: number | undefined;
    act(() => {
      result.current.undo();
      last = result.current.undo();
    });
    expect(last).toBe(0);
    expect(result.current.state).toBe(0);
    expect(result.current.getState()).toBe(0);
    expect(result.current.futureSize).toBe(2);
  });

  it("limit drops the oldest entries (default 100)", () => {
    const { result } = renderHook(() => useHistory(0, { limit: 3 }));
    for (let i = 1; i <= 5; i++) act(() => result.current.setState(i));
    expect(result.current.pastSize).toBe(3);
    act(() => {
      result.current.undo();
      result.current.undo();
      result.current.undo();
    });
    expect(result.current.state).toBe(2);
    expect(result.current.canUndo).toBe(false);

    const unbounded = renderHook(() => useHistory(0));
    for (let i = 1; i <= 120; i++) act(() => unbounded.result.current.setState(i));
    expect(unbounded.result.current.pastSize).toBe(100);
  });

  it("a transaction records a single undo step", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.setState(1));
    act(() => result.current.beginTransaction());
    for (let i = 10; i <= 15; i++) act(() => result.current.setState(i));
    expect(result.current.state).toBe(15);
    expect(result.current.pastSize).toBe(1);
    act(() => result.current.commitTransaction());
    expect(result.current.pastSize).toBe(2);
    act(() => {
      result.current.undo();
    });
    expect(result.current.state).toBe(1);
  });

  it("a transaction with no net change records nothing", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => result.current.beginTransaction());
    act(() => result.current.commitTransaction());
    expect(result.current.pastSize).toBe(0);
  });

  it("nested transactions commit once at the outermost level", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.beginTransaction();
      result.current.setState(1);
      result.current.beginTransaction();
      result.current.setState(2);
      result.current.commitTransaction();
    });
    expect(result.current.pastSize).toBe(0);
    act(() => result.current.commitTransaction());
    expect(result.current.pastSize).toBe(1);
  });

  it("cancelTransaction restores the pre-transaction state", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.beginTransaction();
      result.current.setState(5);
      result.current.setState(6);
      result.current.cancelTransaction();
    });
    expect(result.current.state).toBe(0);
    expect(result.current.pastSize).toBe(0);
  });

  it("undo during an open transaction commits it first", () => {
    const { result } = renderHook(() => useHistory(0));
    act(() => {
      result.current.beginTransaction();
      result.current.setState(3);
    });
    let undone: number | undefined;
    act(() => {
      undone = result.current.undo();
    });
    expect(undone).toBe(0);
    expect(result.current.futureSize).toBe(1);
  });
});
