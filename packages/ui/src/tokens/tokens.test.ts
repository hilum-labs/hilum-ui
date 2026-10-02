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
    expect(themeBlock(css, '[data-theme="light"]')).toContain(`--brand-text: ${brandText.light};`);
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

  it("createTheme's OS-dark rule leaves explicit light and mid roots alone", () => {
    const { css } = createTheme({ primary: "#0066ff", secondary: "#fff5bf" });
    expect(css).toContain(':root:not([data-theme="light"], [data-theme="mid"]) {');
    expect(css).toMatch(/:root,\s*\[data-theme="light"\] \{/);
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

describe("destructive text contrast", () => {
  // `text-destructive-text`: the destructive Button (on `bg-destructive/10`,
  // hover `/15`, pressed `/20`), destructive menu items, Field / Form errors
  // and error icons, over whatever surface they sit on (page, cards, and the
  // raised levels popovers and dialogs use).
  const themes = ["light", "mid", "dark"] as const;
  const tints = [0, 0.1, 0.15, 0.2];
  const surfacesOf = (theme: (typeof themes)[number]) => {
    const { background, card, surface, muted } = tokens.semantic[theme];
    return [background, card, surface, muted, ...tokens.surfaces[theme].bg];
  };
  const worstContrast = (theme: (typeof themes)[number], text: string) =>
    Math.min(
      ...surfacesOf(theme).flatMap((surface) =>
        tints.map((alpha) =>
          contrast(text, over(tokens.semantic[theme].destructive, alpha, surface)),
        ),
      ),
    );

  it.each(themes)(
    "%s: destructive text is ≥ 4.5:1 on every surface and on the destructive tint",
    (theme) => {
      const semantic = tokens.semantic[theme];
      for (const surface of surfacesOf(theme)) {
        for (const alpha of tints) {
          expect(
            contrast(semantic.destructiveText, over(semantic.destructive, alpha, surface)),
            `${theme} destructiveText on ${alpha * 100}% tint over ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    },
  );

  it("the destructive fill as text is what failed (1.2:1 on the mid page)", () => {
    for (const theme of themes) {
      expect(worstContrast(theme, tokens.semantic[theme].destructive), theme).toBeLessThan(4.5);
    }
    // 4.7.3 used red-500 (#ef4444) in mid and dark: 1.6:1 on the mid page.
    expect(contrast("#ef4444", tokens.semantic.mid.background)).toBeLessThan(2);
    expect(contrast("#ef4444", tokens.semantic.mid.card)).toBeLessThan(2.5);
  });

  it.each(themes)("%s: the label on a solid destructive fill is ≥ 4.5:1", (theme) => {
    const { destructive, destructiveForeground } = tokens.semantic[theme];
    expect(contrast(destructiveForeground, destructive)).toBeGreaterThanOrEqual(4.5);
    // The fill mid and dark used before (red-500) left white at 3.8:1.
    expect(contrast(destructiveForeground, "#ef4444")).toBeLessThan(4.5);
  });
});

describe("solid fill contrast", () => {
  // Solid buttons: the `brand` Button, AlertDialogAction (`bg-primary
  // text-primary-foreground`) and ConfirmDialog's destructive confirm
  // (`bg-destructive text-destructive-foreground`). Hover and pressed are
  // `bg-*-hover` / `bg-*-active`: the fill with `fillStates` percent of a
  // shade mixed in (color-mix in srgb, which is what `over` computes).
  const themes = ["light", "mid", "dark"] as const;
  const states = [0, tokens.fillStates.hover, tokens.fillStates.active];
  const surfacesOf = (theme: (typeof themes)[number]) => {
    const { background, card, surface, muted } = tokens.semantic[theme];
    return [background, card, surface, muted, ...tokens.surfaces[theme].bg];
  };
  /** Lowest label contrast over the rest, hover and pressed fills. */
  const worstLabel = (label: string, fill: string, shade: string) =>
    Math.min(...states.map((share) => contrast(label, over(shade, share / 100, fill))));

  it.each(themes)("%s: the brand label is ≥ 4.5:1 at rest, hovered and pressed", (theme) => {
    const { primary, primaryForeground, primaryShade } = tokens.semantic[theme];
    expect(worstLabel(primaryForeground, primary, primaryShade)).toBeGreaterThanOrEqual(4.5);
    // Each state moves the fill further from the label.
    const [rest, hover, active] = states.map((share) =>
      contrast(primaryForeground, over(primaryShade, share / 100, primary)),
    );
    expect(hover).toBeGreaterThan(rest!);
    expect(active).toBeGreaterThan(hover!);
  });

  it.each(themes)("%s: the destructive label is ≥ 4.5:1 at rest, hovered and pressed", (theme) => {
    const { destructive, destructiveForeground } = tokens.semantic[theme];
    // build-tokens mixes the destructive fill toward black.
    expect(worstLabel(destructiveForeground, destructive, "#000000")).toBeGreaterThanOrEqual(4.5);
  });

  it("fading the fill is what failed in light (4.3:1 hovered, 3.8–3.9:1 pressed)", () => {
    const { background, primary, primaryForeground, destructive, destructiveForeground } =
      tokens.semantic.light;
    for (const alpha of [0.9, 0.8]) {
      expect(contrast(primaryForeground, over(primary, alpha, background))).toBeLessThan(4.5);
      expect(contrast(destructiveForeground, over(destructive, alpha, background))).toBeLessThan(
        4.5,
      );
    }
  });

  it("`text-background` on the brand is what failed (1.3:1 in mid, 3.9:1 in dark)", () => {
    expect(contrast(tokens.semantic.mid.background, tokens.semantic.mid.primary)).toBeLessThan(1.5);
    expect(contrast(tokens.semantic.dark.background, tokens.semantic.dark.primary)).toBeLessThan(
      4.5,
    );
  });

  // The neutral `primary` Button: `text-background` on `bg-foreground`, hover
  // `/90`, pressed `/80` (`/90` in mid), over whatever surface it sits on.
  it.each(themes)("%s: the neutral primary Button label is ≥ 4.5:1 in every state", (theme) => {
    const { background, foreground } = tokens.semantic[theme];
    const alphas = theme === "mid" ? [1, 0.9] : [1, 0.9, 0.8];
    for (const surface of surfacesOf(theme)) {
      for (const alpha of alphas) {
        expect(
          contrast(background, over(foreground, alpha, surface)),
          `${theme} at ${alpha * 100}% over ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("mid: the neutral fill at 80% is what failed (4.1–4.4:1)", () => {
    const { background, foreground } = tokens.semantic.mid;
    for (const surface of surfacesOf("mid")) {
      expect(contrast(background, over(foreground, 0.8, surface)), surface).toBeLessThan(4.5);
    }
  });

  // createTheme() brands: the Hilum default, Pappery's (#924ff7, where white
  // is 4.48:1 and taupe 3.8:1) and the rest of its picker, the docs example,
  // light brands that take a dark label, and the extremes.
  const brands = [
    "#c100f1",
    "#924ff7",
    "#0285ff",
    "#04b84c",
    "#ffc300",
    "#ff66ad",
    "#fb6a22",
    "#171717",
    "#0066ff",
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
  const selectors = {
    light: '[data-theme="light"]',
    mid: '[data-theme="mid"]',
    dark: '[data-theme="dark"]',
    osDark: ':root:not([data-theme="light"], [data-theme="mid"])',
  };

  it.each(brands)("createTheme(%s): the brand label passes in light, mid and dark", (primary) => {
    const theme = createTheme({ primary, secondary: "#fff5bf" });
    const { css, primaryForeground, primaryShade } = theme;
    expect(worstLabel(primaryForeground, primary, primaryShade)).toBeGreaterThanOrEqual(4.5);
    // Every theme block carries the same pair: a mid (or dark) subtree must
    // not fall back to the stock --primary / --primary-foreground.
    for (const selector of Object.values(selectors)) {
      const block = themeBlock(css, selector);
      expect(block, selector).toContain(`--primary: ${primary};`);
      expect(block, selector).toContain(`--primary-foreground: ${primaryForeground};`);
      expect(block, selector).toContain(`--primary-shade: ${primaryShade};`);
      expect(block, selector).toContain(`--ring: ${primary};`);
    }
  });

  it("createTheme picks white, taupe or black for the label", () => {
    const label = (primary: string) =>
      createTheme({ primary, secondary: "#fff5bf" }).primaryForeground;
    expect(label("#c100f1")).toBe("#ffffff");
    expect(label("#cdea19")).toBe("#26181a");
    // Neither white (4.48:1) nor taupe (3.8:1) reaches 4.5:1 on #924ff7.
    expect(contrast("#ffffff", "#924ff7")).toBeLessThan(4.5);
    expect(contrast("#26181a", "#924ff7")).toBeLessThan(4.5);
    expect(label("#924ff7")).toBe("#000000");
    expect(contrast("#000000", "#924ff7")).toBeGreaterThanOrEqual(4.5);
    // One step darker and white gets there (4.53:1): white wins when it passes.
    expect(label("#914ef7")).toBe("#ffffff");
  });

  it("createTheme's shade moves the fill away from its label", () => {
    const shade = (primary: string) => createTheme({ primary, secondary: "#fff5bf" }).primaryShade;
    expect(shade("#c100f1")).toBe("#000000");
    expect(shade("#924ff7")).toBe("#ffffff");
    expect(shade("#cdea19")).toBe("#ffffff");
  });
});

describe("invalid field border contrast", () => {
  // `controlInvalidClasses` / `controlInvalidWithinClasses`, Checkbox, Switch
  // and InputOTP draw the error edge with `--destructive-text`; a state
  // indicator needs 3:1 against the surface next to it (WCAG 1.4.11).
  const themes = ["light", "mid", "dark"] as const;
  const surfacesOf = (theme: (typeof themes)[number]) => {
    const { background, card, surface, muted } = tokens.semantic[theme];
    return [background, card, surface, muted, ...tokens.surfaces[theme].bg];
  };

  it.each(themes)("%s: the invalid border is ≥ 3:1 on every surface", (theme) => {
    for (const surface of surfacesOf(theme)) {
      expect(
        contrast(tokens.semantic[theme].destructiveText, surface),
        `${theme} on ${surface}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  it("the destructive fill as a border is what failed (1.2–1.9:1 in mid, 2.2:1 on dark surface-8)", () => {
    const worst = (theme: (typeof themes)[number]) =>
      Math.min(...surfacesOf(theme).map((s) => contrast(tokens.semantic[theme].destructive, s)));
    expect(Math.max(...surfacesOf("mid").map((s) => contrast("#dc2626", s)))).toBeLessThan(3);
    expect(worst("mid")).toBeLessThan(1.5);
    expect(worst("dark")).toBeLessThan(3);
  });
});

describe("text contrast on every surface", () => {
  const surfaces = ["background", "card", "surface", "muted"] as const;

  it.each(["light", "mid", "dark"] as const)(
    "%s: foreground and muted text are ≥ 4.5:1 on background, card, surface and muted",
    (theme) => {
      const semantic = tokens.semantic[theme];
      for (const surface of surfaces) {
        for (const text of ["foreground", "mutedForeground"] as const) {
          expect(
            contrast(semantic[text], semantic[surface]),
            `${theme} ${text} on ${surface}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    },
  );

  it("mid: muted text is ≥ 4.5:1 on every surface level (was 3.8:1 on the page)", () => {
    for (const level of tokens.surfaces.mid.bg) {
      expect(contrast(tokens.semantic.mid.mutedForeground, level), level).toBeGreaterThanOrEqual(
        4.5,
      );
    }
    expect(contrast(tokens.semantic.mid.mutedForeground, "#737373")).toBeLessThan(4.5);
  });

  it("dark: muted text is ≥ 4.5:1 on every surface level and on accent (was 4.1:1 on surface-8)", () => {
    const { mutedForeground, foreground, accent } = tokens.semantic.dark;
    for (const level of [...tokens.surfaces.dark.bg, accent]) {
      expect(contrast(mutedForeground, level), level).toBeGreaterThanOrEqual(4.5);
    }
    // ground-400, the value before, on the levels nested popovers and dialogs reach.
    expect(contrast("#a3a3a3", tokens.surfaces.dark.bg[7])).toBeLessThan(4.5);
    // Still clearly dimmer than the regular text.
    expect(contrast(foreground, mutedForeground)).toBeGreaterThanOrEqual(2);
  });

  it.each(["light", "mid", "dark"] as const)(
    "%s: muted text is ≥ 4.5:1 on every surface level",
    (theme) => {
      for (const level of tokens.surfaces[theme].bg) {
        expect(
          contrast(tokens.semantic[theme].mutedForeground, level),
          `${theme} ${level}`,
        ).toBeGreaterThanOrEqual(4.5);
      }
    },
  );

  it("mid: text stays ≥ 4.5:1 on its hover and active washes", () => {
    const { background, card, foreground, mutedForeground, hover, active } = tokens.semantic.mid;
    const alpha = (wash: string) => Number(wash.match(/[\d.]+\)$/)![0].slice(0, -1));
    const black = "#000000";
    for (const wash of [hover, active]) {
      expect(wash).toMatch(/^rgba\(0, 0, 0,/);
      for (const surface of [background, card]) {
        const washed = over(black, alpha(wash), surface);
        expect(contrast(foreground, washed)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(mutedForeground, washed)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("mid keeps its steps: canvas between the page and the cards", () => {
    const { background, canvas, card } = tokens.semantic.mid;
    expect(luminance(background)).toBeGreaterThan(luminance(canvas));
    expect(luminance(canvas)).toBeGreaterThan(luminance(card));
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
