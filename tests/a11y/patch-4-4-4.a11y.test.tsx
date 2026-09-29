/**
 * Accessibility smoke tests for the 4.4.4 fixes: FileDropzone is one button
 * (it was a focusable `role="button"` label around the focusable file input,
 * axe's nested-interactive) and Callout in every tone. Callout colour
 * contrast is checked in a real browser (callout-contrast.browser.test.tsx).
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Info } from "lucide-react";
import { axe } from "../axe";

import { FileDropzone } from "../../packages/ui/src/components/file-dropzone";
import { Callout } from "../../packages/ui/src/components/callout";

describe("a11y: 4.4.4", () => {
  it.each([
    ["empty", {}],
    ["with a description and selected files", { selectedFiles: [{ name: "a.csv", size: 10 }] }],
    ["multiple", { multiple: true, selectedFiles: [{ name: "a.csv", size: 10 }] }],
    ["loading", { loading: true }],
    ["disabled", { disabled: true }],
  ] as const)("FileDropzone %s", async (_, props) => {
    const { container } = render(
      <FileDropzone label="Upload images" description="PNG or JPG, up to 10 MB" {...props} />,
    );
    expect(await axe(container)).toHaveNoAxeViolations();
  });

  it.each(["default", "info", "success", "warning", "destructive"] as const)(
    "Callout %s",
    async (tone) => {
      const { container } = render(
        <Callout
          tone={tone}
          icon={<Info aria-hidden="true" />}
          title="Payouts are paused"
          description="Add a bank account to resume payouts."
          actions={<a href="#billing">Review</a>}
        />,
      );
      expect(await axe(container)).toHaveNoAxeViolations();
    },
  );
});
