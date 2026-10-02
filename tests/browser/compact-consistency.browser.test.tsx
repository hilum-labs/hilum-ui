/**
 * Compact-scale stragglers from the Pappery editor audit, measured with the
 * real tokens.css: TabsSubtle tabs were 28px tall with the shape radius in
 * compact density (controls are 24px / 5px), the ColorInput percent suffix was
 * 10px, and the toolbar and rail used a 6px radius. And the secondary Badge
 * sat on `--accent`, the brand tint `createTheme()` overrides: white text on
 * a near-white pill in the mid theme, a heavy brand pill in dark.
 */
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import { MousePointer2 } from "lucide-react";
import { Badge, ColorInput, DensityProvider, TabsSubtle, TabsSubtleItem } from "@hilum/ui";
import { DesignerPanelTabs, DesignerSidebar, DesignerToolbarButton } from "@hilum/designer";
import { applyTheme } from "../../packages/ui/src/tokens/create-theme";
import { contrast, effectiveBackground, textContrast } from "./contrast";

function Tabs() {
  return (
    <TabsSubtle selectedIndex={0} onSelect={() => {}} aria-label="Panels">
      <TabsSubtleItem index={0} label="Layers" />
      <TabsSubtleItem index={1} label="Pages" />
    </TabsSubtle>
  );
}

/** The four corner radii of `el`, as computed. */
function radii(el: Element) {
  const style = getComputedStyle(el);
  return [
    style.borderTopLeftRadius,
    style.borderTopRightRadius,
    style.borderBottomRightRadius,
    style.borderBottomLeftRadius,
  ];
}

const FIVE = ["5px", "5px", "5px", "5px"];

describe("compact TabsSubtle (real browser)", () => {
  test("a tab is 24px tall with a 5px radius and a 12px label", async () => {
    render(
      <div data-density="compact">
        <Tabs />
      </div>,
    );
    const tablist = screen.getByRole("tablist", { name: "Panels" });
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab.getBoundingClientRect().height).toBe(24);
      expect(radii(tab)).toEqual(FIVE);
      expect(getComputedStyle(tab.querySelector(".inline-grid")!).fontSize).toBe("12px");
    }

    // The selected pill is drawn behind the tab at the same size and radius.
    await expect
      .poll(() => tablist.querySelector(":scope > .bg-active")?.getBoundingClientRect().height)
      .toBe(24);
    expect(radii(tablist.querySelector(":scope > .bg-active")!)).toEqual(FIVE);

    // The hover pill too.
    await userEvent.hover(screen.getByRole("tab", { name: "Pages" }));
    await expect.poll(() => tablist.querySelectorAll(":scope > .bg-active").length).toBe(2);
    for (const pill of tablist.querySelectorAll(":scope > .bg-active")) {
      expect(radii(pill)).toEqual(FIVE);
    }

    // The focus ring sits 2px outside the tab: a 7px outer radius is a 5px inner one.
    await userEvent.keyboard("{Tab}");
    await expect.poll(() => tablist.querySelector(":scope > .border-ring")).not.toBeNull();
    const ring = tablist.querySelector(":scope > .border-ring")!;
    expect(radii(ring)).toEqual(["7px", "7px", "7px", "7px"]);
    expect(getComputedStyle(ring).borderTopWidth).toBe("2px");
  });

  test("DesignerPanelTabs take the same size", () => {
    render(
      <DensityProvider density="compact">
        <DesignerPanelTabs
          tabs={[
            { value: "layers", label: "Layers" },
            { value: "pages", label: "Pages" },
          ]}
          value="layers"
          onValueChange={() => {}}
          aria-label="Editor panels"
        />
      </DensityProvider>,
    );
    const tab = screen.getByRole("tab", { name: "Layers" });
    expect(tab.getBoundingClientRect().height).toBe(24);
    expect(radii(tab)).toEqual(FIVE);
  });

  test("default density keeps the padded tab and the shape radius", () => {
    render(<Tabs />);
    const tab = screen.getByRole("tab", { name: "Layers" });
    expect(tab.getBoundingClientRect().height).toBeGreaterThan(24);
    expect(radii(tab)).not.toEqual(FIVE);
    expect(getComputedStyle(tab.querySelector(".inline-grid")!).fontSize).toBe("13px");
  });
});

