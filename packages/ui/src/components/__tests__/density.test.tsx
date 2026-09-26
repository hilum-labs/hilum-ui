import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DensityProvider, useDensity, useDensityAttributes } from "../../lib/density-context";
import { InputNumber } from "../input-number";
import { Slider } from "../slider";
import { ColorPicker } from "../color-picker";

function DensityProbe() {
  const density = useDensity();
  const attrs = useDensityAttributes();
  return <span data-testid="probe" data-value={density} {...attrs} />;
}

describe("DensityProvider", () => {
  it("defaults to the default density with no attributes", () => {
    render(<DensityProbe />);
    const probe = screen.getByTestId("probe");
    expect(probe).toHaveAttribute("data-value", "default");
    expect(probe).not.toHaveAttribute("data-density");
  });

  it("provides compact density via context and a data-density wrapper", () => {
    const { container } = render(
      <DensityProvider density="compact">
        <DensityProbe />
      </DensityProvider>,
    );
    expect(container.firstElementChild).toHaveAttribute("data-density", "compact");
    const probe = screen.getByTestId("probe");
    expect(probe).toHaveAttribute("data-value", "compact");
    // Portalled content re-applies the attribute on its own root.
    expect(probe).toHaveAttribute("data-density", "compact");
  });

  it("can provide context only (wrap={false})", () => {
    const { container } = render(
      <DensityProvider density="compact" wrap={false}>
        <DensityProbe />
      </DensityProvider>,
    );
    expect(container.firstElementChild).toBe(screen.getByTestId("probe"));
  });
});

describe("InputNumber density + label prefix", () => {
  it("shows steppers and right-aligns by default", () => {
    render(<InputNumber value={10} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: /increment/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("text-right", "tabular-nums");
  });

  it("hides steppers and left-aligns under compact density", () => {
    render(
      <DensityProvider density="compact">
        <InputNumber value={10} onChange={() => {}} />
      </DensityProvider>,
    );
    expect(screen.queryByRole("button", { name: /increment/i })).not.toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveClass("text-left");
  });

  it("keeps steppers in compact density when explicitly requested", () => {
    render(
      <DensityProvider density="compact">
        <InputNumber value={10} onChange={() => {}} hideSteppers={false} />
      </DensityProvider>,
    );
    expect(screen.getByRole("button", { name: /increment/i })).toBeInTheDocument();
  });

  it("uses a string label as the accessible name and left-aligns the value", () => {
    render(<InputNumber label="X" value={10} onChange={() => {}} />);
    const input = screen.getByRole("textbox", { name: "X" });
    expect(input).toHaveClass("text-left");
  });

  it("scrubs the value when the label is dragged", () => {
    const onChange = vi.fn();
    render(<InputNumber label="W" value={100} onChange={onChange} step={1} />);
    const handle = screen.getByText("W");
    fireEvent.pointerDown(handle, { button: 0, clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 10, pointerId: 1 });
    expect(onChange).toHaveBeenLastCalledWith(105);
    fireEvent.pointerMove(handle, { clientX: 10, pointerId: 1, shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith(150);
    fireEvent.pointerUp(handle, { pointerId: 1 });
    onChange.mockClear();
    fireEvent.pointerMove(handle, { clientX: 40, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does not scrub when disabled", () => {
    const onChange = vi.fn();
    render(<InputNumber label="W" value={100} onChange={onChange} disabled />);
    const handle = screen.getByText("W");
    fireEvent.pointerDown(handle, { button: 0, clientX: 0, pointerId: 1 });
    fireEvent.pointerMove(handle, { clientX: 20, pointerId: 1 });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("Slider step pips", () => {
  it("draws pips when there are 10 or fewer steps", () => {
    const { container } = render(
      <Slider defaultValue={[2]} min={0} max={10} step={1} showSteps label="Few" />,
    );
    expect(container.querySelectorAll(".rounded-full.flex-shrink-0")).toHaveLength(11);
  });

  it("omits pips when there are more than 10 steps", () => {
    const { container } = render(
      <Slider defaultValue={[50]} min={0} max={100} step={2} showSteps label="Many" />,
    );
    expect(container.querySelectorAll(".rounded-full.flex-shrink-0")).toHaveLength(0);
  });
});

describe("ColorPicker disabled", () => {
  it("marks the panel disabled and inert", () => {
    render(<ColorPicker ariaLabel="Fill" defaultValue="#c100f1" disabled />);
    const panel = screen.getByLabelText("Fill");
    expect(panel).toHaveAttribute("aria-disabled", "true");
    expect(panel).toHaveAttribute("inert");
    expect(panel).toHaveClass("opacity-50", "pointer-events-none");
  });

  it("is interactive by default", () => {
    render(<ColorPicker ariaLabel="Fill" defaultValue="#c100f1" />);
    const panel = screen.getByLabelText("Fill");
    expect(panel).not.toHaveAttribute("aria-disabled");
    expect(panel).not.toHaveAttribute("inert");
  });
});
