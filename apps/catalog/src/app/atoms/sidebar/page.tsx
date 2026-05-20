
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Settings,
  BookOpen,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { PreviewBlock } from "@/components/catalog/preview-block";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Nav data                                                            */
/* ------------------------------------------------------------------ */

const navMain = [
  { title: "Dashboard", url: "#", icon: LayoutDashboard, isActive: true },
  { title: "Projects", url: "#", icon: FolderKanban, badge: "3" },
  { title: "Team", url: "#", icon: Users },
  { title: "Analytics", url: "#", icon: BarChart3 },
  { title: "Settings", url: "#", icon: Settings },
];

const navSecondary = [
  { title: "Documentation", url: "#", icon: BookOpen },
  { title: "Support", url: "#", icon: LifeBuoy },
];

/* ------------------------------------------------------------------ */
/*  Section heading                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Code strings                                                        */
/* ------------------------------------------------------------------ */

const CODE_DEFAULT = `import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent,
  SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarMenuBadge, SidebarSeparator, SidebarInset, SidebarTrigger, SidebarRail,
} from "@hilum/ui"

const navMain = [
  { title: "Dashboard", url: "#", icon: LayoutDashboard, isActive: true },
  { title: "Projects",  url: "#", icon: FolderKanban, badge: "3" },
  { title: "Team",      url: "#", icon: Users },
  { title: "Analytics", url: "#", icon: BarChart3 },
  { title: "Settings",  url: "#", icon: Settings },
]

<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader>
      <div className="flex items-center gap-2.5 group-data-[state=collapsed]/sidebar-wrapper:justify-center">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ground-900">
          <span className="caption font-bold text-white">D</span>
        </div>
        <span className="body font-semibold text-ground-900 group-data-[state=collapsed]/sidebar-wrapper:hidden">
          Design Co.
        </span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.title}
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
                {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <div className="flex items-center gap-2.5 group-data-[state=collapsed]/sidebar-wrapper:justify-center">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ground-200 caption font-semibold text-ground-700">
          W
        </div>
        <div className="flex-1 min-w-0 group-data-[state=collapsed]/sidebar-wrapper:hidden">
          <p className="body font-medium text-ground-900 truncate">William Chen</p>
          <p className="caption text-ground-400 truncate">w@designco.com</p>
        </div>
      </div>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>

  <SidebarInset>
    <header className="flex h-12 items-center gap-2 border-b border-ground-100 px-4">
      <SidebarTrigger />
      <div className="h-4 w-px bg-ground-100" />
      <span className="body font-medium text-ground-900">Dashboard</span>
    </header>
    <div className="flex-1 p-6">
      <p className="body text-ground-400">Main content area</p>
    </div>
  </SidebarInset>
</SidebarProvider>`;

const CODE_SUBMENUS = `import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarMenuBadge, SidebarInset, SidebarTrigger, SidebarRail,
} from "@hilum/ui"

<SidebarProvider>
  <Sidebar collapsible="icon">
    {/* header + footer same as default example */}
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Projects — with sub-items */}
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Projects">
                <FolderKanban />
                <span>Projects</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">Design System</SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#" isActive>Mobile App</SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton href="#">API Platform</SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Team">
                <Users />
                <span>Team</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>

  <SidebarInset>
    {/* content */}
  </SidebarInset>
</SidebarProvider>`;

const CODE_COLLAPSED = `// Pass defaultOpen={false} to start the sidebar collapsed
<SidebarProvider defaultOpen={false}>
  <Sidebar collapsible="icon">
    {/* Icons only — labels hidden, tooltips shown on hover */}
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  isActive={item.isActive}
                  tooltip={item.title}   // shown when collapsed
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  <SidebarInset>
    {/* More horizontal space available when collapsed */}
  </SidebarInset>
</SidebarProvider>`;

/* ------------------------------------------------------------------ */
/*  Shared sidebar contents                                             */
/* ------------------------------------------------------------------ */

