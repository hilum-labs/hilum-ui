/**
 * Destructive text meets WCAG AA with the real tokens.css, in every theme.
 * `--destructive` as a text colour was 1.6:1 on the mid page (2.1:1 on mid
 * cards) and 4.1:1 on its own 10% tint in light mode: the destructive Button,
 * destructive menu items and Field errors now use `--destructive-text`. The
 * label on a solid destructive fill (ConfirmDialog's confirm button) was
 * 3.8:1 in mid and dark, where `--destructive` was red-500.
 */
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import {
  Button,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Field,
  Input,
} from "@hilum/ui";
import { AppNotificationMenu } from "@hilum/app-shell";
import { composite, contrast, effectiveBackground, textContrast } from "./contrast";

const THEMES = ["light", "mid", "dark"] as const;
// Literal class names so Tailwind generates them. surface-5 is what dialogs
// sit on, surface-8 the top of the elevation ladder.
const SURFACES = {
  background: "bg-background",
  card: "bg-card",
  surface: "bg-surface",
  muted: "bg-muted",
  "surface-5": "bg-surface-5",
  "surface-8": "bg-surface-8",
} as const;
const SURFACE_NAMES = Object.keys(SURFACES) as (keyof typeof SURFACES)[];

const cases = THEMES.flatMap((theme) => SURFACE_NAMES.map((surface) => [theme, surface] as const));

/**
 * A Button's label against its fill. The fill is the button's `::before`
 * (a destructive tint), composited over whatever is behind the button.
 */
function buttonLabelContrast(button: HTMLElement) {
  const behind = effectiveBackground(button);
  const fill = composite([behind, getComputedStyle(button, "::before").backgroundColor]);
  expect(fill, "the tint is painted").not.toBe(behind);
  return contrast(composite([fill, getComputedStyle(button).color]), fill);
}

describe("destructive text contrast (real browser)", () => {
  const root = document.documentElement;

  afterEach(() => {
    delete root.dataset.theme;
  });

  test.each(cases)(
    "%s theme, on %s: the destructive Button and a Field error are at 4.5:1",
    async (theme, surface) => {
      render(
        <div data-theme={theme} className="text-foreground">
          <div className={`${SURFACES[surface]} flex w-96 flex-col gap-4 p-4`}>
            <Button variant="destructive">Delete product</Button>
            <Button variant="destructive" active>
              Deleting
            </Button>
            <Field label="Email" error="Enter an email address" required>
              <Input />
            </Field>
          </div>
        </div>,
      );

      const button = screen.getByRole("button", { name: "Delete product" });
      expect(buttonLabelContrast(button), "label on the 10% tint").toBeGreaterThanOrEqual(4.5);
      await userEvent.hover(button);
      expect(buttonLabelContrast(button), "label on the hover tint").toBeGreaterThanOrEqual(4.5);
      const pressed = screen.getByRole("button", { name: "Deleting" });
      expect(buttonLabelContrast(pressed), "label on the pressed tint").toBeGreaterThanOrEqual(4.5);

      const error = screen.getByRole("alert");
      expect(error).toHaveTextContent("Enter an email address");
      expect(textContrast(error), "Field error").toBeGreaterThanOrEqual(4.5);
      expect(textContrast(screen.getByText("*")), "required mark").toBeGreaterThanOrEqual(4.5);
    },
  );

  // Menus and dialogs render in a portal: the theme sits on the root.
  test.each(THEMES)("%s theme: a destructive DropdownMenuItem, at rest and focused", (theme) => {
    root.dataset.theme = theme;
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Rename</DropdownMenuItem>
          <DropdownMenuItem destructive>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const item = screen.getByRole("menuitem", { name: "Delete" });
    const resting = effectiveBackground(item);
    expect(textContrast(item), "at rest").toBeGreaterThanOrEqual(4.5);
    // Destructive, not the regular menu text colour.
    expect(getComputedStyle(item).color).not.toBe(
      getComputedStyle(screen.getByRole("menuitem", { name: "Rename" })).color,
    );

    item.focus();
    expect(item).toHaveFocus();
    expect(effectiveBackground(item), "the focus tint is painted").not.toBe(resting);
    expect(textContrast(item), "focused, on the tint").toBeGreaterThanOrEqual(4.5);
  });

  test.each(THEMES)("%s theme: the label on a solid destructive fill", (theme) => {
    root.dataset.theme = theme;
    render(
      <>
        <ConfirmDialog
          open
          destructive
          title="Delete product?"
          description="This can't be undone."
          confirmLabel="Delete product"
          onConfirm={() => {}}
        />
        <AppNotificationMenu items={[{ title: "Export ready" }]} />
      </>,
    );
    const confirm = screen.getByRole("button", { name: "Delete product" });
    expect(textContrast(confirm), "ConfirmDialog confirm").toBeGreaterThanOrEqual(4.5);
    // The unread count on the notification bell (10px bold on the fill).
    const count = screen.getByLabelText("1 unread notifications", { selector: "span" });
    expect(textContrast(count), "unread count").toBeGreaterThanOrEqual(4.5);
  });
});
