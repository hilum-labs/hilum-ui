/**
 * axe-core helper for Vitest + happy-dom.
 *
 * Usage:
 *   import { axe } from "../axe";            // registers the matcher on import
 *   const { container } = render(<Button>Save</Button>);
 *   expect(await axe(container)).toHaveNoAxeViolations();
 *
 * happy-dom has no layout engine and no real CSS cascade, so rules that depend
 * on rendered geometry or computed colours produce false positives/negatives.
 * Those are disabled below; cover them in a real browser (Playwright + axe)
 * instead. Page-level rules (landmarks, <title>, lang) are disabled because we
 * audit isolated component fragments, not whole documents.
 */
import axeCore from "axe-core";
import type { AxeResults, ImpactValue, Result, RunOptions } from "axe-core";
import { expect } from "vitest";

/** Rules that cannot be evaluated meaningfully in happy-dom or on fragments. */
export const HAPPY_DOM_DISABLED_RULES = [
  // Need computed colours / layout.
  "color-contrast",
  "color-contrast-enhanced",
  "link-in-text-block",
  "scrollable-region-focusable",
  "target-size",
  // Page-level rules; components are rendered as fragments.
  "region",
  "landmark-one-main",
  "page-has-heading-one",
  "document-title",
  "html-has-lang",
  "bypass",
] as const;

/**
 * Nodes excluded from every audit:
 * - Radix focus guards: invisible `tabindex=0 aria-hidden` spans that trap
 *   focus inside modal layers (a known axe `aria-hidden-focus` false positive).
 * - Nodes hidden by Radix's `hideOthers` while a modal layer is open (marked
 *   `data-aria-hidden`); they are inert until the layer closes and are covered
 *   by the closed-state tests.
 */
export const DEFAULT_EXCLUDE = ["[data-radix-focus-guard]", '[data-aria-hidden="true"]'] as const;

const DEFAULT_OPTIONS: RunOptions = {
  runOnly: {
    type: "tag",
    values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
  },
  rules: Object.fromEntries(HAPPY_DOM_DISABLED_RULES.map((id) => [id, { enabled: false }])),
  resultTypes: ["violations"],
};

export interface AxeOptions extends RunOptions {
  /** Extra rule ids to disable for this call only. */
  disableRules?: string[];
}

/**
 * Run axe against an element (defaults to `document.body`, which includes
 * Radix portals). Returns the raw axe results for `toHaveNoAxeViolations`.
 */
export async function axe(
  context: Element | Document = document.body,
  options: AxeOptions = {},
): Promise<AxeResults> {
  const { disableRules = [], rules, ...rest } = options;
  const target = {
    include: [context],
    exclude: DEFAULT_EXCLUDE.map((selector) => [selector]),
  } as unknown as axeCore.ElementContext;
  return axeCore.run(target, {
    ...DEFAULT_OPTIONS,
    ...rest,
    rules: {
      ...DEFAULT_OPTIONS.rules,
      ...Object.fromEntries(disableRules.map((id) => [id, { enabled: false }])),
      ...rules,
    },
  });
}

function formatViolation(violation: Result): string {
  const impact: ImpactValue | "unknown" = violation.impact ?? "unknown";
  const nodes = violation.nodes
    .slice(0, 5)
    .map(
      (node) =>
        `    - ${node.target.join(" ")}\n      ${node.failureSummary?.replace(/\n/g, "\n      ") ?? ""}`,
    )
    .join("\n");
  const more = violation.nodes.length > 5 ? `\n    …and ${violation.nodes.length - 5} more` : "";
  return `  [${impact}] ${violation.id}: ${violation.help}\n    ${violation.helpUrl}\n${nodes}${more}`;
}

expect.extend({
  toHaveNoAxeViolations(received: AxeResults) {
    if (!received || !Array.isArray(received.violations)) {
      return {
        pass: false,
        message: () =>
          "toHaveNoAxeViolations expects the result of `await axe(container)` from tests/axe.ts",
      };
    }
    const { violations } = received;
    return {
      pass: violations.length === 0,
      message: () =>
        violations.length === 0
          ? "Expected axe violations, but found none"
          : `Expected no axe violations, found ${violations.length}:\n${violations.map(formatViolation).join("\n")}`,
    };
  },
});

interface AxeMatchers<R = unknown> {
  toHaveNoAxeViolations(): R;
}

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends AxeMatchers<T> {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
