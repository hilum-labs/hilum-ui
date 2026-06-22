import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { Search, Settings2 } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import InvoiceList from "@/components/ecommerce/order-history/invoice-list";
import invoiceListSource from "@/components/ecommerce/order-history/invoice-list?raw";
import InvoiceListQuickActions from "@/components/ecommerce/order-history/invoice-list-quick-actions";
import invoiceListQuickActionsSource from "@/components/ecommerce/order-history/invoice-list-quick-actions?raw";
import InvoicePanels from "@/components/ecommerce/order-history/invoice-panels";
import invoicePanelsSource from "@/components/ecommerce/order-history/invoice-panels?raw";
import InvoiceTable from "@/components/ecommerce/order-history/invoice-table";
import invoiceTableSource from "@/components/ecommerce/order-history/invoice-table?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function OrderHistoryPage() {
  const [statusFilter, setStatusFilter] = useState("Delivered");
  const [rangeFilter, setRangeFilter] = useState("Last 12 months");
  const [searchTerm, setSearchTerm] = useState("WU88191111");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/ecommerce" className="hover:text-ground-700">
            Ecommerce
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Order History</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Order History</h1>
        <p className="body max-w-2xl text-ground-500">
          Order list views as tables, panels, and invoice lists with quick actions.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Account</p>
          <div className="h-3 w-px bg-ground-100" />
          <Badge variant="outline">Account · 4 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/order-history/" />

      <div className="mb-10 rounded-[28px] border border-ground-200 bg-ground-50 p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_220px_220px_auto]">
          <div className="space-y-2">
            <Label htmlFor="order-search">Search orders</Label>
            <div className="relative">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ground-400"
              />
              <Input
                id="order-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
                placeholder="Search by order number"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="range-filter">Range</Label>
            <Select value={rangeFilter} onValueChange={setRangeFilter}>
              <SelectTrigger id="range-filter">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Last 12 months">Last 12 months</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button variant="outline" className="w-full lg:w-auto">
              <Settings2 size={16} />
              Apply filters
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Variant 1" />
          <PreviewBlock
            title="Invoice list"
            description="A compact invoice list with product thumbnails, totals, and invoice actions."
            code={invoiceListSource}
            previewClassName="p-0"
          >
            <InvoiceList />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 2" />
          <PreviewBlock
            title="Invoice list with quick actions"
            description="Each order row includes a contextual menu for managing or downloading the invoice."
            code={invoiceListQuickActionsSource}
            previewClassName="p-0"
          >
            <InvoiceListQuickActions />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 3" />
          <PreviewBlock
            title="Invoice panels"
            description="Orders displayed as individual panels with product lists and a management action."
            code={invoicePanelsSource}
            previewClassName="p-0"
          >
            <InvoicePanels />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 4" />
          <PreviewBlock
            title="Invoice table"
            description="A table layout for customers who need fast scanning across many orders."
            code={invoiceTableSource}
            previewClassName="p-0"
          >
            <InvoiceTable />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/order-history/")({
  head: () => createCatalogPageHead("/ecommerce/order-history/"),
  component: OrderHistoryPage,
});
