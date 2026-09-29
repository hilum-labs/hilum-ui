/**
 * ResourceItem with `href` renders its title as a stretched link: the whole
 * row is a real anchor for the pointer (so middle-click, ⌘/Ctrl-click and
 * "Open in new tab" work anywhere in the row), while its other slots sit
 * outside the router link, so clicks in a portal opened from them don't
 * navigate.
 */
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "vitest/browser";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  LinkProvider,
  ResourceItem,
  StackedList,
  type LinkComponent,
} from "@hilum/ui";

function routerLink(navigate: (href: string) => void): LinkComponent {
  return function RouterLink({ href, onClick, children, ...rest }) {
    return (
      <a
        href={href}
        {...rest}
        onClick={(event) => {
          onClick?.(event);
          const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
          if (event.defaultPrevented || event.button !== 0 || modified) return;
          event.preventDefault();
          navigate(href);
        }}
      >
        {children}
      </a>
    );
  };
}

function ArchiveDialog() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <span data-testid="open-dialog" />
      <button type="button" className="relative z-10" onClick={() => setOpen(true)}>
        Archive
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>Archive order?</DialogTitle>
          <DialogDescription>Archived orders stay searchable.</DialogDescription>
          <button type="button" onClick={() => setOpen(false)}>
            Confirm archive
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}

const centre = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [r.left + r.width / 2, r.top + r.height / 2] as const;
};

describe("ResourceItem href rows (real browser)", () => {
  test("every part of the row is the anchor under the pointer", () => {
    render(
      <StackedList>
        <ResourceItem
          title="Order #1001"
          subtitle="Ada Lovelace"
          meta="Sep 26"
          media={<span className="block size-8 rounded bg-muted" data-testid="media" />}
          trailing="S/ 120.00"
          trailingSecondary="Paid"
          href="#orders/1001"
        />
      </StackedList>,
    );
    const link = screen.getByRole("link", { name: "Order #1001" });
    for (const part of [
      screen.getByTestId("media"),
      screen.getByText("Ada Lovelace"),
      screen.getByText("Sep 26"),
      screen.getByText("S/ 120.00"),
      screen.getByText("Paid"),
    ]) {
      const hit = document.elementFromPoint(...centre(part));
      expect(hit?.closest("a"), part.textContent ?? "media").toBe(link);
    }
  });

  test("a click anywhere navigates; a click in a portal from a slot doesn't", async () => {
    const navigate = vi.fn();
    render(
      <LinkProvider value={routerLink(navigate)}>
        <StackedList>
          <ResourceItem
            title="Order #1001"
            subtitle="Ada Lovelace"
            trailing={<ArchiveDialog />}
            href="#orders/1001"
          />
        </StackedList>
      </LinkProvider>,
    );
    // Click the subtitle's spot (the anchor's overlay is what receives it).
    const link = screen.getByRole("link", { name: "Order #1001" });
    const [x, y] = centre(screen.getByText("Ada Lovelace"));
    const box = link.getBoundingClientRect();
    await userEvent.click(link, { position: { x: x - box.left, y: y - box.top } });
    expect(navigate).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole("button", { name: "Archive" }));
    await userEvent.click(screen.getByText("Archived orders stay searchable."));
    await userEvent.click(screen.getByRole("button", { name: "Confirm archive" }));
    await expect.poll(() => screen.queryByRole("dialog")).toBeNull();
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  test("keyboard focus rings the whole row", async () => {
    render(
      <StackedList>
        <ResourceItem title="Order #1001" subtitle="Ada Lovelace" href="#orders/1001" />
      </StackedList>,
    );
    const link = screen.getByRole("link", { name: "Order #1001" });
    const row = link.closest("li")!;
    expect(getComputedStyle(link, "::after").boxShadow).toBe("none");
    await userEvent.tab();
    expect(link).toHaveFocus();
    const overlay = getComputedStyle(link, "::after");
    expect(overlay.boxShadow).not.toBe("none");
    expect(parseFloat(overlay.width)).toBeCloseTo(row.getBoundingClientRect().width, 0);
    expect(parseFloat(overlay.height)).toBeCloseTo(row.getBoundingClientRect().height, 0);
  });
});
