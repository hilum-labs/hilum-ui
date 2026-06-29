import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, SquareLibrary, Star, Users } from "lucide-react";
import { TabsSubtle, TabsSubtleItem, TabsSubtlePanel } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const BASIC_CODE = `import { TabsSubtle, TabsSubtleItem, TabsSubtlePanel } from "@hilum/ui"
import { useState } from "react"

const tabs = ["Teamspaces", "Recents", "Favorites", "Shared"]
const [selected, setSelected] = useState(0)

<TabsSubtle idPrefix="demo" selectedIndex={selected} onSelect={setSelected}>
  {tabs.map((label, index) => (
    <TabsSubtleItem key={label} index={index} label={label} />
  ))}
</TabsSubtle>`;

const ICONS_CODE = `import { TabsSubtle, TabsSubtleItem } from "@hilum/ui"
import { Clock, SquareLibrary, Star, Users } from "lucide-react"

const tabs = [
  { icon: SquareLibrary, label: "Teamspaces" },
  { icon: Clock, label: "Recents" },
  { icon: Star, label: "Favorites" },
  { icon: Users, label: "Shared" },
]

<TabsSubtle idPrefix="icons-demo" selectedIndex={selected} onSelect={setSelected}>
  {tabs.map((tab, index) => (
    <TabsSubtleItem key={tab.label} index={index} icon={tab.icon} label={tab.label} />
  ))}
</TabsSubtle>`;

const ACTIVE_LABEL_CODE = `import { TabsSubtle, TabsSubtleItem } from "@hilum/ui"

<TabsSubtle activeLabel idPrefix="active-label-demo" selectedIndex={selected} onSelect={setSelected}>
  {tabs.map((tab, index) => (
    <TabsSubtleItem key={tab.label} index={index} icon={tab.icon} label={tab.label} />
  ))}
</TabsSubtle>`;

function TabsSubtlePage() {
  const basicTabs = ["Teamspaces", "Recents", "Favorites", "Shared"];
  const iconTabs = [
    { icon: SquareLibrary, label: "Teamspaces" },
    { icon: Clock, label: "Recents" },
    { icon: Star, label: "Favorites" },
    { icon: Users, label: "Shared" },
  ];
  const [basicSelected, setBasicSelected] = useState(0);
  const [iconsSelected, setIconsSelected] = useState(0);
  const [activeLabelSelected, setActiveLabelSelected] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Tabs Subtle</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Tab navigation with smooth pill animations.
      </p>
      <PageDocs path="/atoms/tabs-subtle/" />
      <div className="flex flex-col gap-3">
        <PreviewBlock title="Basic" description="Text tabs" code={BASIC_CODE}>
          <div className="flex w-full max-w-xl flex-col gap-4">
            <TabsSubtle
              selectedIndex={basicSelected}
              onSelect={setBasicSelected}
              idPrefix="tabs-subtle-basic"
            >
              {basicTabs.map((label, index) => (
                <TabsSubtleItem key={label} index={index} label={label} />
              ))}
            </TabsSubtle>
            <TabsSubtlePanel
              index={basicSelected}
              selectedIndex={basicSelected}
              idPrefix="tabs-subtle-basic"
            >
              <p className="caption px-3 text-ground-400">
                {basicTabs[basicSelected]} content goes here.
              </p>
            </TabsSubtlePanel>
          </div>
        </PreviewBlock>
        <PreviewBlock title="With Icons" description="Icon and label tabs" code={ICONS_CODE}>
          <div className="flex w-full max-w-xl flex-col gap-4">
            <TabsSubtle
              selectedIndex={iconsSelected}
              onSelect={setIconsSelected}
              idPrefix="tabs-subtle-icons"
            >
              {iconTabs.map((tab, index) => (
                <TabsSubtleItem key={tab.label} index={index} icon={tab.icon} label={tab.label} />
              ))}
            </TabsSubtle>
            <p className="caption px-3 text-ground-400">
              {iconTabs[iconsSelected]?.label} content goes here.
            </p>
          </div>
        </PreviewBlock>
        <PreviewBlock
          title="Active Label"
          description="Only the selected icon tab shows text"
          code={ACTIVE_LABEL_CODE}
        >
          <div className="flex w-full max-w-xl flex-col gap-4">
            <TabsSubtle
              activeLabel
              selectedIndex={activeLabelSelected}
              onSelect={setActiveLabelSelected}
              idPrefix="tabs-subtle-active-label"
            >
              {iconTabs.map((tab, index) => (
                <TabsSubtleItem key={tab.label} index={index} icon={tab.icon} label={tab.label} />
              ))}
            </TabsSubtle>
            <p className="caption px-3 text-ground-400">
              {iconTabs[activeLabelSelected]?.label} content goes here.
            </p>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tabs-subtle/")({
  head: () => createCatalogPageHead("/atoms/tabs-subtle/"),
  component: TabsSubtlePage,
});
