import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "../dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "../alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "../context-menu";
import { Progress } from "../progress";
import { Switch } from "../switch";
import { Slider } from "../slider";
import { HelpTooltip } from "../help-tooltip";

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

  it("presents dialog content as a mobile bottom sheet by default", () => {
    render(
      <Dialog defaultOpen>
        <DialogContent>
          <DialogTitle>Mobile sheet dialog</DialogTitle>
        </DialogContent>
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveClass(
      "bottom-0",
      "inset-x-0",
      "rounded-t-2xl",
      "max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
      "lg:top-1/2",
      "lg:-translate-y-1/2",
      "data-[state=open]:slide-in-from-bottom",
      "lg:data-[state=open]:zoom-in-95",
    );
    expect(screen.getByRole("dialog")).not.toHaveClass("top-1/2");
  });
});

/* ------------------------------------------------------------------ */
/* Alert dialog                                                         */
/* ------------------------------------------------------------------ */

describe("AlertDialog", () => {
  it("presents alert dialog content as a mobile bottom sheet by default", () => {
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogTitle>Delete product</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>,
    );

    expect(screen.getByRole("alertdialog")).toHaveClass(
      "rounded-t-2xl",
      "max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
      "data-[state=open]:slide-in-from-bottom",
      "lg:data-[state=open]:zoom-in-95",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Dropdown menu                                                        */
/* ------------------------------------------------------------------ */

describe("DropdownMenu", () => {
  it("opts menu content into the mobile bottom sheet treatment", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>Actions</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    await user.click(screen.getByRole("button", { name: "Actions" }));

    expect(screen.getByRole("menu")).toHaveAttribute("data-hilum-mobile-sheet", "true");
    expect(screen.getByRole("menu")).toHaveClass(
      "max-md:!fixed",
      "max-md:rounded-2xl",
      "max-md:data-[state=open]:slide-in-from-bottom",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Select                                                               */
/* ------------------------------------------------------------------ */

describe("Select", () => {
  it("opts select content into the mobile bottom sheet treatment", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Status">
          <SelectValue placeholder="Choose status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>,
    );

    await user.click(screen.getByRole("combobox", { name: "Status" }));

    expect(screen.getByRole("listbox")).toHaveAttribute("data-hilum-mobile-sheet", "true");
    expect(screen.getByRole("listbox")).toHaveClass(
      "max-md:!fixed",
      "max-md:rounded-2xl",
      "max-md:data-[state=open]:slide-in-from-bottom",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Popover                                                              */
/* ------------------------------------------------------------------ */

describe("Popover", () => {
  it("opts popover content into the mobile bottom sheet treatment", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger asChild>
          <button>Filters</button>
        </PopoverTrigger>
        <PopoverContent>Filter content</PopoverContent>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(screen.getByText("Filter content")).toHaveAttribute("data-hilum-mobile-sheet", "true");
    expect(screen.getByText("Filter content")).toHaveClass(
      "max-md:!fixed",
      "max-md:rounded-2xl",
      "max-md:data-[state=open]:slide-in-from-bottom",
    );
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

  it("opts into the mobile bottom sheet treatment", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Canvas</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Copy</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByText("Canvas"));

    expect(screen.getByRole("menu")).toHaveAttribute("data-hilum-mobile-sheet", "true");
    expect(screen.getByRole("menu")).toHaveClass(
      "max-md:rounded-2xl",
      "max-md:data-[state=open]:slide-in-from-bottom",
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
/* HelpTooltip                                                          */
/* ------------------------------------------------------------------ */

describe("HelpTooltip", () => {
  it("opens explanatory content on click", async () => {
    const user = userEvent.setup();

    render(<HelpTooltip text="Stock-keeping unit. A unique code for inventory tracking." />);

    await user.click(screen.getByRole("button", { name: "Help" }));

    expect(
      screen.getAllByText("Stock-keeping unit. A unique code for inventory tracking.")[0],
    ).toBeInTheDocument();
  });

  it("truncates long help text and renders a learn more link", async () => {
    const user = userEvent.setup();
    const text =
      "This is a long explanation for a form field that should stay compact inside a tooltip so dense settings screens do not become visually noisy.";

    render(<HelpTooltip text={text} learnMoreUrl="/docs/settings" />);

    await user.click(screen.getByRole("button", { name: "Help" }));

    expect(screen.getAllByText(`${text.slice(0, 117)}...`)[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Learn more" })[0]).toHaveAttribute(
      "href",
      "/docs/settings",
    );
  });

  it("uses a compact icon with an expanded touch target", () => {
    render(<HelpTooltip text="Helpful text" />);

    expect(screen.getByRole("button", { name: "Help" })).toHaveClass(
      "size-5",
      "before:-inset-2.5",
      "active:scale-[0.96]",
    );
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
