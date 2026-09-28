import { render } from "@testing-library/react";
import { Calendar } from "@hilum/ui";

/**
 * Which way a navigation chevron *visually* points: the lucide base glyph
 * (chevron-left / chevron-right) times the sign of every horizontal mirror
 * applied by CSS (`scale` from Tailwind's -scale-x-100, or `transform`).
 */
function visualDirection(button: HTMLElement): "left" | "right" {
  const svg = button.querySelector("svg");
  if (!svg) throw new Error("no chevron svg");
  let sign = svg.classList.contains("lucide-chevron-left") ? -1 : 1;
  if (
    !svg.classList.contains("lucide-chevron-left") &&
    !svg.classList.contains("lucide-chevron-right")
  )
    throw new Error(`unexpected icon: ${svg.getAttribute("class")}`);
  const style = getComputedStyle(svg);
  const scaleX = style.scale === "none" ? 1 : parseFloat(style.scale.split(" ")[0]!);
  const matrix = new DOMMatrix(style.transform === "none" ? undefined : style.transform);
  sign *= Math.sign(scaleX) * Math.sign(matrix.a);
  return sign < 0 ? "left" : "right";
}

const FIXED_MONTH = new Date(2025, 5, 1);

type NavLayout = undefined | "after" | "around";
type DirCase = "ltr-default" | "ltr-prop" | "rtl-prop" | "rtl-inherited" | "ltr-prop-in-rtl";

const LAYOUTS: NavLayout[] = [undefined, "after", "around"];
const DIRS: DirCase[] = ["ltr-default", "ltr-prop", "rtl-prop", "rtl-inherited", "ltr-prop-in-rtl"];

function renderCase(navLayout: NavLayout, dirCase: DirCase) {
  const dirProp =
    dirCase === "ltr-prop" || dirCase === "ltr-prop-in-rtl"
      ? "ltr"
      : dirCase === "rtl-prop"
        ? "rtl"
        : undefined;
  const wrapperDir = dirCase === "rtl-inherited" || dirCase === "ltr-prop-in-rtl" ? "rtl" : "ltr";
  const utils = render(
    <div dir={wrapperDir} style={{ width: 320 }}>
      <Calendar
        defaultMonth={FIXED_MONTH}
        {...(navLayout ? { navLayout } : {})}
        {...(dirProp ? { dir: dirProp } : {})}
      />
    </div>,
  );
  const effectiveRtl = dirCase === "rtl-prop" || dirCase === "rtl-inherited";
  return { ...utils, effectiveRtl };
}

describe("Calendar navigation chevrons (real browser)", () => {
  for (const navLayout of LAYOUTS) {
    for (const dirCase of DIRS) {
      test(`navLayout=${navLayout ?? "default"} · ${dirCase}`, () => {
        const { container, effectiveRtl } = renderCase(navLayout, dirCase);
        const previous = container.querySelector<HTMLElement>('button[aria-label*="previous" i]')!;
        const next = container.querySelector<HTMLElement>('button[aria-label*="next" i]')!;
        expect(previous).toBeTruthy();
        expect(next).toBeTruthy();

        console.log(
          JSON.stringify({
            pc: previous.querySelector("svg")!.getAttribute("class"),
            ps: getComputedStyle(previous.querySelector("svg")!).scale,
            p: previous.getBoundingClientRect().left,
            n: next.getBoundingClientRect().left,
            r: container.querySelector("[data-slot=calendar]")!.getBoundingClientRect().left,
          }),
        );
        // "Previous" points toward the inline-start edge, "next" toward inline-end.
        expect(visualDirection(previous)).toBe(effectiveRtl ? "right" : "left");
        expect(visualDirection(next)).toBe(effectiveRtl ? "left" : "right");

        // And the buttons sit on the matching physical edges of the calendar.
        const p = previous.getBoundingClientRect();
        const n = next.getBoundingClientRect();
        if (effectiveRtl) expect(p.left).toBeGreaterThan(n.left);
        else expect(p.left).toBeLessThan(n.left);

        const root = container.querySelector<HTMLElement>('[data-slot="calendar"]')!;
        const r = root.getBoundingClientRect();
        for (const b of [p, n]) {
          expect(b.left).toBeGreaterThanOrEqual(r.left - 0.5);
          expect(b.right).toBeLessThanOrEqual(r.right + 0.5);
        }
      });
    }
  }
});
