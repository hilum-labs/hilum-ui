import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown, Trash2 } from "lucide-react";
import {
  Table, TableHeader, TableBody, TableFooter,
  TableRow, TableHead, TableCell, TableCaption,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { cn } from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Shared data                                                        */
/* ------------------------------------------------------------------ */

const generations = [
  { id: 1, voice: "Roger", text: "The quick brown fox jumps over the lazy dog.", duration: "0:08", status: "Done" as const },
  { id: 2, voice: "Aria", text: "Welcome to ElevenLabs, the leading AI voice platform.", duration: "0:12", status: "Done" as const },
  { id: 3, voice: "Sarah", text: "Generating expressive narration for chapter three...", duration: "—", status: "Processing" as const },
  { id: 4, voice: "Charlie", text: "Error: audio sample rate mismatch detected.", duration: "—", status: "Failed" as const },
  { id: 5, voice: "Marcus", text: "Voice synthesis complete for the audiobook project.", duration: "0:19", status: "Done" as const },
];

const members = [
  { id: 1, name: "Sarah Parker",  email: "s.parker@acme.com",   role: "Designer",       dept: "Product",     status: "Active",   initials: "SP", color: "bg-brand-primary",  textColor: "text-white"      },
  { id: 2, name: "George Lin",    email: "g.lin@acme.com",      role: "Engineer",       dept: "Engineering", status: "Active",   initials: "GL", color: "bg-brand-secondary",    textColor: "text-ground-900" },
  { id: 3, name: "Ana Portillo",  email: "a.portillo@acme.com", role: "Product Manager",dept: "Product",     status: "On leave", initials: "AP", color: "bg-brand-secondary",  textColor: "text-ground-900" },
  { id: 4, name: "Lucas Meyer",   email: "l.meyer@acme.com",    role: "Engineer",       dept: "Engineering", status: "Active",   initials: "LM", color: "bg-ground-900",     textColor: "text-white"      },
  { id: 5, name: "Emma Chen",     email: "e.chen@acme.com",     role: "Designer",       dept: "Brand",       status: "Active",   initials: "EC", color: "bg-brand-primary",  textColor: "text-white"      },
];

const invoiceLines = [
  { description: "Design system audit", hrs: 12, rate: 150, amount: 1800 },
  { description: "Component library build", hrs: 40, rate: 150, amount: 6000 },
  { description: "Documentation & handoff", hrs: 8, rate: 150, amount: 1200 },
];
const subtotal = invoiceLines.reduce((s, l) => s + l.amount, 0);
const tax = subtotal * 0.2;
const total = subtotal + tax;

const transactions = [
  { id: "TXN-8821", company: "Acme Corp",     type: "Invoice",  amount: "$4,200", date: "Apr 1, 2026",  status: "Paid"    },
  { id: "TXN-8820", company: "Globex Inc.",   type: "Invoice",  amount: "$1,900", date: "Mar 28, 2026", status: "Pending" },
  { id: "TXN-8819", company: "Initech LLC",   type: "Refund",   amount: "$320",   date: "Mar 22, 2026", status: "Paid"    },
  { id: "TXN-8818", company: "Umbrella Corp", type: "Invoice",  amount: "$8,750", date: "Mar 15, 2026", status: "Overdue" },
  { id: "TXN-8817", company: "Soylent Corp",  type: "Invoice",  amount: "$2,100", date: "Mar 10, 2026", status: "Paid"    },
  { id: "TXN-8816", company: "Acme Corp",     type: "Credit",   amount: "$500",   date: "Mar 5, 2026",  status: "Paid"    },
];

const statusVariant: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  Done: "success", Active: "success",
  Processing: "warning", "On leave": "warning", Pending: "warning",
  Failed: "destructive", Overdue: "destructive",
  Paid: "secondary",
};

/* ------------------------------------------------------------------ */
/*  Code snippets                                                      */
/* ------------------------------------------------------------------ */

const CODE = {
  simple: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@hilum/ui"
import { Badge } from "@hilum/ui"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Voice</TableHead>
      <TableHead>Text</TableHead>
      <TableHead>Duration</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id}>
        <TableCell className="font-medium text-ground-900">{row.voice}</TableCell>
        <TableCell className="max-w-[200px] truncate text-ground-500">{row.text}</TableCell>
        <TableCell>{row.duration}</TableCell>
        <TableCell><Badge variant={statusVariant[row.status]}>{row.status}</Badge></TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`,

  striped: `// Alternate row background using className on TableRow
