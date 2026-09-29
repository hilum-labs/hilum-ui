import { render, screen } from "@testing-library/react";
import { Link2 } from "lucide-react";
import {
  Button,
  ButtonGroup,
  ButtonGroupItem,
  DensityProvider,
  Input,
  InputNumber,
  ToggleGroup,
  ToggleGroupItem,
} from "@hilum/ui";
import { DesignerPropertyRow } from "@hilum/designer";

/** Resolve a CSS colour expression to its computed rgb() string. */
function resolveColor(value: string) {
  const probe = document.createElement("div");
  probe.style.color = value;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";

describe("compact editor chrome (real browser)", () => {
  test("fields are filled with no resting border, and focus on the background with a ring border", () => {
    render(
      <DensityProvider density="compact">
        <Input aria-label="Name" />
      </DensityProvider>,
    );
    const input = screen.getByLabelText("Name");
    let style = getComputedStyle(input);
    expect(style.height).toBe("24px");
    expect(style.borderTopColor).toBe(TRANSPARENT);
    expect(style.backgroundColor).not.toBe(TRANSPARENT);
    expect(style.backgroundColor).not.toBe(resolveColor("var(--background)"));

    input.focus();
    style = getComputedStyle(input);
    expect(style.backgroundColor).toBe(resolveColor("var(--background)"));
    expect(style.borderTopColor).toBe(resolveColor("var(--ring)"));
    expect(style.boxShadow).not.toMatch(/\dpx \d+px \d+px [1-9]/);
  });

  test("default density fields keep their border and background", () => {
    render(<Input aria-label="Plain" />);
    const style = getComputedStyle(screen.getByLabelText("Plain"));
    expect(style.borderTopColor).toBe(resolveColor("var(--border)"));
    expect(style.backgroundColor).toBe(resolveColor("var(--background)"));
  });

  test("compact subtrees get plain tabular digits and 1.5px lucide strokes", () => {
    render(
      <>
        <div data-testid="chrome" data-density="compact">
          <Link2 data-testid="fine" />
        </div>
        <Link2 data-testid="regular" />
      </>,
    );
    expect(getComputedStyle(screen.getByTestId("chrome")).fontFeatureSettings).toMatch(/"tnum"/);
    expect(getComputedStyle(screen.getByTestId("fine")).strokeWidth).toBe("1.5px");
    expect(getComputedStyle(screen.getByTestId("regular")).strokeWidth).toBe("2px");
  });

  test("only the InputNumber prefix gets the 22px column", () => {
    render(
      <DensityProvider density="compact">
        <InputNumber label="X" unit="mm" value={10} onChange={() => {}} />
      </DensityProvider>,
    );
    expect(screen.getByText("X").getBoundingClientRect().width).toBe(22);
    expect(screen.getByText("mm").getBoundingClientRect().width).not.toBe(22);
  });

  test("a pressed tile is a background tile with a visible hairline ring", () => {
    render(
      <DensityProvider density="compact">
        <Button variant="tile" aria-pressed className="h-auto compact:h-auto">
          <span style={{ display: "block", height: 40 }}>Preset</span>
        </Button>
      </DensityProvider>,
    );
    const tile = screen.getByRole("button", { name: "Preset", pressed: true });
    expect(tile.getBoundingClientRect().height).toBeGreaterThan(24);
    const bg = getComputedStyle(tile, "::before");
    expect(bg.backgroundColor).toBe(resolveColor("var(--background)"));
    expect(bg.boxShadow).toMatch(/inset/);
  });

  test("ButtonGroup and ToggleGroup segmented share the 24px track and 20px chip", () => {
    render(
      <DensityProvider density="compact">
        <div style={{ width: 240 }}>
          <ButtonGroup className="w-full" aria-label="Group">
            <ButtonGroupItem aria-pressed>One</ButtonGroupItem>
            <ButtonGroupItem>Two</ButtonGroupItem>
          </ButtonGroup>
          <ToggleGroup type="single" variant="segmented" defaultValue="a" aria-label="Toggles">
            <ToggleGroupItem value="a">A</ToggleGroupItem>
            <ToggleGroupItem value="b">B</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DensityProvider>,
    );
    const group = screen.getByLabelText("Group");
    expect(getComputedStyle(group).display).toBe("flex");
    expect(group.getBoundingClientRect().height).toBe(24);
    const one = screen.getByRole("button", { name: "One" });
    const two = screen.getByRole("button", { name: "Two" });
    expect(one.getBoundingClientRect().height).toBe(20);
    expect(one.getBoundingClientRect().width).toBe(two.getBoundingClientRect().width);
    expect(getComputedStyle(one).backgroundColor).toBe(resolveColor("var(--background)"));
    expect(getComputedStyle(two).backgroundColor).toBe(TRANSPARENT);

    expect(screen.getByLabelText("Toggles").getBoundingClientRect().height).toBe(24);
    const on = screen.getByRole("radio", { name: "A" });
    expect(on.getBoundingClientRect().height).toBe(20);
    expect(getComputedStyle(on).backgroundColor).toBe(resolveColor("var(--background)"));
  });

  test("an inline property row gives a composed <label> the 72px column", () => {
    render(
      <DensityProvider density="compact">
        <div style={{ width: 240 }}>
          <DesignerPropertyRow layout="inline">
            <label htmlFor="op">A rather long label</label>
            <input id="op" />
          </DesignerPropertyRow>
          <DesignerPropertyRow layout="inline" label="Blend">
            <input aria-label="blend" />
          </DesignerPropertyRow>
        </div>
      </DensityProvider>,
    );
    expect(screen.getByText("A rather long label").getBoundingClientRect().width).toBe(72);
    expect(screen.getByText("Blend").getBoundingClientRect().width).toBe(72);
  });
});
