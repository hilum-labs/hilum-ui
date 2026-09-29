import { describe, it, expect } from "vitest";
import { tokens } from "./tokens";
import { SURFACE_BG, SURFACE_SHADOW } from "../lib/surface-classes";
import { createTheme } from "./create-theme";

// WCAG 2 contrast helpers (#rrggbb colours only).
const channels = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const luminance = (hex: string) => {
  const [r, g, b] = channels(hex).map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const contrast = (a: string, b: string) => {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};
/** `color` at `alpha` composited over the opaque `base` (sRGB), as #rrggbb. */
const over = (color: string, alpha: number, base: string) => {
  const top = channels(color);
  return `#${channels(base)
    .map((c, i) => Math.round(top[i]! * alpha + c * (1 - alpha)))
    .map((c) => c.toString(16).padStart(2, "0"))
    .join("")}`;
};

describe("surface ladder tokens", () => {
  it.each(["light", "mid", "dark"] as const)(
    "%s defines every level surface-classes emits",
    (theme) => {
      const levels = Object.keys(SURFACE_BG).length;
      expect(Object.keys(SURFACE_SHADOW)).toHaveLength(levels);
      expect(tokens.surfaces[theme].bg).toHaveLength(levels);
      expect(tokens.surfaces[theme].shadow).toHaveLength(levels);
    },
  );

  it("level 1 matches the theme background", () => {
    for (const theme of ["light", "mid", "dark"] as const) {
      expect(tokens.surfaces[theme].bg[0]).toBe(tokens.semantic[theme].background);
    }
  });

  it("shadow weight grows monotonically with level", () => {
    const layers = tokens.surfaces.light.shadow.map((s) => s.split("px ").length);
    for (let i = 1; i < layers.length; i++) expect(layers[i]).toBeGreaterThan(layers[i - 1]!);
  });
});

describe("semantic tokens", () => {
  const themes = ["light", "mid", "dark"] as const;

  it("every theme defines the same semantic keys", () => {
    const keys = Object.keys(tokens.semantic.light).sort();
    for (const theme of themes) expect(Object.keys(tokens.semantic[theme]).sort()).toEqual(keys);
  });

  it("defines the interaction, edge and canvas tokens components rely on", () => {
    for (const theme of themes) {
      for (const key of ["hover", "active", "borderStrong", "canvas", "checkerA", "checkerB"]) {
        expect(tokens.semantic[theme]).toHaveProperty(key);
      }
    }
  });

  it("borders stay visible against their theme background", () => {
    expect(
      contrast(tokens.semantic.light.border, tokens.semantic.light.background),
    ).toBeGreaterThan(1.2);
    expect(
      contrast(tokens.semantic.dark.border, tokens.semantic.dark.background),
    ).toBeGreaterThanOrEqual(2);
    expect(contrast(tokens.semantic.mid.border, tokens.semantic.mid.card)).toBeGreaterThan(1.5);
    for (const theme of themes) {
      expect(tokens.semantic[theme].input).toBe(tokens.semantic[theme].border);
    }
  });
});

describe("active nav item contrast", () => {
  // Active SidebarMenuButton, SidebarMenuSubButton, AppNavTree and
  // AppMobileNav items: `text-brand-text` on `bg-brand-primary/10`
  // (`/15` on hover) over whatever surface they sit on (sidebar = card,
  // mobile tabs = background, sheets = card, hover = muted); sub-items have
  // no tint.
  const tints = [0, 0.1, 0.15];
  const surfaces = ["background", "card", "surface", "muted"] as const;

  it.each(["light", "mid", "dark"] as const)(
    "%s: brand text (and its icons) is ≥ 4.5:1 on the brand tint over every surface",
    (theme) => {
      const semantic = tokens.semantic[theme];
      for (const surface of surfaces) {
        for (const alpha of tints) {
          const background = over(tokens.brand.primary, alpha, semantic[surface]);
          expect(
            contrast(semantic.brandText, background),
            `${theme} brandText on ${alpha * 100}% tint over ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    },
  );

  it("brand.primary text on its own tint is what failed (3.9:1 in light)", () => {
    const light = tokens.semantic.light;
    expect(
      contrast(tokens.brand.primary, over(tokens.brand.primary, 0.1, light.card)),
    ).toBeLessThan(4.5);
  });

  // createTheme() brands: the Hilum default, the docs example, and hues that
  // are hard to read on their own tint (light yellow / lime, pure black).
  const brands = [
    "#c100f1",
    "#0066ff",
    "#ff9900",
    "#cdea19",
    "#fff5bf",
    "#dc2626",
    "#14b8a6",
    "#000000",
    "#ffffff",
  ];
  const themeBlock = (css: string, selector: string) => {
    const start = css.indexOf(`${selector} {`);
    return css.slice(start, css.indexOf("}", start));
  };

  const worstContrast = (text: string, primary: string, theme: "light" | "mid" | "dark") =>
    Math.min(
      ...surfaces.flatMap((surface) =>
        tints.map((alpha) => contrast(text, over(primary, alpha, tokens.semantic[theme][surface]))),
      ),
    );

  it.each(brands)("createTheme(%s) emits a --brand-text that passes in every theme", (primary) => {
    const { css, brandText } = createTheme({ primary, secondary: "#fff5bf" });
    expect(themeBlock(css, ":root")).toContain(`--brand-text: ${brandText.light};`);
    expect(themeBlock(css, '[data-theme="dark"]')).toContain(`--brand-text: ${brandText.dark};`);
    expect(themeBlock(css, '[data-theme="mid"]')).toContain(`--brand-text: ${brandText.mid};`);
    expect(worstContrast(brandText.light, primary, "light")).toBeGreaterThanOrEqual(4.5);
    expect(worstContrast(brandText.dark, primary, "dark")).toBeGreaterThanOrEqual(4.5);
    // On the mid gray a bright brand's tint can leave no colour at 4.5:1
    // (white fails on the tint, black on the darker card): the best one wins.
    const mid = worstContrast(brandText.mid, primary, "mid");
    const bestPlain = Math.max(
      worstContrast("#000000", primary, "mid"),
      worstContrast("#ffffff", primary, "mid"),
    );
    expect(mid >= 4.5 || mid >= bestPlain).toBe(true);
  });

  it("createTheme keeps brand text as close to the brand as contrast allows", () => {
    // Already readable on its tint: dark blue keeps its own shade in light mode.
    expect(createTheme({ primary: "#1d4ed8", secondary: "#fff5bf" }).brandText.light).toBe(
      "#1d4ed8",
    );
    // The Hilum purple steps one shade darker in light mode, lighter in dark.
    const hilum = createTheme({ primary: "#c100f1", secondary: "#fff5bf" });
    expect(hilum.brandText.light).toBe(hilum.palette.primary["600"]);
    expect(hilum.brandText.dark).toBe(hilum.palette.primary["300"]);
  });
});

describe("density tokens", () => {
  it("compact tier matches the editor-chrome spec", () => {
    expect(tokens.density.compact).toMatchObject({
      controlHeight: "24px",
      rowHeight: "28px",
      text: "12px",
      label: "11px",
      menuItemHeight: "28px",
      menuText: "13px",
      paddingX: "8px",
      field: "color-mix(in srgb, var(--foreground) 5%, transparent)",
      fieldHover: "color-mix(in srgb, var(--foreground) 8%, transparent)",
      divider: "color-mix(in srgb, var(--foreground) 8%, transparent)",
    });
    expect(Object.keys(tokens.density.compact).sort()).toEqual(
      Object.keys(tokens.density.default).sort(),
    );
  });

  it("default tier maps the field surfaces to the plain background and border", () => {
    expect(tokens.density.default).toMatchObject({
      field: "var(--background)",
      divider: "var(--border)",
    });
  });
});
