// Custom commands registered in vitest.browser.config.ts (run in Node via Playwright).
import "@vitest/browser/providers/playwright";

declare module "@vitest/browser/context" {
  interface BrowserCommands {
    /** Real mouse drag between two elements (CSS selectors inside the test iframe). */
    pointerDrag: (
      source: string,
      target: string,
      options?: { steps?: number; release?: boolean },
    ) => Promise<void>;
  }
}
