import { describe, it, expect } from "vitest";
import { tokens } from "./tokens";
import { SURFACE_BG, SURFACE_SHADOW } from "../lib/surface-classes";

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

  // WCAG relative-luminance contrast between two #rrggbb colours.
  const luminance = (hex: string) => {
    const channel = (i: number) => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const [r, g, b] = [channel(1), channel(3), channel(5)];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (a: string, b: string) => {
    const la = luminance(a);
    const lb = luminance(b);
    const [hi, lo] = la >= lb ? [la, lb] : [lb, la];
    return (hi + 0.05) / (lo + 0.05);
  };

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
    });
    expect(Object.keys(tokens.density.compact).sort()).toEqual(
      Object.keys(tokens.density.default).sort(),
    );
  });
});
