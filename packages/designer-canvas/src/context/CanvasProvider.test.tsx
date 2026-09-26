import { describe, it, expect, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { CanvasProvider } from "./CanvasProvider";
import { useCanvasContext, type CanvasContextValue } from "./CanvasContext";

function Probe({ onValue }: { onValue: (v: CanvasContextValue) => void }) {
  onValue(useCanvasContext());
  return null;
}

const layer = { id: "a", type: "rect", x: 0, y: 0, width: 10, height: 10, data: {} };

describe("CanvasProvider", () => {
  it("bumps revision per state transition and calls onChange once per commit", () => {
    const onChange = vi.fn();
    let latest!: CanvasContextValue;
    const { rerender } = render(
      <CanvasProvider onChange={onChange}>
        <Probe onValue={(v) => (latest = v)} />
      </CanvasProvider>,
    );
    expect(latest.revision).toBe(0);
    expect(onChange).toHaveBeenCalledTimes(1); // initial state

    act(() => latest.dispatch({ type: "ADD_LAYER", payload: layer as never }));
    expect(latest.revision).toBe(1);
    expect(latest.state.layers).toHaveLength(1);
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(latest.state);

    // Re-rendering with a new inline callback must not re-notify.
    const next = vi.fn();
    rerender(
      <CanvasProvider onChange={next}>
        <Probe onValue={(v) => (latest = v)} />
      </CanvasProvider>,
    );
    expect(next).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});
