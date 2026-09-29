import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import {
  Button,
  ResourceItem,
  ResourcePicker,
  StackedList,
  Thumbnail,
  type ResourcePickerItem,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const swatch = (fill: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="#f5f5f5"/><circle cx="40" cy="40" r="22" fill="${fill}"/></svg>`,
  );

interface Product extends ResourcePickerItem {
  price: string;
}

const PRODUCTS: Product[] = [
  { id: "mug", title: "Ceramic mug", subtitle: "12 in stock", price: "$18.00", color: "#c100f1" },
  {
    id: "towel",
    title: "Linen tea towel",
    subtitle: "4 in stock",
    price: "$12.00",
    color: "#cdea19",
  },
  {
    id: "teapot",
    title: "Cast iron teapot",
    subtitle: "Sold out",
    price: "$45.00",
    color: "#737373",
  },
  {
    id: "tray",
    title: "Oak serving tray",
    subtitle: "31 in stock",
    price: "$38.00",
    color: "#fff5bf",
  },
  {
    id: "bowl",
    title: "Stoneware bowl",
    subtitle: "8 in stock",
    price: "$22.00",
    color: "#6b97ff",
  },
  {
    id: "candle",
    title: "Beeswax candle",
    subtitle: "60 in stock",
    price: "$9.00",
    color: "#f59e0b",
  },
  { id: "vase", title: "Glass bud vase", subtitle: "No image", price: "$15.00", color: "" },
].map(({ color, ...product }) => ({
  ...product,
  thumbnail: color ? swatch(color) : null,
  meta: product.price,
  disabled: product.subtitle === "Sold out",
}));

const CODE = {
  basic: `import { Button, ResourcePicker } from "@hilum/ui"

const [open, setOpen] = useState(false)
const [query, setQuery] = useState("")
const { data, isFetching, hasNextPage, fetchNextPage } = useProducts(query)

<Button variant="outline" onClick={() => setOpen(true)}>Browse</Button>
<ResourcePicker
  open={open}
  onOpenChange={setOpen}
  title="Add products"
  items={(data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: \`\${p.inventory} in stock\`,
    thumbnail: p.imageUrl,         // null shows the placeholder
    meta: formatMoney(p.price),
  }))}
  onSearch={setQuery}              // debounced (searchDelay, 250ms)
  loading={isFetching}
  hasMore={hasNextPage}
  onLoadMore={fetchNextPage}
  initialSelectedIds={relatedIds}
  onSelect={(ids) => setRelatedIds(ids)}
/>`,
  single: `<ResourcePicker
  open={open}
  onOpenChange={setOpen}
  title="Choose a product"
  items={products}
  multiple={false}
  onSelect={([id]) => setFeatured(id)}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function BasicDemo() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Product[]>([PRODUCTS[0]!]);
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const timer = window.setTimeout(() => {
      const needle = query.trim().toLowerCase();
      setItems(PRODUCTS.filter((product) => product.title.toLowerCase().includes(needle)));
      setLoading(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [open, query]);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="body font-medium text-foreground">Related products</p>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          Browse
        </Button>
      </div>
      {selected.length > 0 && (
        <StackedList>
          {selected.map((product) => (
            <ResourceItem
              key={product.id}
              title={product.title}
              subtitle={product.subtitle}
              media={<Thumbnail src={product.thumbnail as string | null} alt="" size="sm" />}
              trailing={product.price}
            />
          ))}
        </StackedList>
      )}
      <ResourcePicker
        open={open}
        onOpenChange={setOpen}
        title="Add products"
        items={items}
        onSearch={setQuery}
        loading={loading}
        initialSelectedIds={selected.map((product) => product.id)}
        onSelect={(_, chosen) => setSelected(chosen)}
      />
    </div>
  );
}

function SingleDemo() {
  const [open, setOpen] = useState(false);
  const [featured, setFeatured] = useState<Product | undefined>();
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" onClick={() => setOpen(true)}>
        Choose a product
      </Button>
      <span className="body text-muted-foreground">{featured?.title ?? "None chosen"}</span>
      <ResourcePicker
        open={open}
        onOpenChange={setOpen}
        title="Choose a product"
        items={PRODUCTS}
        multiple={false}
        initialSelectedIds={featured ? [featured.id] : []}
        onSelect={(_, [chosen]) => setFeatured(chosen)}
      />
    </div>
  );
}

function ResourcePickerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Resource Picker</span>
        </div>
        <h1 className="display mb-2 text-foreground">Resource Picker</h1>
        <p className="body max-w-lg text-muted-foreground">
          Shopify-style picker dialog: search, a list of rows with thumbnail, title, subtitle and
          meta, checkboxes (or a single choice), and Add. Search and paging can run on the server;
          the selection survives searching.
        </p>
      </div>

      <PageDocs path="/molecules/resource-picker/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Multiple" />
          <PreviewBlock
            title="Add products"
            description="onSearch is debounced; loading shows skeleton rows, then a spinner in the search field. Sold-out rows are disabled."
            code={CODE.basic}
            previewClassName="flex-col items-stretch"
          >
            <BasicDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Single" />
          <PreviewBlock
            title="Choose one"
            description="multiple={false} renders radio buttons."
            code={CODE.single}
          >
            <SingleDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/resource-picker/")({
  head: () => createCatalogPageHead("/molecules/resource-picker/"),
  component: ResourcePickerPage,
});
