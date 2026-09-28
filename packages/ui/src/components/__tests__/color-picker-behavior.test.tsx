import { useState } from "react";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  ColorPicker,
  ColorPickerPopover,
  ColorSwatch,
  ColorTile,
  buildParsed,
  parseColor,
} from "../color-picker";
import {
  colorsRepresentSameValue,
  formatValueByFormat,
  hslToRgb,
  oklchToRgb,
  rgbToHsl,
  rgbToHsv,
  rgbToOklch,
} from "../../lib/color";

beforeAll(() => {
  // happy-dom lacks pointer capture; the scrub inputs and 2D area call it.
  const proto = HTMLElement.prototype as unknown as Record<string, unknown>;
  proto.setPointerCapture ??= () => undefined;
  proto.releasePointerCapture ??= () => undefined;
  proto.hasPointerCapture ??= () => false;
});

afterEach(() => {
  delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
});

/** Focus → type → Enter, the way a user commits a channel field. */
function commitField(input: HTMLElement, value: string) {
  act(() => input.focus());
  fireEvent.change(input, { target: { value } });
  fireEvent.keyDown(input, { key: "Enter" });
}

describe("color math", () => {
  it("parses every supported notation to sRGB + alpha", () => {
    expect(parseColor("#f00")).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    expect(parseColor("00ff0080")).toEqual({ r: 0, g: 255, b: 0, a: 128 / 255 });
    expect(parseColor("#0f08")?.a).toBeCloseTo(0x88 / 255);
    expect(parseColor("rgb(10, 20, 30)")).toEqual({ r: 10, g: 20, b: 30, a: 1 });
    expect(parseColor("rgba(10 20 30 / 50%)")).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
    const hsl = parseColor("hsl(120, 100%, 50%)");
    expect(hsl && [Math.round(hsl.r), Math.round(hsl.g), Math.round(hsl.b)]).toEqual([0, 255, 0]);
    expect(parseColor("hsla(0 100% 50% / 0.25)")?.a).toBe(0.25);
    const oklch = parseColor("oklch(62.8% 0.2577 29.23)");
    expect(oklch && Math.round(oklch.r)).toBe(255);
    expect(oklch && Math.round(oklch.g)).toBeLessThan(5);
    expect(parseColor("oklch(0.5 0.1 200 / 40%)")?.a).toBe(0.4);
  });

  it("rejects malformed input", () => {
    for (const bad of [
      "",
      "  ",
      "#12",
      "#12345",
      "rgb(1, 2)",
      "rgb(a, b, c)",
      "hsl(1 2)",
      "oklch(x y z)",
      "red",
    ]) {
      expect(parseColor(bad)).toBeNull();
    }
  });

  it("round-trips between colour spaces", () => {
    const hsv = rgbToHsv(51, 102, 153);
    const back = buildParsed(hsv.h, hsv.s, hsv.v, 1);
    expect([back.r, back.g, back.b]).toEqual([51, 102, 153]);
    expect(back.hex).toBe("#336699");
    expect(back.rgb).toBe("rgb(51, 102, 153)");

    const hsl = rgbToHsl(51, 102, 153);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    expect([rgb.r, rgb.g, rgb.b].map(Math.round)).toEqual([51, 102, 153]);

    const ok = rgbToOklch(51, 102, 153);
    const rgb2 = oklchToRgb(ok.L, ok.C, ok.H);
    expect([rgb2.r, rgb2.g, rgb2.b].map(Math.round)).toEqual([51, 102, 153]);
  });

  it("formats with alpha only when translucent", () => {
    const opaque = buildParsed(0, 1, 1, 1);
    expect(formatValueByFormat(opaque, "hex")).toBe("#ff0000");
    expect(formatValueByFormat(opaque, "rgb")).toBe("rgb(255, 0, 0)");
    expect(formatValueByFormat(opaque, "hsl")).toBe("hsl(0, 100%, 50%)");
    expect(formatValueByFormat(opaque, "oklch")).toMatch(/^oklch\(62\.\d% 0\.25\d \d+\.\d\)$/);

    const half = buildParsed(0, 1, 1, 0.5);
    expect(formatValueByFormat(half, "hex")).toBe("#ff000080");
    expect(formatValueByFormat(half, "rgb")).toBe("rgba(255, 0, 0, 0.5)");
    expect(formatValueByFormat(half, "hsl")).toBe("hsla(0, 100%, 50%, 0.5)");
    expect(formatValueByFormat(half, "oklch")).toMatch(/ \/ 0\.5\)$/);
  });

  it("treats formatting-only differences as the same colour", () => {
    expect(colorsRepresentSameValue("#FF0000", "#ff0000")).toBe(true);
    expect(colorsRepresentSameValue("#ff0000", "rgb(255, 0, 0)")).toBe(true);
    expect(colorsRepresentSameValue("#ff0000", "#fe0000")).toBe(false);
    expect(colorsRepresentSameValue("#ff0000", "nope")).toBe(false);
  });
});

