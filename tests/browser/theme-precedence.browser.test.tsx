/**
 * An explicit theme beats the OS default. tokens.css applies the dark values
 * under `prefers-color-scheme: dark` to `:root:not([data-theme="light"])`,
 * which out-ranked `[data-theme="mid"]`, so a mid root under a dark OS got
 * the dark palette. And no rule gave a `data-theme="light"` subtree the light
 * values, so it stayed dark inside a dark page.
 */
import { render, screen } from "@testing-library/react";
import { commands } from "vitest/browser";
import { tokens } from "../../packages/ui/src/tokens/tokens";

const root = document.documentElement;
const background = (el: Element) => getComputedStyle(el).getPropertyValue("--background").trim();
const colorScheme = (el: Element) => getComputedStyle(el).colorScheme;

afterEach(async () => {
  delete root.dataset.theme;
  await commands.emulateColorScheme(null);
});

describe("explicit data-theme beats prefers-color-scheme (real browser)", () => {
  test("OS dark with no data-theme follows the OS", async () => {
    await commands.emulateColorScheme("dark");
    expect(background(root)).toBe(tokens.semantic.dark.background);
    expect(colorScheme(root)).toBe("dark");
  });

  test.each(["light", "mid", "dark"] as const)(
    'OS dark + data-theme="%s" on the root uses its values',
    async (theme) => {
      await commands.emulateColorScheme("dark");
      root.dataset.theme = theme;
      expect(background(root)).toBe(tokens.semantic[theme].background);
      expect(getComputedStyle(root).getPropertyValue("--muted-foreground").trim()).toBe(
        tokens.semantic[theme].mutedForeground,
      );
    },
  );

  test.each(["light", "mid", "dark"] as const)(
    'OS light + data-theme="%s" on the root uses its values',
    async (theme) => {
      await commands.emulateColorScheme("light");
      root.dataset.theme = theme;
      expect(background(root)).toBe(tokens.semantic[theme].background);
    },
  );

  test("mid's colour-scheme is the same under a light and a dark OS", async () => {
    root.dataset.theme = "mid";
    await commands.emulateColorScheme("light");
    const underLight = colorScheme(root);
    await commands.emulateColorScheme("dark");
    expect(colorScheme(root)).toBe(underLight);
  });

  test.each(["light", "mid", "dark"] as const)(
    'a data-theme="%s" subtree gets its own values under either OS scheme',
    async (theme) => {
      render(<div data-theme={theme} data-testid="island" />);
      for (const scheme of ["light", "dark"] as const) {
        await commands.emulateColorScheme(scheme);
        expect(background(screen.getByTestId("island")), scheme).toBe(
          tokens.semantic[theme].background,
        );
      }
    },
  );
});
