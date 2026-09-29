import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DensityProvider } from "../../lib/density-context";
import {
  compactFieldFocusClasses,
  compactFieldSurfaceClasses,
  segmentedItemActiveClasses,
  segmentedItemOnClasses,
} from "../../lib/interaction";
import { Button } from "../button";
import { ButtonGroup, ButtonGroupItem } from "../button-group";
import { ColorInput } from "../color-input";
import { Input } from "../input";
import { InputNumber } from "../input-number";
import { Label } from "../label";
import { NativeSelect } from "../native-select";
import { SearchInput } from "../search-input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Textarea } from "../textarea";
import { ToggleGroup, ToggleGroupItem } from "../toggle-group";

const split = (classes: string) => classes.split(" ");
const FIELD_SURFACE = split(compactFieldSurfaceClasses);
const FIELD_FOCUS = split(compactFieldFocusClasses);
const FIELD_FOCUS_WITHIN = [
  "compact:focus-within:border-ring",
  "compact:focus-within:bg-background",
  "compact:focus-within:ring-0",
];

/** The aria-hidden background layer Button paints its fill on. */
const bgSpan = (button: HTMLElement) =>
  button.querySelector<HTMLElement>(":scope > span[aria-hidden]")!;

describe("compact field surfaces", () => {
  it("fills Input, Textarea and SearchInput with focus on the ring border", () => {
    render(
      <>
        <Input aria-label="Name" />
        <Textarea aria-label="Notes" />
        <SearchInput value="" onValueChange={() => {}} aria-label="Find" />
      </>,
    );
    for (const name of ["Name", "Notes", "Find"]) {
      expect(screen.getByLabelText(name)).toHaveClass(...FIELD_SURFACE, ...FIELD_FOCUS);
    }
    expect(screen.getByLabelText("Notes")).toHaveClass("compact:text-[12px]");
    // Default density is unchanged.
    expect(screen.getByLabelText("Name")).toHaveClass("border-border", "bg-background");
  });

  it("fills the composite InputNumber and ColorInput roots (focus-within)", () => {
    const { container } = render(
      <>
        <InputNumber aria-label="Width" value={4} onChange={() => {}} />
        <ColorInput value="#ff0000" onChange={() => {}} />
      </>,
    );
    const number = container.querySelector('[data-slot="input-number"]');
    const color = container.querySelector('[data-slot="color-input"]');
    for (const root of [number, color]) {
      expect(root).toHaveClass("border-border", "bg-background");
      expect(root).toHaveClass(...FIELD_SURFACE, ...FIELD_FOCUS_WITHIN);
    }
  });

  it("gives NativeSelect the 24px filled field", () => {
    render(
      <NativeSelect aria-label="Unit">
        <option>px</option>
      </NativeSelect>,
    );
    expect(screen.getByLabelText("Unit")).toHaveClass(
      "h-10",
      "compact:h-6",
      "compact:ps-2",
      "compact:py-0",
      "compact:rounded-[5px]",
      "compact:text-[12px]",
      ...FIELD_SURFACE,
      ...FIELD_FOCUS,
    );
  });

  it("makes the Select trigger a full-width filled field that opens onto the background", () => {
    render(
      <Select>
        <SelectTrigger aria-label="Blend" />
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox", { name: "Blend" });
    expect(trigger).toHaveClass(
      "compact:w-full",
      "compact:h-6",
      "compact:ps-2",
      "compact:pe-1.5",
      "compact:justify-between",
      "compact:bg-[var(--density-field)]",
      "compact:border-transparent",
      "compact:aria-expanded:bg-background",
      "compact:aria-expanded:border-ring",
      "compact:focus-visible:ring-0",
    );
    expect(trigger.parentElement).toHaveClass("compact:w-full", "compact:min-w-0");
    expect(trigger.querySelector("svg")).toHaveClass("compact:size-3", "text-muted-foreground");
  });

  it("sets compact labels at 11px on a 16px line", () => {
    render(<Label>Opacity</Label>);
    expect(screen.getByText("Opacity")).toHaveClass("compact:text-[11px]", "compact:leading-4");
  });
});

describe("compact ColorInput", () => {
  it("spans its row and lets the hex field absorb the slack", () => {
    const { container } = render(
      <ColorInput value="#ff0000" onChange={() => {}} opacity={50} onOpacityChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="color-input"]')).toHaveClass(
      "compact:flex",
      "compact:w-full",
      "compact:min-w-0",
    );
    const hex = screen.getByLabelText("Hex colour");
    expect(hex).toHaveClass("uppercase", "compact:flex-1", "compact:min-w-0");
    expect(hex).toHaveClass("border-s", "compact:border-foreground/[0.07]");
    expect(screen.getByLabelText("Opacity").parentElement).toHaveClass(
      "border-s",
      "compact:border-foreground/[0.07]",
    );
  });
});

