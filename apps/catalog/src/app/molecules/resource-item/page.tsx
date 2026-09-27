import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import {
  DateText,
  ResourceCell,
  ResourceItem,
  StackedList,
  StatusBadge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  formatCurrency,
  pluralize,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  cell: `import { ResourceCell, DateText, StatusBadge, formatCurrency, pluralize } from "@hilum/ui"

<TableCell>
  <ResourceCell
    title="#1042"                          // primary — strongest
    subtitle={pluralize(3, "item")}        // secondary — muted, smaller
    href="/orders/1042"
  />
</TableCell>
<TableCell><DateText value={order.createdAt} /></TableCell>
<TableCell><StatusBadge status={order.financialStatus} /></TableCell>
<TableCell className="text-right tabular-nums">{formatCurrency(order.total)}</TableCell>`,

  list: `import { StackedList, ResourceItem } from "@hilum/ui"

// Mobile counterpart of the table — same hierarchy, whole row is the target.
<StackedList surface="responsive">
  {orders.map((order) => (
    <ResourceItem
      key={order.id}
      title={order.name}
      subtitle={order.customer.name}
      badge={<StatusBadge status={order.financialStatus} size="sm" />}
      meta={<DateText value={order.createdAt} />}
      trailing={formatCurrency(order.total)}
      trailingSecondary={pluralize(order.itemCount, "item")}
      href={\`/orders/\${order.id}\`}
    />
  ))}
</StackedList>`,
};

const ORDERS = [
  { id: "1042", customer: "Ada Lovelace", items: 3, total: 48.2, status: "paid", date: new Date(2026, 8, 26) },
  { id: "1041", customer: "Grace Hopper", items: 1, total: 120, status: "pending", date: new Date(2026, 8, 25) },
  { id: "1040", customer: "Alan Turing", items: 2, total: 64.5, status: "refunded", date: new Date(2026, 8, 24) },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ResourceItemPage() {
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
          <span className="font-semibold text-foreground">Resource Item</span>
        </div>
        <h1 className="display mb-2 text-foreground">Resource Item</h1>
        <p className="body max-w-lg text-muted-foreground">
          Primary/secondary text hierarchy for resource tables and lists. ResourceCell is the first
          table column; ResourceItem is the full-row mobile list equivalent.
        </p>
      </div>

      <PageDocs path="/molecules/resource-item/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Table cell" />
          <PreviewBlock
            title="Resource table"
            description="Strong primary line, muted secondary line, formatted dates, money and plurals."
            code={CODE.cell}
          >
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ORDERS.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <ResourceCell
                          title={`#${order.id}`}
                          subtitle={`${order.customer} · ${pluralize(order.items, "item")}`}
                          href="#"
                        />
                      </TableCell>
                      <TableCell>
                        <DateText value={order.date} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="List row" />
          <PreviewBlock
            title="Mobile resource list"
            description="Whole row is one link or button target, with a trailing value column."
            code={CODE.list}
          >
            <div className="w-full max-w-md">
              <StackedList>
                {ORDERS.map((order) => (
                  <ResourceItem
                    key={order.id}
                    title={`#${order.id}`}
                    subtitle={order.customer}
                    badge={<StatusBadge status={order.status} size="sm" />}
                    meta={<DateText value={order.date} />}
                    trailing={formatCurrency(order.total)}
                    trailingSecondary={pluralize(order.items, "item")}
                    href="#"
                  />
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/resource-item/")({
  head: () => createCatalogPageHead("/molecules/resource-item/"),
  component: ResourceItemPage,
});
