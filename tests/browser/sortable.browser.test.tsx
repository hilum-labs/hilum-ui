import * as React from "react";
import { render, screen } from "@testing-library/react";
import { commands, userEvent } from "@vitest/browser/context";
import { SortableHandle, SortableItem, SortableList } from "@hilum/ui";

interface Row {
  id: string;
  name: string;
}

const INITIAL: Row[] = ["alpha", "bravo", "charlie", "delta"].map((id) => ({
  id,
  name: id[0]!.toUpperCase() + id.slice(1),
}));

function Harness({ onReorder }: { onReorder: (ids: string[]) => void }) {
  const [rows, setRows] = React.useState(INITIAL);
  return (
    <div style={{ width: 320, padding: 16 }}>
      <SortableList
        aria-label="Fruits"
        items={rows}
        getItemId={(row) => row.id}
        getItemLabel={(row) => row.name}
        onReorder={(next) => {
          setRows(next);
          onReorder(next.map((row) => row.id));
        }}
      >
        {(row) => (
          <SortableItem id={row.id} handle data-testid={`item-${row.id}`}>
            <SortableHandle data-testid={`handle-${row.id}`} />
            <span>{row.name}</span>
          </SortableItem>
        )}
      </SortableList>
    </div>
  );
}

/** dnd-kit's live region (`#DndLiveRegion-N`, role=status). */
const liveRegionText = () =>
  document.querySelector<HTMLElement>('[id^="DndLiveRegion"]')?.textContent ?? "";

const renderedOrder = () =>
  Array.from(document.querySelectorAll('[data-slot="sortable-item"] span')).map(
    (el) => el.textContent,
  );

describe("SortableList (real browser)", () => {
  test("keyboard: Space picks up, ArrowDown ×2 moves, Space drops", async () => {
    const onReorder = vi.fn();
    render(<Harness onReorder={onReorder} />);

    const handle = screen.getByRole("button", { name: "Reorder Alpha" });
    handle.focus();
    expect(document.activeElement).toBe(handle);

    await userEvent.keyboard(" ");
    await expect.poll(liveRegionText).toBe("Picked up Alpha. Position 1 of 4.");

    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(liveRegionText).toBe("Alpha moved to position 2 of 4.");
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(liveRegionText).toBe("Alpha moved to position 3 of 4.");

    await userEvent.keyboard(" ");
    await expect.poll(liveRegionText).toBe("Alpha dropped at position 3 of 4.");

    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(["bravo", "charlie", "alpha", "delta"]);
    await expect.poll(renderedOrder).toEqual(["Bravo", "Charlie", "Alpha", "Delta"]);
  });

  test("keyboard: Escape cancels and restores position", async () => {
    const onReorder = vi.fn();
    render(<Harness onReorder={onReorder} />);

    screen.getByRole("button", { name: "Reorder Bravo" }).focus();
    await userEvent.keyboard(" ");
    await expect.poll(liveRegionText).toBe("Picked up Bravo. Position 2 of 4.");
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(liveRegionText).toBe("Bravo moved to position 3 of 4.");

    await userEvent.keyboard("{Escape}");
    await expect
      .poll(liveRegionText)
      .toBe("Reordering cancelled. Bravo returned to position 2.");

    expect(onReorder).not.toHaveBeenCalled();
    expect(renderedOrder()).toEqual(["Alpha", "Bravo", "Charlie", "Delta"]);
    // The lifted item snaps back (no leftover transform).
    await expect
      .poll(() => screen.getByTestId("item-bravo").style.transform || "none")
      .toMatch(/^(none|translate3d\(0px, 0px, 0\))$/);
  });

  test("pointer: real mouse drag reorders", async () => {
    const onReorder = vi.fn();
    render(<Harness onReorder={onReorder} />);

    await commands.pointerDrag('[data-testid="handle-alpha"]', '[data-testid="item-charlie"]');

    await expect.poll(() => onReorder.mock.calls.length).toBe(1);
    expect(onReorder).toHaveBeenCalledWith(["bravo", "charlie", "alpha", "delta"]);
    await expect.poll(renderedOrder).toEqual(["Bravo", "Charlie", "Alpha", "Delta"]);
  });

  test("pointer: movement below the 4px activation distance is a click, not a drag", async () => {
    const onReorder = vi.fn();
    render(<Harness onReorder={onReorder} />);
    await userEvent.click(screen.getByTestId("handle-delta"));
    expect(onReorder).not.toHaveBeenCalled();
    expect(liveRegionText()).toBe("");
  });
});
