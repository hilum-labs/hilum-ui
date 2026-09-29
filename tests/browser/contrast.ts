/**
 * WCAG contrast helpers for the browser suite, measured on real computed
 * colours (any CSS colour syntax, alpha composited like the browser does).
 */

/** Paint `colors` bottom-up over white on a 1×1 canvas and read the sRGB pixel. */
export function composite(colors: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1, 1);
  for (const color of colors) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
  }
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** The colour actually behind `el`: every ancestor background composited. */
export function effectiveBackground(el: Element): string {
  const layers: string[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    layers.unshift(getComputedStyle(node).backgroundColor);
  }
  return composite(layers);
}

function luminance(color: string) {
  const [r, g, b] = composite([color])
    .match(/\d+/g)!
    .map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Every text node's element in `root` that renders visible text. */
export function textElements(root: Element): HTMLElement[] {
  const out = new Set<HTMLElement>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (el && node.textContent?.trim() && el.checkVisibility()) out.add(el);
  }
  return [...out];
}

/** Contrast of `el`'s text colour (alpha composited) against what's behind it. */
export function textContrast(el: Element, color = getComputedStyle(el).color): number {
  const background = effectiveBackground(el);
  return contrast(composite([background, color]), background);
}
