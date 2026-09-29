/**
 * The <style> tags Radix still renders (see the ui README, "Strict
 * Content-Security-Policy") have fixed contents, so a policy can allow them by
 * hash instead of logging a violation. This pins the hashes the README lists
 * to the installed Radix / react-remove-scroll-bar versions, and checks that a
 * policy with them logs nothing when those components open.
 */
import { cleanup, render } from "@testing-library/react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@hilum/ui";

/** Keep in sync with packages/ui/README.md. */
const RADIX_STYLE_HASHES = {
  // Page scroll lock of modal layers, with overlay scrollbars (no width to compensate).
  scrollLock: "sha256-nzTgYzXYDNe6BAHiiI7NNlfK8n/auuOAhh2t92YvuXo=",
  selectViewport: "sha256-441zG27rExd4/il+NvIqyL8zFx5XmyNQtE381kSkUJk=",
  scrollAreaViewport: "sha256-vGQdhYJbTuF+M8iCn1IZCHpdkiICocWHDq4qnQF4Rjw=",
};

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 100));

function Components() {
  return (
    <>
      <Dialog open>
        <DialogContent>
          <DialogTitle>Edit</DialogTitle>
        </DialogContent>
      </Dialog>
      <Select open value="a">
        <SelectTrigger aria-label="Status" />
        <SelectContent>
          <SelectItem value="a">Active</SelectItem>
        </SelectContent>
      </Select>
      <ScrollArea className="h-10">
        <div className="h-40">Long</div>
      </ScrollArea>
    </>
  );
}

afterEach(() => cleanup());

describe("hashes for Radix's <style> tags (real browser)", () => {
  test("match what Radix renders", async () => {
    const before = new Set(document.querySelectorAll("style"));
    render(<Components />);
    await settle();
    const added = Array.from(document.querySelectorAll("style")).filter((el) => !before.has(el));
    const hashes = await Promise.all(added.map((el) => sha256(el.textContent ?? "")));
    // With overlay scrollbars (or no page scrollbar) there is no width to
    // compensate, so the scroll lock's rules are constant.
    const lock = added.find((el) => el.textContent?.includes("with-scroll-bars-hidden"));
    expect(lock?.textContent).toContain("margin-right: 0px !important");
    expect(lock?.textContent).toContain("--removed-body-scroll-bar-size: 0px");
    expect(hashes.sort()).toEqual(Object.values(RADIX_STYLE_HASHES).sort());
  });

  test("a policy allowing them logs no violation", async () => {
    const violations: string[] = [];
    document.addEventListener("securitypolicyviolation", (event) =>
      violations.push(`${event.effectiveDirective}: ${event.sample}`),
    );
    // App CSS stays in Vite's dev <style> tags; allow them with 'unsafe-inline'
    // would disable hashes, so move them into constructable sheets first.
    for (const style of Array.from(document.querySelectorAll<HTMLStyleElement>("style"))) {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(style.textContent ?? "");
      document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
      style.remove();
    }
    const meta = document.createElement("meta");
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = `style-src 'self' 'report-sample' ${Object.values(RADIX_STYLE_HASHES)
      .map((hash) => `'${hash}'`)
      .join(" ")}`;
    document.head.append(meta);

    render(<Components />);
    await settle();
    expect(violations).toEqual([]);
    // Allowed, so applied: the page is locked by Radix's own rule.
    expect(document.body.hasAttribute("data-scroll-locked")).toBe(true);
    const lock = Array.from(document.querySelectorAll("style")).find((el) =>
      el.textContent?.includes("with-scroll-bars-hidden"),
    );
    expect(lock?.sheet?.cssRules.length).toBeGreaterThan(0);
  });
});
