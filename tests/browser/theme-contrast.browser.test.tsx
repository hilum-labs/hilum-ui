/**
 * Solid fills, muted text and invalid borders meet WCAG AA with the real
 * tokens.css, in light, mid and dark, with the stock brand and with a
 * `createTheme()` brand (#924ff7, Pappery's).
 *
 * - `AlertDialogAction` was `bg-brand-primary text-background`: 1.3:1 in the
 *   mid theme, 3.9:1 in dark.
 * - Solid brand and destructive fills faded on hover and press (`/90`,
 *   `/80`), which lightens them over a white page: 4.3:1 and 3.8–3.9:1.
 * - The neutral primary Button's pressed fill was 4.1–4.4:1 in mid.
 * - Dark `--muted-foreground` was 4.1:1 on surface-8 (a dialog in a dialog).
 * - The invalid border (`--destructive`) was 1.2–1.9:1 against mid surfaces
 *   and under 3:1 on raised dark ones.
 * - `createTheme('#924ff7')` gave the brand a taupe label in light (3.8:1), a
 *   white one in dark (4.48:1), and left a mid subtree on the stock purple.
 */
import { render, screen } from "@testing-library/react";
import { commands, userEvent } from "vitest/browser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Calendar,
  Card,
  CardDescription,
  Checkbox,
  Combobox,
  ConfirmDialog,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Field,
  Input,
  InputNumber,
} from "@hilum/ui";
import { applyTheme } from "../../packages/ui/src/tokens/create-theme";
import { tokens } from "../../packages/ui/src/tokens/tokens";
import { composite, contrast, effectiveBackground, textContrast } from "./contrast";

const THEMES = ["light", "mid", "dark"] as const;
type Theme = (typeof THEMES)[number];
const BRANDS = { stock: undefined, "createTheme(#924ff7)": "#924ff7" } as const;
type Brand = keyof typeof BRANDS;
const cases = THEMES.flatMap((theme) =>
  (Object.keys(BRANDS) as Brand[]).map((brand) => [theme, brand] as const),
);

// Literal class names so Tailwind generates them. Cards, menus and popovers
// are `bg-card`; a Dialog is surface-5 on the page, a Select in a Dialog
// surface-7, a Dialog in a Dialog surface-8.
const SURFACES = {
  background: "bg-background",
  card: "bg-card",
  surface: "bg-surface",
  muted: "bg-muted",
  "surface-1": "bg-surface-1",
  "surface-2": "bg-surface-2",
  "surface-3": "bg-surface-3",
  "surface-4": "bg-surface-4",
  "surface-5": "bg-surface-5",
  "surface-6": "bg-surface-6",
  "surface-7": "bg-surface-7",
  "surface-8": "bg-surface-8",
} as const;
type Surface = keyof typeof SURFACES;
const SURFACE_NAMES = Object.keys(SURFACES) as Surface[];
const CONTROL_SURFACES = ["background", "card", "surface-5", "surface-8"] as const;

const root = document.documentElement;
let removeTheme: (() => void) | undefined;

/** Theme on the root (dialogs render in a portal), brand through createTheme(). */
function setTheme(theme: Theme, brand: Brand) {
  root.dataset.theme = theme;
  const primary = BRANDS[brand];
  if (primary) removeTheme = applyTheme({ primary, secondary: "#737373" });
}

afterEach(async () => {
  await commands.pointerHold(null);
  delete root.dataset.theme;
  removeTheme?.();
  removeTheme = undefined;
});

/**
 * A solid control's label against its fill: the element's own background or,
 * for a Button, its `::before`.
 */
function solidLabelContrast(el: HTMLElement) {
  const fill = composite([
    effectiveBackground(el),
    getComputedStyle(el, "::before").backgroundColor,
  ]);
  expect(fill, "the fill is painted").not.toBe(effectiveBackground(el.parentElement!));
  return { fill, ratio: contrast(composite([fill, getComputedStyle(el).color]), fill) };
}

