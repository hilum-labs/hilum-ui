/**
 * Real-browser test suite (Vitest Browser Mode + Playwright/Chromium, headless).
 *
 *   pnpm test:browser
 *
 * Runs `**\/*.browser.test.tsx` only; the happy-dom suite (`vitest.config.ts`)
 * excludes these files. Tailwind v4 is compiled for real via @tailwindcss/vite
 * (see tests/browser/styles.css), so layout / computed-style assertions
 * (getBoundingClientRect, logical properties, RTL mirroring, sticky, Radix
 * collision flipping) reflect production CSS.
 *
 * Chromium: CI runs `pnpm exec playwright install --with-deps chromium`, so the
 * default Playwright-managed binary is used. Locally, if that exact revision is
 * not installed, set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, or we fall back to
 * the newest chromium(-headless-shell) found under ~/.cache/ms-playwright.
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import tailwind from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { chromium } from "playwright";
import type { BrowserCommand } from "vitest/node";
import { defineConfig } from "vitest/config";

const root = resolve(import.meta.dirname);

/* ── Built @hilum/ui: tests import packages/ui/dist/tokens.css (generated), and
 *   csp-page-load.browser.test.tsx loads dist/index.js (the published bundle,
 *   with sonner / vaul's CSS injection stripped). Rebuild after changing
 *   packages/ui when running that test locally. ── */
const builtFiles = ["tokens.css", "index.js"].map((file) =>
  resolve(root, "packages/ui/dist", file),
);
if (!builtFiles.every((file) => existsSync(file))) {
  console.log("[test:browser] packages/ui/dist incomplete — building @hilum/ui…");
  execSync("pnpm --filter @hilum/ui build", { cwd: root, stdio: "inherit" });
}

const uiDependencies = Object.keys(
  (
    JSON.parse(readFileSync(resolve(root, "packages/ui/package.json"), "utf8")) as {
      dependencies: Record<string, string>;
    }
  ).dependencies,
  // Loaded on demand by FileThumbnail, never by the tests.
).filter((name) => name !== "pdfjs-dist");

/* ── Chromium resolution ── */
function resolveChromium(): string | undefined {
  const fromEnv = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (fromEnv) return fromEnv;
  try {
    if (existsSync(chromium.executablePath())) return undefined; // Playwright default is installed
  } catch {
    /* fall through */
  }
  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH || join(homedir(), ".cache", "ms-playwright");
  if (!existsSync(cache)) return undefined;
  const candidates: Array<{ rev: number; path: string }> = [];
  for (const dir of readdirSync(cache)) {
    const shell = /^chromium_headless_shell-(\d+)$/.exec(dir);
    const full = /^chromium-(\d+)$/.exec(dir);
    const path = shell
      ? join(cache, dir, "chrome-headless-shell-linux64", "chrome-headless-shell")
      : full
        ? join(cache, dir, "chrome-linux64", "chrome")
        : undefined;
    const rev = Number((shell ?? full)?.[1]);
    // Prefer the headless shell at equal revisions (+0.5).
    if (path && existsSync(path)) candidates.push({ rev: rev + (shell ? 0.5 : 0), path });
  }
  candidates.sort((a, b) => b.rev - a.rev);
  const pick = candidates[0]?.path;
  if (pick) console.log(`[test:browser] Using local Chromium fallback: ${pick}`);
  return pick;
}
const executablePath = resolveChromium();

/* ── Custom commands (run in Node with the Playwright page) ── */

/**
 * Real mouse drag between two elements (by CSS selector inside the test
 * iframe), with intermediate moves so pointer sensors with an activation
 * distance (dnd-kit) engage.
 */
const pointerDrag: BrowserCommand<
  [source: string, target: string, options?: { steps?: number; release?: boolean }]
> = async (ctx, source, target, options = {}) => {
  const frame = await ctx.frame();
  const from = await frame.locator(source).boundingBox();
  const to = await frame.locator(target).boundingBox();
  if (!from || !to) throw new Error(`pointerDrag: element not found (${source} → ${target})`);
  const mouse = ctx.page.mouse;
  const sx = from.x + from.width / 2;
  const sy = from.y + from.height / 2;
  await mouse.move(sx, sy);
  await mouse.down();
  await mouse.move(sx, sy + 8, { steps: 4 });
  await mouse.move(to.x + to.width / 2, to.y + to.height / 2 + 4, {
    steps: options.steps ?? 12,
  });
  if (options.release !== false) await mouse.up();
};

export default defineConfig({
  plugins: [tailwind()],
  resolve: {
    alias: {
      "@hilum/ui": resolve(root, "packages/ui/src/index.ts"),
      "@hilum/app-shell": resolve(root, "packages/app-shell/src/index.ts"),
      "@hilum/designer": resolve(root, "packages/designer/src/index.ts"),
      "@hilum/designer-canvas": resolve(root, "packages/designer-canvas/src/index.ts"),
    },
  },
  optimizeDeps: {
    // Pre-bundle up front so the first test file doesn't trigger a reload.
    // @hilum/ui's own dependencies are listed too: csp-page-load imports the
    // built bundle dynamically, which the dependency scan can't see, and a
    // re-optimization mid-run would load a second copy of React.
    include: [
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@testing-library/react",
      "@testing-library/jest-dom/vitest",
      "lucide-react",
      "axe-core",
      ...uiDependencies,
    ],
  },
  test: {
    name: "browser",
    include: ["packages/**/*.browser.test.{ts,tsx}", "tests/browser/**/*.browser.test.{ts,tsx}"],
    setupFiles: ["./tests/browser/setup.ts"],
    globals: true,
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: executablePath ? { executablePath } : {},
        contextOptions: { reducedMotion: "reduce" },
      }),
      headless: true,
      screenshotFailures: false,
      viewport: { width: 1280, height: 800 },
      commands: { pointerDrag },
      instances: [{ browser: "chromium" }],
    },
  },
});