describe("compact control scale (real browser)", () => {
  test("the ColorInput percent suffix is 11px in compact, 10px otherwise", () => {
    const props = { value: "#ff0000", onChange: () => {}, opacity: 50, onOpacityChange: () => {} };
    render(
      <>
        <div data-density="compact" data-testid="compact">
          <ColorInput {...props} />
        </div>
        <div data-testid="default">
          <ColorInput {...props} />
        </div>
      </>,
    );
    const suffix = (id: string) =>
      [...screen.getByTestId(id).querySelectorAll("span")].find((el) => el.textContent === "%")!;
    expect(getComputedStyle(suffix("compact")).fontSize).toBe("11px");
    expect(getComputedStyle(suffix("default")).fontSize).toBe("10px");
  });

  test("toolbar buttons and rail items use the 5px control radius", () => {
    render(
      <>
        <DesignerToolbarButton label="Select" icon={MousePointer2} />
        <DesignerSidebar items={[{ id: "pages", label: "Pages", icon: MousePointer2 }]} />
      </>,
    );
    expect(radii(screen.getByRole("button", { name: "Select" }))).toEqual(FIVE);
    expect(radii(screen.getByRole("button", { name: "Pages" }))).toEqual(FIVE);
  });
});

const THEMES = ["light", "mid", "dark"] as const;
// Literal class names so Tailwind generates them.
const SURFACES = {
  background: "bg-background",
  card: "bg-card",
  surface: "bg-surface",
  muted: "bg-muted",
} as const;
const SURFACE_NAMES = Object.keys(SURFACES) as (keyof typeof SURFACES)[];

describe("Badge contrast (real browser)", () => {
  const root = document.documentElement;
  let removeTheme: (() => void) | undefined;

  afterEach(() => {
    removeTheme?.();
    removeTheme = undefined;
    delete root.dataset.theme;
  });

  test.each(THEMES.flatMap((theme) => SURFACE_NAMES.map((surface) => [theme, surface] as const)))(
    "secondary is a quiet neutral pill at 4.5:1 in the %s theme, on %s",
    (theme, surface) => {
      render(
        <div data-theme={theme} className="text-foreground">
          <div className={`${SURFACES[surface]} p-4`} data-testid="surface">
            <Badge variant="secondary">Draft</Badge>
            <Badge>Solid</Badge>
            <Badge tone="neutral">Archived</Badge>
          </div>
        </div>,
      );
      const behind = effectiveBackground(screen.getByTestId("surface"));
      for (const text of ["Draft", "Solid", "Archived"]) {
        const badge = screen.getByText(text);
        expect(textContrast(badge), `${text} text`).toBeGreaterThanOrEqual(4.5);
        // Quiet: a faint wash over the surface, with no hue of its own.
        const pill = effectiveBackground(badge);
        const [r, g, b] = pill.match(/\d+/g)!.map(Number) as [number, number, number];
        expect(Math.max(r, g, b) - Math.min(r, g, b), `${text} is neutral`).toBeLessThanOrEqual(2);
        const lift = contrast(pill, behind);
        expect(lift, `${text} pill against the surface`).toBeGreaterThan(1);
        expect(lift, `${text} pill against the surface`).toBeLessThan(1.5);
      }
    },
  );

  // The reported case: an app themed with createTheme() on a mid / dark root.
  // `--accent` stayed the pale brand shade under mid's near-white foreground.
  test.each(THEMES)(
    "secondary stays neutral and readable under createTheme() with data-theme=%s on the root",
    (theme) => {
      removeTheme = applyTheme({ primary: "#924ff7", secondary: "#737373" });
      root.dataset.theme = theme;
      render(
        <div className="bg-background p-4 text-foreground">
          <Badge variant="secondary">Draft</Badge>
        </div>,
      );
      const badge = screen.getByText("Draft");
      expect(textContrast(badge)).toBeGreaterThanOrEqual(4.5);
      const [r, g, b] = effectiveBackground(badge).match(/\d+/g)!.map(Number) as [
        number,
        number,
        number,
      ];
      expect(Math.max(r, g, b) - Math.min(r, g, b)).toBeLessThanOrEqual(2);
    },
  );

  test.each(THEMES)("every other variant is at 4.5:1 in the %s theme", (theme) => {
    render(
      <div data-theme={theme} className="text-foreground">
        {SURFACE_NAMES.map((surface) => (
          <div key={surface} className={`${SURFACES[surface]} p-4`}>
            {(["outline", "dot", "brand", "success", "warning", "destructive"] as const).map(
              (variant) => (
                <Badge key={variant} variant={variant} data-testid="badge">
                  {variant} on {surface}
                </Badge>
              ),
            )}
            {(["info", "attention"] as const).map((tone) => (
              <Badge key={tone} tone={tone} data-testid="badge">
                {tone} on {surface}
              </Badge>
            ))}
          </div>
        ))}
      </div>,
    );
    const badges = screen.getAllByTestId("badge");
    expect(badges).toHaveLength(SURFACE_NAMES.length * 8);
    for (const badge of badges) {
      expect(textContrast(badge), badge.textContent).toBeGreaterThanOrEqual(4.5);
    }
  });
});
