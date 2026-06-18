import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../dialog";
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "../context-menu";
import { Progress } from "../progress";
import { Switch } from "../switch";
import { Slider } from "../slider";

/**
 * Tests for Radix overlay primitives. These focus on:
 * 1. Trigger elements render and are accessible
 * 2. Content appears on interaction
 * 3. No render crashes
 */

/* ------------------------------------------------------------------ */
/* Dialog                                                               */
/* ------------------------------------------------------------------ */

describe("Dialog", () => {
  it("renders the trigger element", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Confirm action</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByRole("button", { name: "Open dialog" })).toBeInTheDocument();
  });

  it("shows dialog content after trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog heading</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Dialog heading")).toBeInTheDocument();
  });

  it("dialog content has a close button", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delete item</DialogTitle>
        </DialogContent>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Open" }));
    expect(await screen.findByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Context menu                                                        */
/* ------------------------------------------------------------------ */

describe("ContextMenu", () => {
  it("renders an opaque elevated menu surface", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Canvas</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByText("Canvas"));

    expect(screen.getByRole("menu")).toHaveClass(
      "bg-card",
      "border",
      "border-border",
      "shadow-elevated",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Tooltip                                                              */
/* ------------------------------------------------------------------ */

describe("Tooltip", () => {
  it("renders the trigger element", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Hover me</button>
          </TooltipTrigger>
          <TooltipContent>Helpful hint</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
  });

  it("shows tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Trigger</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByRole("button", { name: "Trigger" }));
    // Use role="tooltip" to target the accessible tooltip element specifically
    expect(await screen.findByRole("tooltip", { name: "Tooltip text" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Switch — additional a11y checks                                      */
/* ------------------------------------------------------------------ */

describe("Switch a11y", () => {
  it("has a role of switch", () => {
    render(<Switch aria-label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Slider — additional a11y checks                                      */
/* ------------------------------------------------------------------ */

describe("Slider a11y", () => {
  it("has proper ARIA attributes", () => {
    render(<Slider defaultValue={[30]} min={0} max={100} aria-label="Volume" />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "30");
  });
});

/* ------------------------------------------------------------------ */
/* Progress — additional a11y checks                                    */
/* ------------------------------------------------------------------ */

describe("Progress a11y", () => {
  it("has proper ARIA range attributes", () => {
    render(<Progress value={45} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuenow", "45");
  });
});
