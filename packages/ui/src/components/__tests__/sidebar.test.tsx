import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SIDEBAR_COOKIE_NAME,
  useOptionalSidebar,
  useSidebar,
} from "../sidebar";

const realMatchMedia = window.matchMedia;

function mockViewport(mobile: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: mobile,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

afterEach(() => {
  window.matchMedia = realMatchMedia;
});

/** The header trigger (the rail shares its accessible name). */
function trigger() {
  return screen
    .getAllByRole("button", { name: "Toggle sidebar" })
    .find((el) => el.getAttribute("data-sidebar") === "trigger")!;
}

function StateProbe() {
  const { state, openMobile, isMobile } = useSidebar();
  return <output data-testid="probe">{`${state}|${openMobile}|${isMobile}`}</output>;
}

function App({
  collapsible,
  side,
  variant,
  providerProps,
}: {
  collapsible?: "offcanvas" | "icon" | "none";
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  providerProps?: Partial<React.ComponentProps<typeof SidebarProvider>>;
}) {
  return (
    <SidebarProvider {...providerProps}>
      <Sidebar
        {...(collapsible ? { collapsible } : {})}
        {...(side ? { side } : {})}
        {...(variant ? { variant } : {})}
        data-testid="sidebar"
      >
        <SidebarHeader>Acme</SidebarHeader>
        <SidebarContent>
          <SidebarInput placeholder="Search" />
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupAction aria-label="Add project">+</SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive tooltip="Inbox">
                    <span>Inbox</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover aria-label="Inbox options">
                    …
                  </SidebarMenuAction>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="sm">
                    <span>Drafts</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#a" isActive>
                        Draft A
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon data-testid="skeleton" />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarSeparator />
        </SidebarContent>
        <SidebarFooter>Footer</SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <StateProbe />
      </SidebarInset>
    </SidebarProvider>
  );
}

describe("Sidebar", () => {
  it("toggles between expanded and collapsed via trigger, rail and Ctrl/⌘+B", () => {
    render(<App />);
    const sidebar = screen.getByTestId("sidebar");
    const menuButton = screen.getByRole("button", { name: "Inbox" });
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    expect(sidebar).toHaveAttribute("data-collapsible", "icon");
    expect(menuButton).toHaveAttribute("data-active", "true");

    fireEvent.click(trigger());
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    expect(menuButton).toHaveAttribute("data-state", "collapsed");
    expect(screen.getByText("Workspace")).toHaveAttribute("data-state", "collapsed");
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_NAME}=false`);

    fireEvent.click(screen.getByTitle("Toggle sidebar"));
    expect(sidebar).toHaveAttribute("data-state", "expanded");

    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(sidebar).toHaveAttribute("data-state", "collapsed");
    fireEvent.keyDown(window, { key: "b", metaKey: true });
    expect(sidebar).toHaveAttribute("data-state", "expanded");
    fireEvent.keyDown(window, { key: "b" });
    expect(sidebar).toHaveAttribute("data-state", "expanded");
  });

  it("starts collapsed from defaultOpen and forwards the trigger's onClick", () => {
    const onClick = vi.fn();
    render(
      <SidebarProvider defaultOpen={false}>
        <Sidebar data-testid="sidebar" />
        <SidebarTrigger onClick={onClick} />
      </SidebarProvider>,
    );
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-state", "collapsed");
    fireEvent.click(trigger());
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("sidebar")).toHaveAttribute("data-state", "expanded");
  });

  it("is controllable with open / onOpenChange", () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <App
          providerProps={{
            open,
            onOpenChange: (next) => {
              onOpenChange(next);
              setOpen(next);
            },
          }}
        />
      );
    }
    render(<Controlled />);
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByTestId("probe")).toHaveTextContent("collapsed|false|false");
  });

  it("renders the offcanvas and static variants", () => {
    const { unmount } = render(<App collapsible="offcanvas" side="right" />);
    const offcanvas = screen.getByTestId("sidebar");
    expect(offcanvas).toHaveAttribute("data-collapsible", "offcanvas");
    expect(offcanvas.className).toContain("border-s");
    fireEvent.click(trigger());
    expect(offcanvas).toHaveAttribute("data-state", "collapsed");
    unmount();

    render(<App collapsible="none" variant="floating" />);
    const staticSidebar = screen.getByTestId("sidebar");
    expect(staticSidebar.tagName).toBe("ASIDE");
    expect(staticSidebar).toHaveAttribute("data-collapsible", "none");
    expect(staticSidebar).not.toHaveAttribute("data-state");
  });

  it("renders the menu primitives with their slots", () => {
    render(<App variant="inset" />);
    expect(screen.getByPlaceholderText("Search")).toHaveAttribute("data-sidebar", "input");
    expect(screen.getByRole("button", { name: "Add project" })).toHaveAttribute(
      "data-sidebar",
      "group-action",
    );
    expect(screen.getByRole("button", { name: "Inbox options" }).className).toContain("opacity-0");
    expect(screen.getByText("12")).toHaveAttribute("data-sidebar", "menu-badge");
    expect(screen.getByRole("button", { name: "Drafts" })).toHaveAttribute("data-size", "sm");
    const sub = screen.getByRole("link", { name: "Draft A" });
    expect(sub).toHaveAttribute("data-active", "true");
    expect(sub.closest("ul")).toHaveAttribute("data-sidebar", "menu-sub");
    const skeleton = screen.getByTestId("skeleton");
    const bar = skeleton.lastElementChild as HTMLElement;
    expect(bar.style.getPropertyValue("--skeleton-width")).toMatch(/^\d+%$/);
    expect(skeleton.children).toHaveLength(2); // icon + bar
    expect(screen.getByText("Footer")).toHaveAttribute("data-sidebar", "footer");
  });

  it("uses a sheet on mobile, opened by the trigger", async () => {
    mockViewport(true);
    render(<App />);
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded|false|true");
    expect(screen.queryByText("Acme")).toBeNull();

    fireEvent.click(trigger());
    const sheet = await screen.findByRole("dialog");
    expect(within(sheet).getByText("Acme")).toBeInTheDocument();
    expect(screen.getByTestId("probe")).toHaveTextContent("expanded|true|true");
  });

  it("exposes the context only inside a provider", () => {
    function Optional() {
      return <span>{useOptionalSidebar() === null ? "none" : "some"}</span>;
    }
    render(<Optional />);
    expect(screen.getByText("none")).toBeInTheDocument();

    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<StateProbe />)).toThrow("useSidebar must be used inside SidebarProvider");
    error.mockRestore();
  });

  it("menu parts render outside a provider in the expanded state", () => {
    render(
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="#x">Standalone</a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>,
    );
    const link = screen.getByRole("link", { name: "Standalone" });
    expect(link).toHaveAttribute("data-state", "expanded");
    expect(link).toHaveAttribute("data-sidebar", "menu-button");
  });
});
