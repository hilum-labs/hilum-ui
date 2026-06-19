import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "../breadcrumb";
import { SectionHeading } from "../section-heading";
import { PageHeading } from "../page-heading";
import { DescriptionList } from "../description-list";
import { PropertyRow } from "../property-row";
import { StackedList, StackedListItem } from "../stacked-list";
import { GridList, GridListCard, GridListAccentCard } from "../grid-list";
import { ActivityFeed } from "../activity-feed";
import { CardHeading } from "../card-heading";
import { ActionPanel } from "../action-panel";
import { ButtonGroup, ButtonGroupItem } from "../button-group";
import {
  AccountMenuContent,
  AccountMenuHeader,
  AccountMenuItem,
  AccountMenuSection,
  AccountMenuSeparator,
} from "../account-menu";
import { DropdownMenu } from "../dropdown-menu";

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                           */
/* ------------------------------------------------------------------ */

describe("Breadcrumb", () => {
  it('renders nav with aria-label="breadcrumb"', () => {
    render(<Breadcrumb />);
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
  });

  it("renders full breadcrumb trail", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Settings</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>,
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders BreadcrumbEllipsis", () => {
    const { container } = render(<BreadcrumbEllipsis />);
    expect(container.querySelector('[role="presentation"]')).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* AccountMenu                                                         */
/* ------------------------------------------------------------------ */

describe("AccountMenu", () => {
  it("renders account header and action rows", () => {
    render(
      <DropdownMenu open>
        <AccountMenuContent>
          <AccountMenuHeader name="Ada Lovelace" email="ada@example.com" fallback="A" />
          <AccountMenuSeparator />
          <AccountMenuSection>
            <AccountMenuItem description="ada@example.com">Create profile</AccountMenuItem>
          </AccountMenuSection>
        </AccountMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getAllByText("ada@example.com")).toHaveLength(2);
    expect(screen.getByText("Create profile")).toBeInTheDocument();
  });

  it("uses the light dropdown surface tokens", () => {
    render(
      <DropdownMenu open>
        <AccountMenuContent>
          <AccountMenuHeader name="Ada Lovelace" email="ada@example.com" fallback="A" />
          <AccountMenuSeparator />
          <AccountMenuSection>
            <AccountMenuItem>Settings</AccountMenuItem>
          </AccountMenuSection>
        </AccountMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByRole("menu")).toHaveClass("bg-card", "text-foreground", "border-border");
    expect(screen.getByText("Settings").closest('[role="menuitem"]')).toHaveClass(
      "text-foreground",
    );
  });

  it("uses compact dropdown sizing", () => {
    render(
      <DropdownMenu open>
        <AccountMenuContent>
          <AccountMenuHeader name="Ada Lovelace" email="ada@example.com" fallback="A" />
          <AccountMenuSection>
            <AccountMenuItem>Settings</AccountMenuItem>
          </AccountMenuSection>
        </AccountMenuContent>
      </DropdownMenu>,
    );

    expect(screen.getByRole("menu")).toHaveClass("w-72", "rounded-xl");
    expect(screen.getByText("Settings")).toHaveClass("body");
  });
});

/* ------------------------------------------------------------------ */
/* SectionHeading                                                       */
/* ------------------------------------------------------------------ */

describe("SectionHeading", () => {
  it("renders title", () => {
    render(<SectionHeading title="Team Members" />);
    expect(screen.getByText("Team Members")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<SectionHeading title="Title" description="Manage your team." />);
    expect(screen.getByText("Manage your team.")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<SectionHeading title="Title" actions={[{ label: "Add", onClick: () => {} }]} />);
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("renders action with href as link", () => {
    render(<SectionHeading title="Title" actions={[{ label: "View", href: "/all" }]} />);
    expect(screen.getByRole("link", { name: "View" })).toHaveAttribute("href", "/all");
  });
});

/* ------------------------------------------------------------------ */
/* PageHeading                                                          */
/* ------------------------------------------------------------------ */

describe("PageHeading", () => {
  it("renders title as h1", () => {
    render(<PageHeading title="Dashboard" />);
    expect(screen.getByRole("heading", { name: "Dashboard", level: 1 })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PageHeading title="Users" description="Manage all users." />);
    expect(screen.getByText("Manage all users.")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <PageHeading
        title="Configuration"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Config" }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByText("Config")).toBeInTheDocument();
  });

  it("renders badge as string", () => {
    render(<PageHeading title="Title" badge="Beta" />);
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("renders badge as object", () => {
    render(<PageHeading title="Title" badge={{ label: "New", variant: "secondary" }} />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<PageHeading title="Title" actions={[{ label: "Export", primary: true }]} />);
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DescriptionList                                                      */
/* ------------------------------------------------------------------ */

describe("DescriptionList", () => {
  const items = [
    { term: "Name", details: "Alice" },
    { term: "Role", details: "Admin" },
  ];

  it("renders all terms and details", () => {
    render(<DescriptionList items={items} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders title and description when provided", () => {
    render(<DescriptionList items={items} title="Details" description="User info" />);
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("User info")).toBeInTheDocument();
  });

  it("renders 2-column layout", () => {
    render(<DescriptionList items={items} columns={2} />);
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("renders action alongside detail", () => {
    render(
      <DescriptionList
        items={[{ term: "Email", details: "alice@test.com", action: <button>Edit</button> }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* PropertyRow                                                          */
/* ------------------------------------------------------------------ */

describe("PropertyRow", () => {
  it("renders label and children", () => {
    render(
      <PropertyRow label="Width">
        <input type="number" aria-label="width-input" />
      </PropertyRow>,
    );
    expect(screen.getByText("Width")).toBeInTheDocument();
    expect(screen.getByLabelText("width-input")).toBeInTheDocument();
  });

  it("places labels above controls by default", () => {
    render(
      <PropertyRow label="Width">
        <input type="number" aria-label="width-input" />
      </PropertyRow>,
    );
    expect(screen.getByText("Width").parentElement).toHaveClass("flex-col");
  });

  it("supports inline labels for dense rows", () => {
    render(
      <PropertyRow label="Width" layout="inline">
        <input type="number" aria-label="width-input" />
      </PropertyRow>,
    );
    expect(screen.getByText("Width").parentElement).not.toHaveClass("flex-col");
    expect(screen.getByText("Width")).toHaveStyle({ width: "96px" });
  });

  it("renders without label", () => {
    render(
      <PropertyRow>
        <span>Controls</span>
      </PropertyRow>,
    );
    expect(screen.getByText("Controls")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* StackedList                                                          */
/* ------------------------------------------------------------------ */

describe("StackedList", () => {
  it("renders as a list", () => {
    render(
      <StackedList>
        <StackedListItem>Item 1</StackedListItem>
        <StackedListItem>Item 2</StackedListItem>
      </StackedList>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders item with href as link", () => {
    render(
      <StackedList>
        <StackedListItem href="/page">Go to page</StackedListItem>
      </StackedList>,
    );
    expect(screen.getByRole("link", { name: "Go to page" })).toBeInTheDocument();
  });

  it("renders item with onClick as button", () => {
    render(
      <StackedList>
        <StackedListItem onClick={() => {}}>Clickable</StackedListItem>
      </StackedList>,
    );
    expect(screen.getByRole("button", { name: "Clickable" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* GridList                                                             */
/* ------------------------------------------------------------------ */

describe("GridList", () => {
  it("renders as a list", () => {
    render(
      <GridList>
        <GridListCard title="Card A" />
        <GridListCard title="Card B" />
      </GridList>,
    );
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Card A")).toBeInTheDocument();
    expect(screen.getByText("Card B")).toBeInTheDocument();
  });

  it("GridListCard renders description", () => {
    render(
      <GridList>
        <GridListCard title="Item" description="Desc text" />
      </GridList>,
    );
    expect(screen.getByText("Desc text")).toBeInTheDocument();
  });

  it("GridListCard renders as link when href provided", () => {
    render(
      <GridList>
        <GridListCard title="Click" href="/target" />
      </GridList>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/target");
  });

  it("GridListAccentCard renders title", () => {
    render(
      <GridList>
        <GridListAccentCard title="Project Alpha" initials="PA" />
      </GridList>,
    );
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
  });

  it("GridListAccentCard renders as link when href provided", () => {
    render(
      <GridList>
        <GridListAccentCard title="Project" href="/project" />
      </GridList>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/project");
  });
});

/* ------------------------------------------------------------------ */
/* ActivityFeed                                                         */
/* ------------------------------------------------------------------ */

describe("ActivityFeed", () => {
  it("renders all events", () => {
    render(
      <ActivityFeed
        events={[
          { id: 1, content: "User joined", date: "Today" },
          { id: 2, content: "File uploaded", date: "Yesterday" },
        ]}
      />,
    );
    expect(screen.getByText("User joined")).toBeInTheDocument();
    expect(screen.getByText("File uploaded")).toBeInTheDocument();
  });

  it("renders event dates", () => {
    render(<ActivityFeed events={[{ content: "Action", date: "Jan 1, 2026" }]} />);
    expect(screen.getByText("Jan 1, 2026")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* CardHeading                                                          */
/* ------------------------------------------------------------------ */

describe("CardHeading", () => {
  it("renders title", () => {
    render(<CardHeading title="Team Settings" />);
    expect(screen.getByText("Team Settings")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<CardHeading title="Title" description="Subtitle here" />);
    expect(screen.getByText("Subtitle here")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<CardHeading title="Title" actions={[{ label: "Save" }]} />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ActionPanel                                                          */
/* ------------------------------------------------------------------ */

describe("ActionPanel", () => {
  it("renders title", () => {
    render(<ActionPanel title="Danger Zone" />);
    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<ActionPanel title="T" description="Delete this account." />);
    expect(screen.getByText("Delete this account.")).toBeInTheDocument();
  });

  it("renders action button", () => {
    render(<ActionPanel title="T" action={{ label: "Delete", variant: "destructive" }} />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("renders inline layout without error", () => {
    render(<ActionPanel title="Info" layout="inline" action={{ label: "Go" }} />);
    expect(screen.getByText("Info")).toBeInTheDocument();
  });

  it("renders muted variant without error", () => {
    render(<ActionPanel title="Note" variant="muted" />);
    expect(screen.getByText("Note")).toBeInTheDocument();
  });

  it("renders link", () => {
    render(<ActionPanel title="T" link={{ label: "Learn more", href: "/docs" }} />);
    expect(screen.getByText("Learn more")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ButtonGroup                                                          */
/* ------------------------------------------------------------------ */

describe("ButtonGroup", () => {
  it("renders items", () => {
    render(
      <ButtonGroup>
        <ButtonGroupItem>Day</ButtonGroupItem>
        <ButtonGroupItem>Week</ButtonGroupItem>
        <ButtonGroupItem active>Month</ButtonGroupItem>
      </ButtonGroup>,
    );
    expect(screen.getByRole("button", { name: "Day" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Week" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Month" })).toBeInTheDocument();
  });

  it("calls onClick on item click", () => {
    const onClick = vi.fn();
    render(
      <ButtonGroup>
        <ButtonGroupItem onClick={onClick}>Click me</ButtonGroupItem>
      </ButtonGroup>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Click me" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
