import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorPicker } from "../color-picker";

function UppercaseControlledPicker() {
  const [value, setValue] = useState("#FF0000");

  return <ColorPicker value={value} onChange={(next) => setValue(next.toUpperCase())} />;
}

describe("ColorPicker", () => {
  it("tracks pointer coordinates exactly while a controlled value is normalized", async () => {
    const { container } = render(<UppercaseControlledPicker />);
    const saturationSquare = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    saturationSquare.getBoundingClientRect = () =>
      ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 200,
        bottom: 100,
        width: 200,
        height: 100,
        toJSON: () => ({}),
      }) as DOMRect;
    saturationSquare.setPointerCapture = () => undefined;

    fireEvent.pointerEnter(saturationSquare, { pointerType: "mouse" });
    fireEvent.pointerMove(saturationSquare, {
      clientX: 40,
      clientY: 20,
      pointerId: 1,
      pointerType: "mouse",
    });
    expect(container.querySelector('[data-slot="color-picker-hover"]')).not.toBeNull();

    fireEvent.pointerDown(saturationSquare, {
      button: 0,
      clientX: 73,
      clientY: 42,
      pointerId: 1,
      pointerType: "mouse",
    });

    const thumb = container.querySelector<HTMLElement>('[data-slot="color-picker-thumb"]');
    expect(thumb).not.toBeNull();
    expect(container.querySelector('[data-slot="color-picker-hover"]')).toBeNull();
    await waitFor(() => {
      expect(Number.parseFloat(thumb?.style.left ?? "")).toBeCloseTo(36.5, 8);
      expect(Number.parseFloat(thumb?.style.top ?? "")).toBeCloseTo(42, 8);
    });

    fireEvent.pointerMove(saturationSquare, {
      clientX: 129,
      clientY: 67,
      pointerId: 1,
      pointerType: "mouse",
    });

    await waitFor(() => {
      expect(Number.parseFloat(thumb?.style.left ?? "")).toBeCloseTo(64.5, 8);
      expect(Number.parseFloat(thumb?.style.top ?? "")).toBeCloseTo(67, 8);
    });
  });

  it("preserves the precise selector position when a controlled value only changes casing", async () => {
    const { container } = render(<UppercaseControlledPicker />);
    const saturationSquare = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });

    fireEvent.keyDown(saturationSquare, { key: "ArrowLeft" });

    const thumb = container.querySelector('[data-slot="color-picker-thumb"]');
    expect(thumb).not.toBeNull();
    await waitFor(() => expect(thumb).toHaveStyle({ left: "99%" }));
  });
});