<TableBody>
  {rows.map((row, i) => (
    <TableRow key={row.id} className={i % 2 !== 0 ? "bg-ground-50" : ""}>
      ...
    </TableRow>
  ))}
</TableBody>`,

  avatars: `import { Avatar, AvatarFallback } from "@hilum/ui"

<TableBody>
  {members.map((m) => (
    <TableRow key={m.id}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <AvatarFallback className={cn(m.color, m.textColor, "font-semibold")}>{m.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-ground-900">{m.name}</p>
            <p className="caption text-ground-400">{m.email}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="body text-ground-900">{m.role}</p>
        <p className="caption text-ground-400">{m.dept}</p>
      </TableCell>
      <TableCell><Badge variant={statusVariant[m.status]}>{m.status}</Badge></TableCell>
    </TableRow>
  ))}
</TableBody>`,

  checkboxes: `// Track selected IDs with useState
const [selected, setSelected] = useState<number[]>([])
const allSelected = selected.length === rows.length
const toggle = (id: number) =>
  setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])

<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-10">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(v) => setSelected(v ? rows.map(r => r.id) : [])}
        />
      </TableHead>
      <TableHead>Name</TableHead>
      ...
    </TableRow>
  </TableHeader>
  <TableBody>
    {rows.map((row) => (
      <TableRow key={row.id} data-state={selected.includes(row.id) ? "selected" : undefined}>
        <TableCell><Checkbox checked={selected.includes(row.id)} onCheckedChange={() => toggle(row.id)} /></TableCell>
        ...
      </TableRow>
    ))}
  </TableBody>
</Table>`,

  condensed: `// Override default cell padding for a denser layout
<TableCell className="py-1.5 text-xs">
  {value}
</TableCell>`,

  grouped: `// Group rows with a spanning header row
<TableBody>
  {Object.entries(grouped).map(([group, rows]) => (
    <Fragment key={group}>
      <TableRow className="hover:bg-transparent">
        <TableHead colSpan={4} className="bg-ground-50 py-2">{group}</TableHead>
      </TableRow>
      {rows.map((row) => (
        <TableRow key={row.id}>...</TableRow>
      ))}
    </Fragment>
  ))}
</TableBody>`,

  sortable: `// Add sort state and icon to column headers
const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(null)

<TableHead>
  <button className="flex items-center gap-1 hover:text-ground-700"
    onClick={() => setSort(s => s?.col === "name" ? { col: "name", dir: s.dir === "asc" ? "desc" : "asc" } : { col: "name", dir: "asc" })}>
    Name
    <ChevronsUpDown size={12} className="text-ground-300" />
  </button>
</TableHead>`,

  sticky: `// Wrap in a fixed-height scrollable container
// Add sticky positioning to the thead
<div className="h-56 overflow-auto rounded-xl">
  <Table>
    <TableHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
      ...
    </TableHeader>
    <TableBody>...</TableBody>
  </Table>
</div>`,

  summary: `import { TableFooter } from "@hilum/ui"