describe("compact InputNumber prefix and suffix", () => {
  it("fixes the width of the prefix label only; the unit suffix sizes to its text", () => {
    render(<InputNumber label="X" unit="mm" value={10} onChange={() => {}} />);
    const prefix = screen.getByText("X");
    const suffix = screen.getByText("mm");
    // Both are aria-hidden: the old `> span[aria-hidden]` selector caught both.
    expect(prefix).toHaveAttribute("aria-hidden");
    expect(suffix).toHaveAttribute("aria-hidden");
    expect(prefix).toHaveClass("compact:w-[22px]", "compact:font-normal", "compact:text-[11px]");
    expect(suffix).toHaveClass("compact:text-[11px]", "text-muted-foreground");
    expect(suffix.className).not.toMatch(/(^|\s)(compact:)?w-/);
  });
});

describe("Button tile and field variants", () => {
  it("tile is a quiet fill; aria-pressed switches the bg span to the ringed background tile", () => {
    render(
      <>
        <Button variant="tile" aria-pressed={false}>
          Serif
        </Button>
        <Button variant="tile" aria-pressed>
          Sans
        </Button>
      </>,
    );
    const idle = screen.getByRole("button", { name: "Serif" });
    expect(idle).toHaveClass("text-foreground", "compact:whitespace-nowrap");
    expect(bgSpan(idle)).toHaveClass(
      "bg-foreground/[0.05]",
      "group-hover:bg-foreground/[0.08]",
      "group-aria-pressed:bg-background",
      "group-aria-pressed:shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]",
    );
    expect(screen.getByRole("button", { name: "Sans", pressed: true })).toBeInTheDocument();
  });

  it("tile `active` paints the pressed tile without aria-pressed", () => {
    render(
      <Button variant="tile" active className="h-auto compact:h-auto">
        Classic
      </Button>,
    );
    const tile = screen.getByRole("button", { name: "Classic" });
    expect(tile).toHaveClass("h-auto", "compact:h-auto");
    expect(tile).not.toHaveClass("h-8", "compact:h-6");
    expect(bgSpan(tile)).toHaveClass(
      "bg-background",
      "shadow-[inset_0_0_0_1px_var(--foreground),0_1px_2px_rgb(0_0_0/0.06)]",
    );
    expect(bgSpan(tile)).not.toHaveClass("group-hover:bg-foreground/[0.08]");
  });

  it("field reads as a control surface and becomes the compact filled field", () => {
    render(
      <Button variant="field" aria-expanded={false}>
        Inter
      </Button>,
    );
    const field = screen.getByRole("button", { name: "Inter" });
    expect(field).toHaveClass(
      "border",
      "border-border",
      "font-normal",
      "justify-between",
      "compact:h-6",
      "compact:ps-2",
      "compact:pe-1.5",
      "compact:text-[12px]",
      "compact:border-transparent",
      "compact:hover:border-border",
      "compact:aria-expanded:border-ring",
      "compact:[&_svg]:size-3",
      "compact:[&_svg]:text-muted-foreground",
    );
    expect(bgSpan(field)).toHaveClass(
      "bg-background",
      "compact:bg-[var(--density-field)]",
      "compact:group-aria-expanded:bg-background",
    );
    expect(field.querySelector(":scope > span:not([aria-hidden])")).toHaveClass(
      "w-full",
      "justify-between",
    );
  });

  it("field `active` keeps the open field on the background", () => {
    render(
      <Button variant="field" active>
        Inter
      </Button>,
    );
    expect(bgSpan(screen.getByRole("button", { name: "Inter" }))).toHaveClass("bg-background");
  });

  it("ghost pressed state is a subtle fill in the foreground colour", () => {
    render(
      <Button variant="ghost" size="icon-xs" aria-label="Link values" aria-pressed>
        <svg />
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Link values", pressed: true });
    expect(button).toHaveClass("aria-pressed:text-foreground");
    expect(bgSpan(button)).toHaveClass("group-aria-pressed:bg-foreground/[0.08]");
  });
});

describe("ButtonGroup segmented control", () => {
  it("spreads rest props on the track and passes aria-pressed through", () => {
    render(
      <ButtonGroup role="toolbar" aria-label="Alignment" className="w-full" data-testid="track">
        <ButtonGroupItem aria-pressed={false}>Left</ButtonGroupItem>
        <ButtonGroupItem aria-pressed>Center</ButtonGroupItem>
        <ButtonGroupItem disabled>Right</ButtonGroupItem>
      </ButtonGroup>,
    );
    const track = screen.getByRole("toolbar", { name: "Alignment" });
    expect(track).toBe(screen.getByTestId("track"));
    expect(track).toHaveClass(
      "w-full",
      "compact:h-6",
      "compact:p-0.5",
      "compact:gap-0",
      "compact:rounded-[6px]",
      "compact:bg-[var(--density-field)]",
      "compact:[&.w-full]:flex",
    );

    const center = screen.getByRole("button", { name: "Center", pressed: true });
    const left = screen.getByRole("button", { name: "Left", pressed: false });
    expect(center).toHaveClass(...split(segmentedItemActiveClasses));
    expect(left).not.toHaveClass("bg-card", "compact:bg-background");
    expect(left).toHaveClass(
      "compact:h-5",
      "compact:min-h-0",
      "compact:min-w-6",
      "compact:flex-1",
      "compact:px-1.5",
      "compact:rounded-[4px]",
      "compact:text-[11px]",
      "compact:active:scale-100",
      "compact:[&_svg]:size-3.5",
    );
    expect(screen.getByRole("button", { name: "Right" })).toHaveClass(
      "compact:disabled:opacity-40",
      "compact:disabled:cursor-default",
    );
  });

  it("`active` still selects an item and keeps the default look", () => {
    const { container } = render(
      <ButtonGroup>
        <ButtonGroupItem active>Month</ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(container.firstElementChild).toHaveClass("inline-flex", "rounded-xl", "bg-muted");
    expect(screen.getByRole("button", { name: "Month" })).toHaveClass(
      "bg-card",
      "text-foreground",
      "shadow-natural",
    );
  });

  it("keeps the ToggleGroup `data-state` chip in sync with the ButtonGroup chip", () => {
    const unprefixed = split(segmentedItemOnClasses).map((c) => c.replace("data-[state=on]:", ""));
    expect(unprefixed).toEqual(split(segmentedItemActiveClasses));
  });
});

describe("ToggleGroup segmented", () => {
  it("renders the track and makes the data-state=on item the chip", () => {
    render(
      <DensityProvider density="compact">
        <ToggleGroup type="single" variant="segmented" defaultValue="left" aria-label="Align">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </DensityProvider>,
    );
    const group = screen.getByRole("group", { name: "Align" });
    expect(group).toHaveClass("rounded-xl", "bg-muted", "compact:bg-[var(--density-field)]");
    expect(group).not.toHaveClass("gap-1");

    const left = screen.getByRole("radio", { name: "Left" });
    const right = screen.getByRole("radio", { name: "Right" });
    expect(left).toHaveAttribute("data-state", "on");
    expect(right).toHaveAttribute("data-state", "off");
    for (const item of [left, right]) {
      expect(item).toHaveClass(
        "compact:h-5",
        "data-[state=on]:bg-card",
        "compact:data-[state=on]:bg-background",
      );
      // Segmented items don't take the Toggle look.
      expect(item).not.toHaveClass("hover:bg-hover");
    }

    fireEvent.click(right);
    expect(right).toHaveAttribute("data-state", "on");
    expect(left).toHaveAttribute("data-state", "off");
  });

  it("leaves the other variants on the Toggle look", () => {
    render(
      <ToggleGroup type="multiple" aria-label="Format">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("group", { name: "Format" })).toHaveClass("gap-1");
    expect(screen.getByRole("button", { name: "Bold" })).toHaveClass(
      "hover:bg-hover",
      "data-[state=on]:bg-active",
    );
  });
});
