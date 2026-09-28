import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { FormatProvider, PaginationBar } from "@hilum/ui";
import { useState as usePageState } from "react";

const CODE = {
  pagination: `import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "@hilum/ui"

<Pagination>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
    <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationLink href="#">8</PaginationLink></PaginationItem>
    <PaginationItem><PaginationNext href="#" /></PaginationItem>
  </PaginationContent>
</Pagination>`,
};

const BAR_CODE = `import { PaginationBar } from "@hilum/ui"

// "Showing 21–40 of 124 orders" + Previous / Next. Cursor APIs: omit total, pass hasNextPage.
<PaginationBar page={page} pageSize={20} total={124} itemLabel="order" onPageChange={setPage} />`;

function PaginationBarDemo() {
  const [page, setPage] = usePageState(2);
  return (
    <div className="w-full max-w-xl">
      <PaginationBar
        page={page}
        pageSize={20}
        total={124}
        itemLabel="order"
        onPageChange={setPage}
      />
    </div>
  );
}

const LOCALIZED_CODE = `import { FormatProvider, PaginationBar } from "@hilum/ui"

// Every string is a label; numbers and plurals follow the FormatProvider locale.
<FormatProvider locale="es-ES">
  <PaginationBar
    page={page}
    pageSize={20}
    total={12480}
    itemLabel="pedido"
    onPageChange={setPage}
    labels={{
      summary: ({ start, end, total, noun }) => \`Mostrando \${start}–\${end} de \${total} \${noun}\`,
      previous: "Anterior",
      next: "Siguiente",
      previousPage: "Ir a la página anterior",
      nextPage: "Ir a la página siguiente",
      navigation: "Paginación",
    }}
  />
</FormatProvider>`;

function LocalizedPaginationBarDemo() {
  const [page, setPage] = usePageState(3);
  return (
    <div className="w-full max-w-xl">
      <FormatProvider locale="es-ES">
        <PaginationBar
          page={page}
          pageSize={20}
          total={12480}
          itemLabel="pedido"
          onPageChange={setPage}
          labels={{
            summary: ({ start, end, total, noun }) =>
              `Mostrando ${start}–${end} de ${total} ${noun}`,
            previous: "Anterior",
            next: "Siguiente",
            previousPage: "Ir a la página anterior",
            nextPage: "Ir a la página siguiente",
            navigation: "Paginación",
          }}
        />
      </FormatProvider>
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function PaginationPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Pagination</span>
        </div>
        <h1 className="display mb-2 text-foreground">Pagination</h1>
        <p className="body max-w-lg text-muted-foreground">
          Navigation control for multi-page content.
        </p>
      </div>

      <PageDocs path="/atoms/pagination/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Pagination" />

        <PreviewBlock
          title="Default"
          description="Page navigation with prev / next controls"
          code={CODE.pagination}
          previewClassName="flex-col"
        >
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">8</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </PreviewBlock>
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Pagination Bar</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Summary + previous/next"
            description="Compact list footer with a pluralized, localized summary."
            code={BAR_CODE}
          >
            <PaginationBarDemo />
          </PreviewBlock>
        </section>
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Localized</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Labels + FormatProvider"
            description="No hard-coded English: summary, button text and accessible names come from labels; numbers use Intl."
            code={LOCALIZED_CODE}
          >
            <LocalizedPaginationBarDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/pagination/")({
  head: () => createCatalogPageHead("/atoms/pagination/"),
  component: PaginationPage,
});
