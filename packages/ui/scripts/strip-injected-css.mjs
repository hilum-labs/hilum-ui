// strip-injected-css.mjs — bundle sonner and vaul without their runtime <style>.
//
// sonner (toasts) and vaul (drawers) insert their CSS with a <style> element
// as soon as they are imported (`__insertCSS("…")` at module level; neither
// has an opt-out). Under a strict Content-Security-Policy (`style-src 'self'`)
// the browser blocks that tag and logs a violation on every page load.
//
// @hilum/ui therefore bundles both packages into its dist (tsup `noExternal`)
// and this esbuild plugin removes the injection while bundling. The same CSS
// ships statically in dist/tokens.css (scripts/build-tokens.mjs reads it from
// the same `__insertCSS("…")` call), so toasts and drawers look the same with
// or without a CSP.
//
// If a new sonner / vaul version changes how it injects CSS, the build fails
// here instead of silently shipping a <style> again (and a unit test checks
// the installed versions).

import { readFile } from "node:fs/promises";

/** Packages whose module-level CSS injection is stripped from the bundle. */
export const INJECTING_PACKAGES = ["sonner", "vaul"];

const INSERT_FUNCTION = /function __insertCSS\(code\) \{[\s\S]*?\n\}\n/;
const INSERT_CALL = /__insertCSS\(("(?:[^"\\]|\\.)*")\);?/;
// Module-level directive; esbuild drops it anyway (with a warning) when bundling.
const USE_CLIENT = /^(['"])use client\1;?[ \t]*\r?\n/;

/**
 * Remove `name`'s runtime CSS injection from its ESM build. Throws when the
 * expected `__insertCSS` definition or call isn't there.
 * @param {string} code
 * @param {string} name
 */
export function stripInjectedCss(code, name) {
  if (!INSERT_FUNCTION.test(code) || !INSERT_CALL.test(code)) {
    throw new Error(
      `[strip-injected-css] ${name}: no __insertCSS(…) definition and call found. ` +
        "Check how this version injects its CSS before bundling it.",
    );
  }
  const stripped = code
    .replace(USE_CLIENT, "")
    .replace(INSERT_FUNCTION, "")
    .replace(INSERT_CALL, "");
  if (/__insertCSS|createElement\(['"]style['"]\)/.test(stripped)) {
    throw new Error(`[strip-injected-css] ${name}: CSS injection left after stripping.`);
  }
  return stripped;
}

const MODULE_PATH = new RegExp(
  `[\\\\/]node_modules[\\\\/](${INJECTING_PACKAGES.join("|")})[\\\\/]dist[\\\\/]index\\.m?js$`,
);

/** esbuild plugin (tsup `esbuildPlugins`) applying `stripInjectedCss`. */
export function stripInjectedCssPlugin() {
  return {
    name: "hilum-strip-injected-css",
    /** @param {import("esbuild").PluginBuild} build */
    setup(build) {
      const seen = new Set();
      build.onLoad({ filter: MODULE_PATH }, async (args) => {
        const name = MODULE_PATH.exec(args.path)[1];
        seen.add(name);
        const code = await readFile(args.path, "utf8");
        return { contents: stripInjectedCss(code, name), loader: "js" };
      });
      build.onEnd((result) => {
        // Only the component bundle imports them; other entries may not.
        if (result.errors.length > 0 || seen.size === 0) return;
        const missing = INJECTING_PACKAGES.filter((name) => !seen.has(name));
        if (missing.length > 0) {
          throw new Error(
            `[strip-injected-css] not bundled: ${missing.join(", ")} (check tsup noExternal).`,
          );
        }
      });
    },
  };
}
