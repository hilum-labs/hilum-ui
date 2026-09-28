import "@testing-library/jest-dom/vitest";
import "./styles.css";

// Browser Mode drives real (async) input via Playwright, so React updates land
// outside act(); opt out of act() warnings like a real app. RTL re-enables the
// flag in its own beforeAll, so reset it per test.
beforeEach(() => {
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;
});