/** The label at rest, hovered and pressed (a real mouse-down): each ≥ 4.5:1. */
async function expectSolidStates(el: HTMLElement, selector: string, label: string) {
  const rest = solidLabelContrast(el);
  expect(rest.ratio, `${label} at rest`).toBeGreaterThanOrEqual(4.5);
  await userEvent.hover(el);
  const hover = solidLabelContrast(el);
  expect(hover.ratio, `${label} hovered`).toBeGreaterThanOrEqual(4.5);
  await commands.pointerHold(selector);
  const pressed = solidLabelContrast(el);
  expect(pressed.ratio, `${label} pressed`).toBeGreaterThanOrEqual(4.5);
  await commands.pointerHold(null);
  expect(hover.fill, `${label}: hover changes the fill`).not.toBe(rest.fill);
  return { rest, hover, pressed };
}

/** Hover and press move a brand / destructive fill away from its label. */
function expectStatesGainContrast(states: Awaited<ReturnType<typeof expectSolidStates>>) {
  expect(states.hover.ratio).toBeGreaterThan(states.rest.ratio);
  expect(states.pressed.ratio).toBeGreaterThan(states.hover.ratio);
}

describe("solid brand and destructive fills (real browser)", () => {
  test.each(cases)(
    "%s theme, %s brand: the AlertDialogAction label at rest, hovered and pressed",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Publish catalog?</AlertDialogTitle>
              <AlertDialogDescription>Customers see the changes right away.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Publish</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>,
      );
      expect(
        textContrast(screen.getByText("Customers see the changes right away.")),
        "description",
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        textContrast(screen.getByRole("button", { name: "Cancel" })),
        "cancel",
      ).toBeGreaterThanOrEqual(4.5);

      const action = screen.getByRole("button", { name: "Publish" });
      const states = await expectSolidStates(
        action,
        '[data-slot="alert-dialog-action"]',
        "AlertDialogAction",
      );
      expectStatesGainContrast(states);
      // The brand fill, not the page colour as the label.
      const primary = BRANDS[brand] ?? tokens.semantic[theme].primary;
      expect(states.rest.fill).toBe(composite([primary]));
    },
  );

  test.each(cases)(
    "%s theme, %s brand: the destructive ConfirmDialog confirm at rest, hovered and pressed",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <ConfirmDialog
          open
          destructive
          title="Delete product?"
          description="This can't be undone."
          confirmLabel="Delete product"
          onConfirm={() => {}}
        />,
      );
      const confirm = screen.getByRole("button", { name: "Delete product" });
      const states = await expectSolidStates(
        confirm,
        '[data-slot="alert-dialog-action"]',
        "ConfirmDialog confirm",
      );
      expectStatesGainContrast(states);
      expect(states.rest.fill).toBe(composite([tokens.semantic[theme].destructive]));
    },
  );

  test.each(cases)(
    "%s theme, %s brand: solid brand and primary Buttons at rest, hovered and pressed",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <div className="text-foreground">
          {CONTROL_SURFACES.map((surface) => (
            <div key={surface} className={`${SURFACES[surface]} flex gap-4 p-4`}>
              <Button variant="brand" data-testid={`brand-${surface}`}>
                Save
              </Button>
              <Button variant="brand" active data-testid={`brand-active-${surface}`}>
                Saving
              </Button>
              <Button data-testid={`primary-${surface}`}>Continue</Button>
              <Button active data-testid={`primary-active-${surface}`}>
                Continuing
              </Button>
            </div>
          ))}
        </div>,
      );
      for (const surface of CONTROL_SURFACES) {
        const on = `on ${surface}`;
        const brandStates = await expectSolidStates(
          screen.getByTestId(`brand-${surface}`),
          `[data-testid="brand-${surface}"]`,
          `brand Button ${on}`,
        );
        expectStatesGainContrast(brandStates);
        await expectSolidStates(
          screen.getByTestId(`primary-${surface}`),
          `[data-testid="primary-${surface}"]`,
          `primary Button ${on}`,
        );

        // `active` (a button driving an open menu): the pressed fill, also hovered.
        for (const name of ["brand-active", "primary-active"]) {
          const held = screen.getByTestId(`${name}-${surface}`);
          expect(solidLabelContrast(held).ratio, `${name} ${on}`).toBeGreaterThanOrEqual(4.5);
          await userEvent.hover(held);
          expect(solidLabelContrast(held).ratio, `${name} ${on}, hovered`).toBeGreaterThanOrEqual(
            4.5,
          );
        }
        expect(solidLabelContrast(screen.getByTestId(`brand-active-${surface}`)).fill).toBe(
          brandStates.pressed.fill,
        );
      }
    },
  );

  // createTheme() only gave a mid root the brand (through `:root`): a mid
  // subtree kept the stock purple fill and its white label.
  test("createTheme(#924ff7): a mid subtree in a light page gets the brand pair", async () => {
    setTheme("light", "createTheme(#924ff7)");
    render(
      <div data-theme="mid" className="bg-background p-4 text-foreground">
        <Button variant="brand" data-testid="nested">
          Save
        </Button>
      </div>,
    );
    const states = await expectSolidStates(
      screen.getByTestId("nested"),
      '[data-testid="nested"]',
      "brand Button in a mid subtree",
    );
    expect(states.rest.fill).toBe(composite(["#924ff7"]));
    expectStatesGainContrast(states);
  });

  test.each(cases)(
    "%s theme, %s brand: labels and marks on the brand fill",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <div className="bg-background p-4 text-foreground">
          <Checkbox checked aria-label="Accept terms" onCheckedChange={() => {}} />
          <Calendar mode="single" selected={new Date(2026, 5, 15)} month={new Date(2026, 5, 1)} />
          <Combobox
            aria-label="Assignee"
            value="ada"
            options={[
              { value: "ada", label: "Ada Lovelace", description: "Engineering", avatar: "AL" },
              { value: "alan", label: "Alan Turing", description: "Research", avatar: "AT" },
            ]}
          />
        </div>,
      );

      // The check mark is a graphic: 3:1 against the brand box.
      const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
      const mark = checkbox.querySelector("svg")!;
      expect(
        contrast(getComputedStyle(mark).color, effectiveBackground(checkbox)),
        "check mark",
      ).toBeGreaterThanOrEqual(3);

      const day = screen.getByRole("button", { name: /June 15/ });
      expect(textContrast(day), "selected day").toBeGreaterThanOrEqual(4.5);
      const resting = effectiveBackground(day);
      await userEvent.hover(day);
      expect(effectiveBackground(day), "the hover fill is painted").not.toBe(resting);
      expect(textContrast(day), "selected day, hovered").toBeGreaterThanOrEqual(4.5);

      await userEvent.click(screen.getByRole("combobox", { name: "Assignee" }));
      const option = await screen.findByRole("option", { name: /Ada Lovelace/ });
      expect(option).toHaveAttribute("aria-selected", "true");
      for (const text of ["Ada Lovelace", "Engineering", "AL"]) {
        const el = [...option.querySelectorAll<HTMLElement>("p, div")].find(
          (node) => node.textContent === text,
        )!;
        expect(textContrast(el), `selected option "${text}"`).toBeGreaterThanOrEqual(4.5);
      }
    },
  );
});