describe("ColorPicker channel inputs", () => {
  it("commits a typed hex value", () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <ColorPicker defaultValue="#000000" onChange={onChange} onValueChange={onValueChange} />,
    );

    commitField(screen.getByRole("textbox", { name: "Hex value" }), "3366CC");

    expect(onChange).toHaveBeenLastCalledWith("#3366cc");
    expect(onValueChange.mock.lastCall?.[1]).toMatchObject({ r: 51, g: 102, b: 204 });
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Hex value" }).value).toBe(
      "3366CC",
    );
  });

  it("ignores an unparseable hex and Escape restores the draft", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#112233" onChange={onChange} />);
    const hex = screen.getByRole<HTMLInputElement>("textbox", { name: "Hex value" });

    commitField(hex, "zzz");
    expect(onChange).not.toHaveBeenCalled();

    act(() => hex.focus());
    fireEvent.change(hex, { target: { value: "ABCDEF" } });
    fireEvent.keyDown(hex, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect(hex.value).toBe("112233");
  });

  it("edits, clamps and nudges RGB channels", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#000000" defaultFormat="rgb" onChange={onChange} />);

    commitField(screen.getByRole("textbox", { name: "Red" }), "300");
    expect(onChange).toHaveBeenLastCalledWith("rgb(255, 0, 0)");

    const green = screen.getByRole("textbox", { name: "Green" });
    fireEvent.keyDown(green, { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith("rgb(255, 1, 0)");
    fireEvent.keyDown(green, { key: "ArrowUp", shiftKey: true });
    expect(onChange).toHaveBeenLastCalledWith("rgb(255, 11, 0)");

    commitField(screen.getByRole("textbox", { name: "Blue" }), "-4");
    expect(onChange).toHaveBeenLastCalledWith("rgb(255, 11, 0)");
  });

  it("scrubs a numeric channel by dragging horizontally", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#000000" defaultFormat="rgb" onChange={onChange} />);
    const wrapper = screen.getByRole("textbox", { name: "Blue" }).parentElement!;

    fireEvent.pointerDown(wrapper, { pointerId: 1, pointerType: "mouse", button: 0, clientX: 100 });
    fireEvent.pointerMove(wrapper, { pointerId: 1, pointerType: "mouse", clientX: 102 });
    expect(onChange).not.toHaveBeenCalled(); // under the 3px drag threshold
    fireEvent.pointerMove(wrapper, { pointerId: 1, pointerType: "mouse", clientX: 140 });
    expect(onChange).toHaveBeenLastCalledWith("rgb(0, 0, 40)");
    fireEvent.pointerUp(wrapper, { pointerId: 1, pointerType: "mouse", clientX: 140 });
  });

  it("a click without drag enters edit mode on a scrub field", async () => {
    render(<ColorPicker defaultValue="#000000" defaultFormat="rgb" />);
    const red = screen.getByRole("textbox", { name: "Red" });
    const wrapper = red.parentElement!;
    expect(wrapper.className).toContain("cursor-ew-resize");

    fireEvent.pointerDown(wrapper, { pointerId: 1, pointerType: "mouse", button: 0, clientX: 10 });
    fireEvent.pointerUp(wrapper, { pointerId: 1, pointerType: "mouse", clientX: 10 });

    await waitFor(() => expect(wrapper.className).not.toContain("cursor-ew-resize"));
  });

  it("edits HSL channels, wrapping hue", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" defaultFormat="hsl" onChange={onChange} />);

    commitField(screen.getByRole("textbox", { name: "Hue" }), "480"); // wraps to 120
    expect(onChange).toHaveBeenLastCalledWith("hsl(120, 100%, 50%)");

    commitField(screen.getByRole("textbox", { name: "Lightness" }), "25");
    expect(onChange).toHaveBeenLastCalledWith("hsl(120, 100%, 25%)");

    commitField(screen.getByRole("textbox", { name: "Saturation" }), "0");
    expect(onChange).toHaveBeenLastCalledWith("hsl(0, 0%, 25%)");
  });

  it("keeps the typed OKLCH hue sticky while editing lightness", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#3366cc" defaultFormat="oklch" onChange={onChange} />);

    commitField(screen.getByRole("textbox", { name: "Hue" }), "200");
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Hue" }).value).toBe("200");
    commitField(screen.getByRole("textbox", { name: "Lightness" }), "70");
    expect(onChange.mock.lastCall?.[0]).toMatch(/^oklch\(7\d\.\d%/);
    // The displayed hue is the one the user typed, not the RGB-derived drift.
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Hue" }).value).toBe("200");

    commitField(screen.getByRole("textbox", { name: "Chroma" }), "0.05");
    expect(onChange.mock.lastCall?.[0]).toMatch(/ 0\.0[45]\d /);
  });

  it("edits alpha as a percentage", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" onChange={onChange} />);

    commitField(screen.getByRole("textbox", { name: "Alpha" }), "50");
    expect(onChange).toHaveBeenLastCalledWith("#ff000080");
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Alpha" }).value).toBe("50%");
  });
});

