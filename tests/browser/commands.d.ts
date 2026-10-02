// Custom commands registered in vitest.browser.config.ts (run in Node via Playwright).
import "@vitest/browser-playwright";

declare module "vitest/browser" {
  interface BrowserCommands {
    /** Real mouse drag between two elements (CSS selectors inside the test iframe). */
    pointerDrag: (
      source: string,
      target: string,
      options?: { steps?: number; release?: boolean },
    ) => Promise<void>;
    /**
     * Press and hold the mouse button on an element (CSS selector inside the
     * test iframe) so `:active` applies; `null` releases it.
     */
    pointerHold: (selector: string | null) => Promise<void>;
    /** Emulate the OS colour scheme (`prefers-color-scheme`); `null` resets it. */
    emulateColorScheme: (scheme: "light" | "dark" | null) => Promise<void>;
  }
}