describe("muted text on the surfaces components use (real browser)", () => {
  test.each(THEMES)("%s theme: muted text is at 4.5:1 on every surface level", (theme) => {
    render(
      <div data-theme={theme}>
        {SURFACE_NAMES.map((surface) => (
          <div key={surface} className={`${SURFACES[surface]} p-2`}>
            <p className="text-muted-foreground">Muted on {surface}</p>
          </div>
        ))}
      </div>,
    );
    for (const surface of SURFACE_NAMES) {
      const text = screen.getByText(`Muted on ${surface}`);
      expect(textContrast(text), `${theme} ${surface}`).toBeGreaterThanOrEqual(4.5);
      // Muted: not the regular text colour.
      expect(getComputedStyle(text).color).not.toBe(getComputedStyle(root).color);
    }
  });

  test.each(cases)(
    "%s theme, %s brand: descriptions in a Card, a Dialog and a Dialog inside it",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <>
          <Card>
            <CardDescription>Updated two hours ago</CardDescription>
          </Card>
          <Dialog open>
            <DialogContent>
              <DialogTitle>Edit product</DialogTitle>
              <DialogDescription>Changes apply to every variant.</DialogDescription>
              <Dialog open>
                <DialogContent>
                  <DialogTitle>Discard changes?</DialogTitle>
                  <DialogDescription>Your edits will be lost.</DialogDescription>
                </DialogContent>
              </Dialog>
            </DialogContent>
          </Dialog>
        </>,
      );
      const nested = await screen.findByText("Your edits will be lost.");
      // The nested dialog sits on the top of the ladder.
      expect(effectiveBackground(nested)).toBe(composite([tokens.surfaces[theme].bg[7]!]));
      expect(textContrast(nested), "dialog in a dialog (surface-8)").toBeGreaterThanOrEqual(4.5);

      const outer = screen.getByText("Changes apply to every variant.");
      expect(effectiveBackground(outer)).toBe(composite([tokens.surfaces[theme].bg[4]!]));
      expect(textContrast(outer), "dialog (surface-5)").toBeGreaterThanOrEqual(4.5);

      expect(
        textContrast(screen.getByText("Updated two hours ago")),
        "card description",
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe("invalid field borders (real browser)", () => {
  /** An edge colour against the surface outside the control and the fill inside it. */
  function expectEdgeVisible(control: HTMLElement, edge: string, label: string) {
    const outside = effectiveBackground(control.parentElement!);
    const inside = effectiveBackground(control);
    expect(contrast(composite([outside, edge]), outside), `${label} vs surface`).toBeGreaterThan(3);
    expect(contrast(composite([inside, edge]), inside), `${label} vs fill`).toBeGreaterThan(3);
  }

  test.each(cases)(
    "%s theme, %s brand: invalid Input, InputNumber and Checkbox edges are at 3:1",
    async (theme, brand) => {
      setTheme(theme, brand);
      render(
        <div className="text-foreground">
          <div className="ring-2 ring-destructive/35" data-testid="halo" />
          {CONTROL_SURFACES.map((surface) => (
            <div key={surface} className={`${SURFACES[surface]} flex w-96 flex-col gap-4 p-4`}>
              <Field label={`Email ${surface}`} error="Enter an email address">
                <Input />
              </Field>
              <Field label={`Quantity ${surface}`} error="Enter a quantity">
                <InputNumber value={1} onChange={() => {}} />
              </Field>
              <Field label={`Valid ${surface}`}>
                <Input />
              </Field>
              <Checkbox aria-invalid aria-label={`Terms ${surface}`} />
            </div>
          ))}
        </div>,
      );
      const halo = getComputedStyle(screen.getByTestId("halo")).boxShadow;

      for (const surface of CONTROL_SURFACES) {
        const on = `on ${surface}`;
        const input = screen.getByRole("textbox", { name: `Email ${surface}` });
        expect(input).toHaveAttribute("aria-invalid", "true");
        const edge = getComputedStyle(input).borderTopColor;
        expectEdgeVisible(input, edge, `Input ${on}`);
        // An error edge, not the regular one.
        const valid = screen.getByRole("textbox", { name: `Valid ${surface}` });
        expect(edge).not.toBe(getComputedStyle(valid).borderTopColor);

        await userEvent.hover(input);
        expect(getComputedStyle(input).borderTopColor, `${on}, hovered`).toBe(edge);
        input.focus();
        expect(getComputedStyle(input).borderTopColor, `${on}, focused`).toBe(edge);
        // The focus halo stays destructive.
        expect(getComputedStyle(input).boxShadow, `${on}, halo`).toBe(halo);
        input.blur();

        const number = screen
          .getByRole("spinbutton", { name: `Quantity ${surface}` })
          .closest<HTMLElement>("[data-invalid]")!;
        expect(getComputedStyle(number).borderTopColor).toBe(edge);
        expectEdgeVisible(number, edge, `InputNumber ${on}`);

        const checkbox = screen.getByRole("checkbox", { name: `Terms ${surface}` });
        expect(getComputedStyle(checkbox).borderTopColor).toBe(edge);
        expect(getComputedStyle(checkbox).outlineColor).toBe(edge);
        expectEdgeVisible(checkbox, edge, `Checkbox ${on}`);
      }
    },
  );
});
