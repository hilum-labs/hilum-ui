/**
 * sonner and vaul are bundled into @hilum/ui with their import-time <style>
 * injection removed (packages/ui/scripts/strip-injected-css.mjs). Check the
 * installed versions still inject the way the stripper expects, so an upgrade
 * can't silently bring the <style> (and the CSP violation) back.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
  INJECTING_PACKAGES,
  stripInjectedCss,
} from "../../packages/ui/scripts/strip-injected-css.mjs";

const require = createRequire(resolve(import.meta.dirname, "../../packages/ui/package.json"));

function esmBuild(name: string) {
  const main = require.resolve(name);
  return readFileSync(resolve(dirname(main), "index.mjs"), "utf8");
}

describe("stripInjectedCss", () => {
  it.each(INJECTING_PACKAGES)("removes %s's runtime <style> and keeps the module", (name) => {
    const code = esmBuild(name);
    expect(code).toContain("__insertCSS(");
    const stripped = stripInjectedCss(code, name);
    expect(stripped).not.toMatch(/__insertCSS|createElement\(['"]style['"]\)/);
    expect(stripped).not.toMatch(/^['"]use client['"]/);
    // Only the injection went: the CSS string and the helper, not the module.
    const injected = /__insertCSS\("(?:[^"\\]|\\.)*"\)/.exec(code)![0];
    expect(code.length - stripped.length).toBeLessThan(injected.length + 600);
    expect(stripped).toMatch(/export\s*\{/);
  });

  it("fails loudly when the injection isn't where it expects", () => {
    expect(() => stripInjectedCss("export const x = 1;", "sonner")).toThrow(/no __insertCSS/);
  });
});