function DefaultSidebarContent() {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-1 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ground-900">
            <span className="caption font-bold text-white">D</span>
          </div>
          <span className="body font-semibold text-ground-900 group-data-[state=collapsed]/sidebar-wrapper:hidden">
            Design Co.
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    {...(item.isActive !== undefined && { isActive: item.isActive })}
                    tooltip={item.title}
                  >
                    <item.icon size={15} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton tooltip={item.title}>
                    <item.icon size={15} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-2.5 px-1 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ground-200 caption font-semibold text-ground-600">
            W
          </div>
          <div className="flex min-w-0 flex-1 flex-col group-data-[state=collapsed]/sidebar-wrapper:hidden">
            <span className="body font-medium text-ground-900 truncate">William Chen</span>
            <span className="caption text-ground-400 truncate">w@designco.com</span>
          </div>
          <button className="shrink-0 text-ground-400 hover:text-ground-700 transition-colors group-data-[state=collapsed]/sidebar-wrapper:hidden">
            <LogOut size={14} />
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SidebarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Page header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Sidebar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Sidebar</h1>
        <p className="body max-w-lg text-ground-500">
          Composable sidebar system supporting collapsible modes, icon-only
          collapse, sub-menus, badges, and flexible layout composition.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <SectionHeading label="Sidebar" />

        {/* ---- 1. Default sidebar ---- */}
        <PreviewBlock
          title="Default sidebar"
          description="Collapsible icon-mode sidebar with header, navigation, and user footer"
          code={CODE_DEFAULT}
          previewClassName="p-0 items-stretch"
        >
          <div className="h-[480px] w-full overflow-hidden rounded-xl border border-ground-100">
            <SidebarProvider>
              <Sidebar collapsible="icon">
                <DefaultSidebarContent />
              </Sidebar>
              <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-ground-100 px-4">
                  <SidebarTrigger />
                  <div className="h-4 w-px bg-ground-100" />
                  <span className="body font-medium text-ground-900">Dashboard</span>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  {/* Placeholder content */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Total Revenue", value: "$48,295", delta: "+12%" },
                      { label: "Active Users",  value: "2,841",   delta: "+5%" },
                      { label: "Conversions",   value: "18.4%",   delta: "+2.1%" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-ground-100 bg-white p-4"
                      >
                        <p className="caption text-ground-400">{stat.label}</p>
                        <p className="subheading mt-1 text-ground-900">{stat.value}</p>
                        <p className="caption mt-1 text-brand-primary font-medium">{stat.delta}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 rounded-lg border border-ground-100 bg-ground-50" />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </PreviewBlock>

        {/* ---- 2. With sub-menus ---- */}
        <PreviewBlock
          title="With sub-menus"
          description="Nested navigation with sub-items under Projects, hidden in collapsed state"
          code={CODE_SUBMENUS}
          previewClassName="p-0 items-stretch"
        >
          <div className="h-[480px] w-full overflow-hidden rounded-xl border border-ground-100">
            <SidebarProvider>
              <Sidebar collapsible="icon">
                <SidebarHeader>
                  <div className="flex items-center gap-2.5 px-1 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ground-900">
                      <span className="caption font-bold text-white">D</span>
                    </div>
                    <span className="body font-semibold text-ground-900 group-data-[state=collapsed]/sidebar-wrapper:hidden">
                      Design Co.
                    </span>
                  </div>
                </SidebarHeader>

                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {/* Dashboard */}
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive tooltip="Dashboard">
                            <LayoutDashboard size={15} />
                            <span>Dashboard</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        {/* Projects with sub-menu */}
                        <SidebarMenuItem>
                          <SidebarMenuButton tooltip="Projects">
                            <FolderKanban size={15} />
                            <span>Projects</span>
                          </SidebarMenuButton>
                          <SidebarMenuSub>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton href="#">
                                Design System
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton href="#" isActive>
                                Mobile App
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                            <SidebarMenuSubItem>
                              <SidebarMenuSubButton href="#">
                                API Platform
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          </SidebarMenuSub>
                        </SidebarMenuItem>

                        {/* Rest of nav */}
                        {[
                          { title: "Team", icon: Users },
                          { title: "Analytics", icon: BarChart3 },
                          { title: "Settings", icon: Settings },
                        ].map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon size={15} />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  <SidebarSeparator />

                  <SidebarGroup>
                    <SidebarGroupLabel>Support</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {navSecondary.map((item) => (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title}>
                              <item.icon size={15} />
                              <span>{item.title}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                  <div className="flex items-center gap-2.5 px-1 group-data-[state=collapsed]/sidebar-wrapper:justify-center group-data-[state=collapsed]/sidebar-wrapper:px-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ground-200 caption font-semibold text-ground-600">
                      W
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col group-data-[state=collapsed]/sidebar-wrapper:hidden">
                      <span className="body font-medium text-ground-900 truncate">William Chen</span>
                      <span className="caption text-ground-400 truncate">w@designco.com</span>
                    </div>
                  </div>
                </SidebarFooter>

                <SidebarRail />
              </Sidebar>

              <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-ground-100 px-4">
                  <SidebarTrigger />
                  <div className="h-4 w-px bg-ground-100" />
                  <span className="body font-medium text-ground-900">Projects</span>
                  <span className="caption text-ground-400 ml-1">/ Mobile App</span>
                </header>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="rounded-lg border border-ground-100 bg-white p-4">
                    <p className="body font-medium text-ground-900 mb-1">Mobile App</p>
                    <p className="caption text-ground-400">
                      Sub-navigation is visible when expanded and hidden when collapsed to
                      icon-only mode.
                    </p>
                  </div>
                  <div className="flex-1 rounded-lg border border-ground-100 bg-ground-50" />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </PreviewBlock>

        {/* ---- 3. Icon-only collapsed ---- */}
        <PreviewBlock
          title="Icon-only collapsed"
          description="Sidebar starts collapsed — icons shown with tooltips, more content space"
          code={CODE_COLLAPSED}
          previewClassName="p-0 items-stretch"
        >
          <div className="h-[480px] w-full overflow-hidden rounded-xl border border-ground-100">
            <SidebarProvider defaultOpen={false}>
              <Sidebar collapsible="icon">
                <DefaultSidebarContent />
              </Sidebar>
              <SidebarInset>
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-ground-100 px-4">
                  <SidebarTrigger />
                  <div className="h-4 w-px bg-ground-100" />
                  <span className="body font-medium text-ground-900">Dashboard</span>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <p className="caption text-ground-400">
                    Hover over the icons to see tooltips. Click the toggle to expand.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-28 rounded-lg border border-ground-100 bg-ground-50"
                      />
                    ))}
                  </div>
                  <div className="flex-1 rounded-lg border border-ground-100 bg-ground-50" />
                </div>
              </SidebarInset>
            </SidebarProvider>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