<Table>
  <TableBody>
    {lines.map((line) => (
      <TableRow key={line.description}>
        <TableCell className="font-medium text-ground-900">{line.description}</TableCell>
        <TableCell className="text-right">{line.hrs}h</TableCell>
        <TableCell className="text-right">{line.rate}/hr</TableCell>
        <TableCell className="text-right font-medium">{line.amount.toLocaleString()}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3} className="text-right font-medium text-ground-500">Subtotal</TableCell>
      <TableCell className="text-right font-semibold text-ground-900">${subtotal.toLocaleString()}</TableCell>
    </TableRow>
    <TableRow>
      <TableCell colSpan={3} className="text-right font-medium text-ground-500">Total</TableCell>
      <TableCell className="text-right font-semibold text-ground-900">${total.toLocaleString()}</TableCell>
    </TableRow>
  </TableFooter>
</Table>`,
};

/* ------------------------------------------------------------------ */
/*  Interactive demos                                                  */
/* ------------------------------------------------------------------ */

function CheckboxTable() {
  const [selected, setSelected] = useState<number[]>([]);
  const allSelected = selected.length === members.length;
  const someSelected = selected.length > 0 && !allSelected;
  const toggle = (id: number) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  return (
    <div className="w-full">
      {selected.length > 0 && (
        <div className="mb-2 flex items-center gap-2 rounded-lg bg-ground-50 px-4 py-2">
          <span className="body text-ground-600">{selected.length} selected</span>
          <div className="flex-1" />
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
            <Trash2 size={13} /> Delete
          </Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                checked={allSelected}
                data-state={someSelected ? "indeterminate" : undefined}
                onCheckedChange={(v) => setSelected(v ? members.map((m) => m.id) : [])}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((m) => (
            <TableRow
              key={m.id}
              data-state={selected.includes(m.id) ? "selected" : undefined}
              className={cn(selected.includes(m.id) && "bg-ground-50")}
            >
              <TableCell>
                <Checkbox
                  checked={selected.includes(m.id)}
                  onCheckedChange={() => toggle(m.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className={cn(m.color, m.textColor, "font-semibold")}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="body font-medium text-ground-900">{m.name}</p>
                    <p className="caption text-ground-400">{m.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="body text-ground-700">{m.role}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

type SortDir = "asc" | "desc" | null;

function SortableTable() {
  const [sort, setSort] = useState<{ col: string; dir: "asc" | "desc" } | null>(null);

  const cycleSort = (col: string) =>
    setSort((s) => s?.col === col ? (s.dir === "asc" ? { col, dir: "desc" } : null) : { col, dir: "asc" });

  const SortIcon = ({ col }: { col: string }) => {
    if (sort?.col !== col) return <ChevronsUpDown size={12} className="text-ground-300" />;
    return sort.dir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  const sorted = [...transactions].sort((a, b) => {
    if (!sort) return 0;
    const av = a[sort.col as keyof typeof a];
    const bv = b[sort.col as keyof typeof b];
    return sort.dir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const cols: { key: keyof typeof transactions[0]; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "company", label: "Company" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {cols.map(({ key, label }) => (
            <TableHead key={key}>
              <button
                onClick={() => cycleSort(key)}
                className={cn(
                  "flex items-center gap-1 transition-colors hover:text-ground-700",
                  sort?.col === key && "text-ground-900"
                )}
              >
                {label}
                <SortIcon col={key} />
              </button>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="font-mono text-xs text-ground-400">{t.id}</TableCell>
            <TableCell className="font-medium text-ground-900">{t.company}</TableCell>
            <TableCell className="text-ground-500">{t.date}</TableCell>
            <TableCell className="font-medium text-ground-900">{t.amount}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[t.status] ?? "secondary"}>{t.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TablePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Table</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Table</h1>
        <p className="body max-w-lg text-ground-500">
          Structured data display with rows and columns. Supports striped rows, avatars, checkboxes, sorting, sticky headers, grouped rows, and summary footers.
        </p>
      </div>

      <PageDocs path="/atoms/table/" />

      <div className="flex flex-col gap-12">

        {/* Simple */}
        <section>
          <SectionHeading label="Simple" />
          <div className="flex flex-col gap-3">
            <PreviewBlock
              title="Default"
              description="Header, body rows, and caption"
              code={CODE.simple}
              previewClassName="flex-col items-stretch"
            >
              <Table>
                <TableCaption>Recent voice generations</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voice</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generations.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-ground-900">{row.voice}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-ground-500">{row.text}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PreviewBlock>

            <PreviewBlock
              title="Striped rows"
              description="Alternating row backgrounds for easier scanning"
              code={CODE.striped}
              previewClassName="flex-col items-stretch"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voice</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {generations.map((row, i) => (
                    <TableRow key={row.id} className={i % 2 !== 0 ? "bg-ground-50 hover:bg-ground-100/50" : ""}>
                      <TableCell className="font-medium text-ground-900">{row.voice}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-ground-500">{row.text}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PreviewBlock>

            <PreviewBlock
              title="Condensed"
              description="Reduced row height for dense data"
              code={CODE.condensed}
              previewClassName="flex-col items-stretch"
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="py-1.5 font-mono text-xs text-ground-400">{t.id}</TableCell>
                      <TableCell className="py-1.5 font-medium text-ground-900">{t.company}</TableCell>
                      <TableCell className="py-1.5 text-ground-500">{t.type}</TableCell>
                      <TableCell className="py-1.5 font-medium text-ground-900">{t.amount}</TableCell>
                      <TableCell className="py-1.5 text-ground-500">{t.date}</TableCell>
                      <TableCell className="py-1.5">
                        <Badge variant={statusVariant[t.status] ?? "secondary"}>{t.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PreviewBlock>
          </div>
        </section>

        {/* With avatars */}
        <section>
          <SectionHeading label="With avatars" />
          <PreviewBlock
            title="Avatars and multi-line content"
            description="User identity with stacked primary and secondary text"
            code={CODE.avatars}
            previewClassName="flex-col items-stretch"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">
                          <AvatarFallback className={cn(m.color, m.textColor, "font-semibold")}>
                            {m.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="body font-medium text-ground-900">{m.name}</p>
                          <p className="caption text-ground-400">{m.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="body text-ground-900">{m.role}</p>
                      <p className="caption text-ground-400">{m.dept}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[m.status]}>{m.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </PreviewBlock>
        </section>

        {/* With checkboxes */}
        <section>
          <SectionHeading label="With checkboxes" />
          <PreviewBlock
            title="Selectable rows"
            description="Select-all toggle, individual row selection, bulk action bar"
            code={CODE.checkboxes}
            previewClassName="flex-col items-stretch"
          >
            <CheckboxTable />
          </PreviewBlock>
        </section>

        {/* Grouped rows */}
        <section>
          <SectionHeading label="Grouped rows" />
          <PreviewBlock
            title="Grouped by status"
            description="Section headers span all columns to group related rows"
            code={CODE.grouped}
            previewClassName="flex-col items-stretch"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(["Paid", "Pending", "Overdue"] as const).map((group) => {
                  const rows = transactions.filter((t) => t.status === group);
                  if (!rows.length) return null;
                  return (
                    <>
                      <TableRow key={group} className="hover:bg-transparent">
                        <TableCell
                          colSpan={4}
                          className="bg-ground-50 py-2 label text-ground-500"
                        >
                          {group}
                        </TableCell>
                      </TableRow>
                      {rows.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium text-ground-900">{t.company}</TableCell>
                          <TableCell className="text-ground-500">{t.type}</TableCell>
                          <TableCell className="font-medium text-ground-900">{t.amount}</TableCell>
                          <TableCell className="text-ground-500">{t.date}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </PreviewBlock>
        </section>

        {/* Sortable headings */}
        <section>
          <SectionHeading label="Sortable headings" />
          <PreviewBlock
            title="Column sorting"
            description="Click column headers to sort ascending or descending"
            code={CODE.sortable}
            previewClassName="flex-col items-stretch"
          >
            <SortableTable />
          </PreviewBlock>
        </section>

        {/* Sticky header */}
        <section>
          <SectionHeading label="Sticky header" />
          <PreviewBlock
            title="Sticky header"
            description="Header stays visible while scrolling through long tables"
            code={CODE.sticky}
            previewClassName="flex-col items-stretch"
          >
            <Table containerClassName="max-h-56 overflow-auto rounded-xl border border-ground-100 bg-white">
              <TableHeader className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm">
                  <TableRow>
                    <TableHead>Voice</TableHead>
                    <TableHead>Text</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...generations, ...generations].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-ground-900">{row.voice}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-ground-500">{row.text}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </PreviewBlock>
        </section>

        {/* Summary rows */}
        <section>
          <SectionHeading label="With summary rows" />
          <PreviewBlock
            title="Invoice table"
            description="Footer rows for subtotals, tax, and totals using TableFooter"
            code={CODE.summary}
            previewClassName="flex-col items-stretch"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoiceLines.map((line) => (
                  <TableRow key={line.description}>
                    <TableCell className="font-medium text-ground-900">{line.description}</TableCell>
                    <TableCell className="text-right text-ground-500">{line.hrs}h</TableCell>
                    <TableCell className="text-right text-ground-500">${line.rate}/hr</TableCell>
                    <TableCell className="text-right font-medium text-ground-900">${line.amount.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right text-ground-500">Subtotal</TableCell>
                  <TableCell className="text-right font-semibold text-ground-900">${subtotal.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right text-ground-500">Tax (20%)</TableCell>
                  <TableCell className="text-right font-semibold text-ground-900">${tax.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-semibold text-ground-900">Total</TableCell>
                  <TableCell className="text-right font-semibold text-ground-900">${total.toLocaleString()}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </PreviewBlock>
        </section>

      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/table/")({
  head: () => createCatalogPageHead("/atoms/table/"),
  component: TablePage,
});
