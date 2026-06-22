import { pageDocs } from "@/generated/catalog-docs";
import type { CatalogDocApiItem, CatalogDocLink, CatalogPageDoc } from "@/lib/catalog-docs";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="label text-ground-400">{children}</h2>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-ground-100 bg-white p-6 shadow-natural">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="body text-ground-600">
          {item}
        </li>
      ))}
    </ul>
  );
}

function LinkList({ items }: { items: CatalogDocLink[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <a
          key={`${item.href}-${item.label}`}
          href={item.href}
          className="rounded-xl border border-ground-100 bg-ground-50 px-4 py-3 transition-colors hover:border-ground-200 hover:bg-white"
        >
          <p className="body font-medium text-ground-900">{item.label}</p>
          {item.description ? (
            <p className="caption mt-1 text-ground-500">{item.description}</p>
          ) : null}
        </a>
      ))}
    </div>
  );
}

function ApiList({ items }: { items: CatalogDocApiItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-ground-100 bg-ground-50 px-4 py-3"
        >
          <p className="body font-medium text-ground-900">{item.label}</p>
          <p className="caption mt-1 text-ground-500">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function ExampleCode({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl bg-ground-950 px-5 py-5 caption leading-relaxed text-ground-300">
      <code className="font-mono">{code}</code>
    </pre>
  );
}

function ComponentDocBlock({ doc }: { doc: Extract<CatalogPageDoc, { kind: "component" }> }) {
  return (
    <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card>
        <div className="space-y-6">
          <div>
            <SectionLabel>When To Use</SectionLabel>
            <div className="mt-3">
              <BulletList items={doc.whenToUse} />
            </div>
          </div>

          <div>
            <SectionLabel>When Not To Use</SectionLabel>
            <div className="mt-3">
              <BulletList items={doc.whenNotToUse} />
            </div>
          </div>

          <div>
            <SectionLabel>Accessibility Notes</SectionLabel>
            <div className="mt-3">
              <BulletList items={doc.accessibility} />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card>
          <SectionLabel>Key Props / API</SectionLabel>
          <div className="mt-3">
            <ApiList items={doc.api} />
          </div>
        </Card>

        {doc.exampleCode ? (
          <Card>
            <SectionLabel>Example Code</SectionLabel>
            <div className="mt-3">
              <ExampleCode code={doc.exampleCode} />
            </div>
          </Card>
        ) : null}
      </div>
    </section>
  );
}

function CollectionDocBlock({
  doc,
}: {
  doc: Extract<CatalogPageDoc, { kind: "collection" | "section" }>;
}) {
  return (
    <section className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card>
        <div className="space-y-6">
          <div>
            <SectionLabel>How To Use This Page</SectionLabel>
            <div className="mt-3 space-y-3">
              {doc.intro.map((paragraph) => (
                <p key={paragraph} className="body text-ground-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>How The Content Is Grouped</SectionLabel>
            <div className="mt-3">
              <BulletList items={doc.grouping} />
            </div>
          </div>
        </div>
      </Card>

      {doc.importantLinks.length > 0 ? (
        <Card>
          <SectionLabel>Start With</SectionLabel>
          <div className="mt-3">
            <LinkList items={doc.importantLinks} />
          </div>
        </Card>
      ) : null}
    </section>
  );
}

export function PageDocs({ path }: { path: string }) {
  const doc = pageDocs[path];

  if (!doc) {
    return null;
  }

  if (doc.kind === "component") {
    return <ComponentDocBlock doc={doc} />;
  }

  return <CollectionDocBlock doc={doc} />;
}
