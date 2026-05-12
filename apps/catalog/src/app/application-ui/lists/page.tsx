
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import Tables from "@/components/application-ui/lists/tables";
import tablesSource from "@/components/application-ui/lists/tables?raw";
import StackedLists from "@/components/application-ui/lists/stacked-lists";
import stackedListsSource from "@/components/application-ui/lists/stacked-lists?raw";
import GridLists from "@/components/application-ui/lists/grid-lists";
import gridListsSource from "@/components/application-ui/lists/grid-lists?raw";
import Feeds from "@/components/application-ui/lists/feeds";
import feedsSource from "@/components/application-ui/lists/feeds?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ListsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 flex flex-col gap-6 border-b border-taupe-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
            <a href="/" className="hover:text-taupe-700">
              Design System
            </a>
            <span>/</span>
            <a href="/application-ui" className="hover:text-taupe-700">
              Application UI
            </a>
            <span>/</span>
            <span className="font-semibold text-taupe-900">Lists</span>
          </div>
          <h1 className="display mb-2 text-taupe-900">Lists</h1>
          <p className="body max-w-2xl text-taupe-400">
            Tables, stacked lists, grid lists, and activity feeds.
          </p>
          <p className="caption mt-5 text-taupe-400">Data · 34 variants</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
          <Button size="sm">Add person</Button>
        </div>
      </div>

      <section className="mb-12">
        <SectionHeading label="Tables" />
        <div className="grid gap-6">
          <PreviewBlock
            title="Simple"
            description="A basic data table with a single text action per row."
            code={tablesSource}
            previewClassName="p-0"
          >
            <Tables />
          </PreviewBlock>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading label="Stacked Lists" />
        <div className="grid gap-6">
          <PreviewBlock
            title="Two Column With Avatar"
            description="List rows with identity on the left and metadata aligned to the right."
            code={stackedListsSource}
            previewClassName="p-0"
          >
            <StackedLists />
          </PreviewBlock>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading label="Grid Lists" />
        <div className="grid gap-6">
          <PreviewBlock
            title="Simple Cards"
            description="Three-up cards for people, teams, or contacts."
            code={gridListsSource}
            previewClassName="p-6"
          >
            <GridLists />
          </PreviewBlock>
        </div>
      </section>

      <section>
        <SectionHeading label="Feeds" />
        <div className="grid gap-6 lg:grid-cols-2">
          <PreviewBlock
            title="Stacked With Avatars"
            description="A lightweight activity feed with avatar markers and connector lines."
            code={feedsSource}
            previewClassName="p-6"
          >
            <Feeds />
          </PreviewBlock>
        </div>
      </section>

      <div className="h-16" />
    </div>
  );
}