describe("ColorPicker controls", () => {
  it("moves saturation / brightness with the keyboard", () => {
    const onValueChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} />);
    const area = screen.getByRole("slider", { name: "Saturation and brightness" });
    expect(area).toHaveAttribute("aria-valuetext", "Saturation 100%, brightness 100%");

    fireEvent.keyDown(area, { key: "ArrowLeft", shiftKey: true });
    expect(onValueChange.mock.lastCall?.[1].s).toBeCloseTo(0.9);
    fireEvent.keyDown(area, { key: "ArrowDown" });
    expect(onValueChange.mock.lastCall?.[1].v).toBeCloseTo(0.99);
    fireEvent.keyDown(area, { key: "Home" });
    expect(onValueChange.mock.lastCall?.[1].s).toBe(0);
    fireEvent.keyDown(area, { key: "PageDown" });
    expect(onValueChange.mock.lastCall?.[1].v).toBeCloseTo(0.89);
    expect(area).toHaveAttribute("aria-valuetext", "Saturation 0%, brightness 89%");

    const calls = onValueChange.mock.calls.length;
    fireEvent.keyDown(area, { key: "a" });
    expect(onValueChange).toHaveBeenCalledTimes(calls);
  });

  it("changes hue and alpha through their sliders", () => {
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" defaultFormat="hsl" onChange={onChange} />);

    const hue = screen.getByRole("slider", { name: "Hue" });
    fireEvent.keyDown(hue, { key: "ArrowRight" });
    expect(onChange).toHaveBeenLastCalledWith("hsl(1, 100%, 50%)");

    const alpha = screen.getByRole("slider", { name: "Alpha" });
    fireEvent.keyDown(alpha, { key: "Home" });
    expect(onChange).toHaveBeenLastCalledWith("hsla(1, 100%, 50%, 0)");
  });

  it("switches output format from the format menu", async () => {
    const onChange = vi.fn();
    const onFormatChange = vi.fn();
    render(
      <ColorPicker defaultValue="#ff0000" onChange={onChange} onFormatChange={onFormatChange} />,
    );

    const trigger = screen.getByRole("button", { name: "HEX" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(await screen.findByRole("menuitemradio", { name: "RGB" }));

    expect(onFormatChange).toHaveBeenCalledWith("rgb");
    expect(onChange).toHaveBeenLastCalledWith("rgb(255, 0, 0)");
    expect(screen.getByRole("textbox", { name: "Red" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitemradio")).toBeNull();
  });

  it("closes the format menu on Escape and outside click, and selects by keyboard", async () => {
    const onFormatChange = vi.fn();
    render(<ColorPicker defaultValue="#ff0000" onFormatChange={onFormatChange} />);
    const trigger = screen.getByRole("button", { name: "HEX" });

    fireEvent.click(trigger);
    await screen.findByRole("menuitemradio", { name: "HSL" });
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("menuitemradio")).toBeNull());

    fireEvent.click(trigger);
    await screen.findByRole("menuitemradio", { name: "HSL" });
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole("menuitemradio")).toBeNull());

    fireEvent.click(trigger);
    fireEvent.keyDown(await screen.findByRole("menuitemradio", { name: "OKLCH" }), {
      key: "Enter",
    });
    expect(onFormatChange).toHaveBeenCalledWith("oklch");
  });

  it("keeps a controlled format menu open state", async () => {
    render(<ColorPicker defaultValue="#ff0000" formatOpen />);
    expect(await screen.findAllByRole("menuitemradio")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "HEX" }));
    expect(screen.getAllByRole("menuitemradio")).toHaveLength(4);
  });

  it("picks swatches and marks the current one", () => {
    const onChange = vi.fn();
    render(
      <ColorPicker
        defaultValue="#ff0000"
        swatches={["#FF0000", "#00ff00", "bogus"]}
        onChange={onChange}
      />,
    );
    const red = screen.getByRole("button", { name: "Select color #FF0000" });
    const green = screen.getByRole("button", { name: "Select color #00ff00" });
    expect(red.style.boxShadow).toContain("var(--ring)");
    expect(green.style.boxShadow).not.toContain("var(--ring)");

    fireEvent.click(green);
    expect(onChange).toHaveBeenLastCalledWith("#00ff00");
    expect(green.style.boxShadow).toContain("var(--ring)");
  });

  it("picks a colour with the EyeDropper API when available", async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: "#123456" });
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open = open;
    };
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ffffff" onChange={onChange} />);

    fireEvent.click(await screen.findByRole("button", { name: "Pick color from screen" }));
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("#123456"));
  });

  it("ignores a cancelled EyeDropper and hides it when unsupported", async () => {
    const { unmount } = render(<ColorPicker defaultValue="#ffffff" />);
    expect(screen.queryByRole("button", { name: "Pick color from screen" })).toBeNull();
    unmount();

    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open = () => Promise.reject(new Error("AbortError"));
    };
    const onChange = vi.fn();
    render(<ColorPicker defaultValue="#ffffff" onChange={onChange} />);
    fireEvent.click(await screen.findByRole("button", { name: "Pick color from screen" }));
    await new Promise((r) => setTimeout(r, 0));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("syncs from an external controlled value", () => {
    function Harness() {
      const [value, setValue] = useState("#ff0000");
      return (
        <>
          <button onClick={() => setValue("#0000ff")}>blue</button>
          <ColorPicker value={value} onChange={setValue} />
        </>
      );
    }
    render(<Harness />);
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Hex value" }).value).toBe(
      "FF0000",
    );
    fireEvent.click(screen.getByText("blue"));
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Hex value" }).value).toBe(
      "0000FF",
    );
  });

  it("is inert when disabled", () => {
    const { container } = render(<ColorPicker disabled ariaLabel="Brand colour" />);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel).toHaveAttribute("aria-disabled", "true");
    expect(panel).toHaveAttribute("aria-label", "Brand colour");
  });
});

