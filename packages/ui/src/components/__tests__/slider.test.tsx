import { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { Slider, SliderComfortable, SliderControl } from "../slider";

beforeAll(() => {
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  proto.setPointerCapture ??= () => undefined;
  proto.releasePointerCapture ??= () => undefined;
  proto.hasPointerCapture ??= () => false;
});

/** Give an element a real layout box (happy-dom reports 0 for everything). */
function layout(el: HTMLElement, { left = 0, width }: { left?: number; width: number }) {
  Object.defineProperty(el, "offsetWidth", { configurable: true, value: width });
  Object.defineProperty(el, "clientWidth", { configurable: true, value: width });
  el.getBoundingClientRect = () =>
    ({
      x: left,
      y: 0,
      left,
      top: 0,
      right: left + width,
      bottom: 32,
      width,
      height: 32,
      toJSON: () => ({}),
    }) as DOMRect;
}

const pointer = { pointerId: 1, pointerType: "mouse", button: 0 } as const;

describe("Slider", () => {
  it("names each thumb and moves with the keyboard", () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Slider
        defaultValue={[40]}
        label="Volume"
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb).toHaveAttribute("aria-valuenow", "40");

    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(41);
    expect(onValueChange).toHaveBeenLastCalledWith([41]);
    expect(thumb).toHaveAttribute("aria-valuenow", "41");
    expect(screen.getByRole("button", { name: "Edit slider value: 41" })).toBeInTheDocument();
  });

  it("labels range thumbs start / end and keeps the other end fixed", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={[20, 80]} label="Price" step={5} onChange={onChange} />);
    const start = screen.getByRole("slider", { name: "Price start" });
    const end = screen.getByRole("slider", { name: "Price end" });

    // Radix routes keys to the focused thumb.
    act(() => end.focus());
    fireEvent.keyDown(end, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenLastCalledWith([20, 75]);
    act(() => start.focus());
    fireEvent.keyDown(start, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith([0, 75]);
    expect(screen.getByText("-", { selector: "span[aria-hidden]" })).toBeInTheDocument();
  });

  it("prefers aria-labelledby for the thumb name", () => {
    render(
      <>
        <span id="lbl">Zoom level</span>
        <Slider defaultValue={[1]} aria-labelledby="lbl" />
      </>,
    );
    expect(screen.getByRole("slider", { name: "Zoom level" })).toBeInTheDocument();
  });

  it("types an exact value: commits on Enter, clamps and snaps to the step", async () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={[10]} step={5} label="Gap" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit slider value: 10" }));
    const input = screen.getByRole("spinbutton", { name: "Edit slider value" });
    expect(input).toHaveValue(10);

    fireEvent.change(input, { target: { value: "63" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith(65);

    fireEvent.click(screen.getByRole("button", { name: "Edit slider value: 65" }));
    const again = screen.getByRole("spinbutton", { name: "Edit slider value" });
    fireEvent.change(again, { target: { value: "500" } });
    fireEvent.blur(again);
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("cancels an edit with Escape or an unparseable value", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={[30]} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Edit slider value: 30" }));
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Escape" });
    expect(screen.queryByRole("spinbutton")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Edit slider value: 30" }));
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("edits one end of a range", () => {
    const onChange = vi.fn();
    render(<Slider defaultValue={[20, 80]} onChange={onChange} valuePosition="bottom" />);
    fireEvent.click(screen.getByRole("button", { name: "Edit slider value (end): 80" }));
    const input = screen.getByRole("spinbutton", { name: "Edit slider value (end)" });
    fireEvent.change(input, { target: { value: "90" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith([20, 90]);
  });

  it("jumps to a clicked track position and follows a drag", () => {
    const onChange = vi.fn();
    const { container } = render(<Slider defaultValue={[0]} label="Level" onChange={onChange} />);
    const track = container.querySelector<HTMLElement>(".relative.w-full.cursor-ew-resize")!;
    // 220px track: usable travel is 200px (thumb 20px), starting 10px in.
    layout(track, { left: 0, width: 220 });

    fireEvent.pointerDown(track, { ...pointer, clientX: 110 });
    expect(onChange).toHaveBeenLastCalledWith(50);
    fireEvent.pointerMove(track, { ...pointer, clientX: 400 });
    expect(onChange).toHaveBeenLastCalledWith(100);
    // Keyboard changes are ignored mid-drag (the pointer owns the value).
    const calls = onChange.mock.calls.length;
    fireEvent.keyDown(screen.getByRole("slider", { name: "Level" }), { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledTimes(calls);
    fireEvent.pointerUp(track, pointer);

    // Non-primary mouse buttons don't start a drag.
    fireEvent.pointerDown(track, { ...pointer, button: 2, clientX: 10 });
    expect(onChange).toHaveBeenCalledTimes(calls);
  });

  it("drags the nearer thumb of a range", () => {
    // The thumbs are positioned from the track width measured on mount.
    const width = vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(220);
    try {
      const onChange = vi.fn();
      const { container } = render(<Slider defaultValue={[20, 80]} onChange={onChange} />);
      const track = container.querySelector<HTMLElement>(".relative.w-full.cursor-ew-resize")!;
      layout(track, { width: 220 });

      fireEvent.pointerDown(track, { ...pointer, clientX: 200 }); // 95 → nearer the end thumb
      expect(onChange).toHaveBeenLastCalledWith([20, 95]);
      fireEvent.pointerUp(track, pointer);

      fireEvent.pointerDown(track, { ...pointer, clientX: 30 }); // 10 → nearer the start thumb
      expect(onChange).toHaveBeenLastCalledWith([10, 95]);
      fireEvent.pointerUp(track, pointer);
    } finally {
      width.mockRestore();
    }
  });

  it("previews the value under the cursor", async () => {
    const { container } = render(
      <Slider defaultValue={[0]} formatValue={(v) => `${v}px`} showValue={false} />,
    );
    const track = container.querySelector<HTMLElement>(".relative.w-full.cursor-ew-resize")!;
    layout(track, { width: 220 });
    const area = track.parentElement!;

    fireEvent.pointerEnter(area);
    fireEvent.mouseMove(area, { clientX: 60 });
    expect(await screen.findByText("25px")).toBeInTheDocument();

    fireEvent.pointerLeave(area);
    await waitFor(() => expect(screen.queryByText("25px")).toBeNull());
  });

  it("shows tooltip values while interacting in tooltip mode", async () => {
    const { container } = render(
      <Slider defaultValue={[10, 60]} valuePosition="tooltip" formatValue={(v) => `${v}%`} />,
    );
    expect(screen.queryByText("10%")).toBeNull();
    const area = container.querySelector<HTMLElement>(".relative.flex-1")!;
    fireEvent.pointerEnter(area);
    expect(await screen.findByText("10%")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("draws step dots only while they stay legible", () => {
    const { container, rerender } = render(<Slider defaultValue={[0]} step={25} showSteps />);
    const dots = () => container.querySelectorAll(".rounded-full.flex-shrink-0").length;
    expect(dots()).toBe(5);
    rerender(<Slider defaultValue={[0]} step={1} showSteps />);
    expect(dots()).toBe(0);
  });

  it("follows a controlled value", () => {
    function Controlled() {
      const [value, setValue] = useState(5);
      return (
        <>
          <button onClick={() => setValue(9)}>set</button>
          <SliderControl value={value} max={10} onChange={(v) => setValue(v as number)} label="N" />
        </>
      );
    }
    render(<Controlled />);
    const thumb = screen.getByRole("slider", { name: "N" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(thumb).toHaveAttribute("aria-valuenow", "6");
    fireEvent.click(screen.getByText("set"));
    expect(thumb).toHaveAttribute("aria-valuenow", "9");
  });

  it("disables the value editor and pointer input", () => {
    const onChange = vi.fn();
    const { container } = render(<Slider defaultValue={[5]} disabled onChange={onChange} />);
    expect(screen.getByRole("button", { name: "Edit slider value: 5" })).toBeDisabled();
    const track = container.querySelector<HTMLElement>(".relative.w-full.cursor-ew-resize")!;
    layout(track, { width: 220 });
    fireEvent.pointerDown(track, { ...pointer, clientX: 100 });
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("SliderComfortable", () => {
  it("renders label + formatted value and steps with the keyboard", () => {
    const onChange = vi.fn();
    render(
      <SliderComfortable
        value={3}
        max={10}
        label="Radius"
        formatValue={(v) => `${v}px`}
        onChange={onChange}
      />,
    );
    expect(screen.getByText("Radius")).toBeInTheDocument();
    expect(screen.getByText("3px")).toBeInTheDocument();
    const thumb = screen.getByRole("slider", { name: "Radius" });
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("snaps pointer input to the nearest pip", () => {
    const onChange = vi.fn();
    render(<SliderComfortable value={0} max={4} label="Level" onChange={onChange} />);
    const box = screen.getByRole("slider", { name: "Level" }).closest<HTMLElement>(".h-8")!;
    layout(box, { width: 100 });

    fireEvent.pointerDown(box, { ...pointer, clientX: 60 });
    expect(onChange).toHaveBeenLastCalledWith(2);
    fireEvent.pointerMove(box, { ...pointer, clientX: 95 });
    expect(onChange).toHaveBeenLastCalledWith(4);
    fireEvent.pointerUp(box, pointer);
    fireEvent.pointerMove(box, { ...pointer, clientX: 0 });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("scrubs continuously and via the resize handle", () => {
    const onChange = vi.fn();
    const { container } = render(
      <SliderComfortable
        value={50}
        step={10}
        variant="scrubber"
        label="Opacity"
        onChange={onChange}
      />,
    );
    const box = screen.getByRole("slider", { name: "Opacity" }).closest<HTMLElement>(".h-8")!;
    layout(box, { width: 200 });

    fireEvent.pointerDown(box, { ...pointer, clientX: 42 });
    expect(onChange).toHaveBeenLastCalledWith(20);
    fireEvent.pointerMove(box, { ...pointer, clientX: 150 });
    expect(onChange).toHaveBeenLastCalledWith(80);
    fireEvent.pointerUp(box, pointer);

    const handle = container.querySelector<HTMLElement>(".w-2.cursor-ew-resize")!;
    fireEvent.pointerDown(handle, { ...pointer, clientX: 0 });
    expect(onChange).toHaveBeenLastCalledWith(0);
    fireEvent.pointerMove(handle, { ...pointer, clientX: 200 });
    expect(onChange).toHaveBeenLastCalledWith(100);
    fireEvent.pointerUp(handle, pointer);
    fireEvent.pointerMove(handle, { ...pointer, clientX: 100 });
    expect(onChange).toHaveBeenLastCalledWith(100);
  });

  it("previews the hovered value", async () => {
    render(<SliderComfortable value={0} max={10} label="Blur" onChange={() => {}} />);
    const box = screen.getByRole("slider", { name: "Blur" }).closest<HTMLElement>(".h-8")!;
    layout(box, { width: 100 });
    const outer = box.parentElement!;

    fireEvent.pointerEnter(outer);
    fireEvent.mouseMove(outer, { clientX: 70 });
    expect(await screen.findByText("7")).toBeInTheDocument();
    fireEvent.pointerLeave(outer);
  });

  it("ignores input while disabled", () => {
    const onChange = vi.fn();
    render(<SliderComfortable value={1} max={4} disabled label="Off" onChange={onChange} />);
    const box = screen.getByRole("slider", { name: "Off" }).closest<HTMLElement>(".h-8")!;
    layout(box, { width: 100 });
    fireEvent.pointerDown(box, { ...pointer, clientX: 90 });
    act(() => {
      fireEvent.pointerEnter(box.parentElement!);
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