describe("ColorPickerPopover", () => {
  it("opens from the trigger, updates its value label, and closes on Escape", async () => {
    const onOpenChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <ColorPickerPopover
        defaultValue="#ff0000"
        triggerLabel="Fill"
        onOpenChange={onOpenChange}
        onValueChange={onValueChange}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Fill/ });
    expect(trigger).toHaveTextContent("FF0000");

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    commitField(await screen.findByRole("textbox", { name: "Hex value" }), "00ff00");
    expect(onValueChange).toHaveBeenLastCalledWith("#00ff00", expect.objectContaining({ g: 255 }));
    expect(trigger).toHaveTextContent("00FF00");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(screen.queryByRole("textbox", { name: "Hex value" })).toBeNull());
  });

  it("closes on an outside mousedown but not on one inside the panel", async () => {
    render(<ColorPickerPopover defaultValue="#ff0000" />);
    fireEvent.click(screen.getByRole("button", { expanded: false }));
    const hex = await screen.findByRole("textbox", { name: "Hex value" });

    fireEvent.mouseDown(hex);
    expect(screen.getByRole("textbox", { name: "Hex value" })).toBeInTheDocument();

    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole("textbox", { name: "Hex value" })).toBeNull());
  });

  it("respects a controlled open state and the remove affordance", () => {
    const onOpenChange = vi.fn();
    const onTriggerRemove = vi.fn();
    render(
      <ColorPickerPopover
        value="#336699"
        open={false}
        onOpenChange={onOpenChange}
        triggerShowRemove
        triggerShowValue={false}
        triggerLabel="Stroke"
        triggerLabelPosition="right"
        onTriggerRemove={onTriggerRemove}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Stroke/ });
    expect(trigger).not.toHaveTextContent("336699");

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole("textbox", { name: "Hex value" })).toBeNull();

    const remove = within(trigger).getByRole("button", { name: "Remove color" });
    fireEvent.click(remove);
    fireEvent.keyDown(remove, { key: "Enter" });
    expect(onTriggerRemove).toHaveBeenCalledTimes(2);
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });
});

describe("ColorSwatch / ColorTile", () => {
  it("shows a hover ring and forwards mouse handlers", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(<ColorSwatch color="#abcdef" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />);
    const swatch = screen.getByRole("button", { name: "Select color #abcdef" });
    const rest = swatch.style.boxShadow;

    fireEvent.mouseEnter(swatch);
    expect(onMouseEnter).toHaveBeenCalled();
    expect(swatch.style.boxShadow).not.toBe(rest);
    fireEvent.mouseLeave(swatch);
    expect(onMouseLeave).toHaveBeenCalled();
    expect(swatch.style.boxShadow).toBe(rest);
  });

  it("renders a tile at the requested size", () => {
    const { container } = render(<ColorTile color="rgb(1, 2, 3)" size={12} />);
    const tile = container.firstElementChild as HTMLElement;
    expect(tile.style.width).toBe("12px");
    expect((tile.firstElementChild as HTMLElement).style.backgroundColor).toBe("rgb(1, 2, 3)");
  });
});
