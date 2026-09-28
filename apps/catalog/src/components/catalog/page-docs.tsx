import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@hilum/ui";
import { pageDocs } from "@/generated/catalog-docs";
import {
  componentProps,
  type CatalogComponentProp,
  type CatalogComponentPropsDoc,
} from "@/generated/component-props";
import type { CatalogDocApiItem, CatalogDocLink, CatalogPageDoc } from "@/lib/catalog-docs";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="label text-muted-foreground">{children}</h2>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-xl border border-border bg-background p-6 shadow-natural">
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="body text-muted-foreground">
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
          className="rounded-xl border border-border bg-muted px-4 py-3 transition-colors hover:border-border hover:bg-background"
        >
          <p className="body font-medium text-foreground">{item.label}</p>
          {item.description ? (
            <p className="caption mt-1 text-muted-foreground">{item.description}</p>
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
          className="min-w-0 rounded-xl border border-border bg-muted px-4 py-3"
        >
          <p className="body font-medium text-foreground">{item.label}</p>
          <p className="caption mt-1 break-words text-muted-foreground">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

type PropsComponent = CatalogComponentPropsDoc["components"][number];

function PropName({ prop }: { prop: CatalogComponentProp }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <code className="font-mono caption font-medium text-foreground">{prop.name}</code>
      {prop.required ? (
        <span className="rounded-sm bg-destructive/10 px-1.5 py-0.5 caption-xs font-medium text-destructive">
          required
        </span>
      ) : null}
    </span>
  );
}

function PropType({ type }: { type: string }) {
  return <code className="font-mono caption break-words text-muted-foreground">{type}</code>;
}

function PropDefault({ value }: { value: string | null }) {
  return value ? (
    <code className="font-mono caption break-words text-foreground">{value}</code>
  ) : (
    <span className="caption text-muted-foreground" aria-label="No default">
      —
    </span>
  );
}

/** Desktop: a real table. Mobile: one stacked card per prop (no sideways scroll). */
function PropsList({ component }: { component: PropsComponent }) {
  const { props, inherits } = component;

  return (
    <div className="min-w-0 space-y-3">
      {props.length > 0 ? (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[22%] caption">Prop</TableHead>
                  <TableHead className="w-[30%] caption">Type</TableHead>
                  <TableHead className="w-[14%] caption">Default</TableHead>
                  <TableHead className="caption">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.map((prop, index) => (
                  <TableRow key={prop.name} index={index}>
                    <TableCell className="align-top">
                      <PropName prop={prop} />
                    </TableCell>
                    <TableCell className="align-top">
                      <PropType type={prop.type} />
                    </TableCell>
                    <TableCell className="align-top">
                      <PropDefault value={prop.default} />
                    </TableCell>
                    <TableCell className="align-top caption">
                      {prop.description || <span aria-label="No description">—</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <ul className="space-y-2 md:hidden">
            {props.map((prop) => (
              <li
                key={prop.name}
                className="min-w-0 rounded-xl border border-border bg-muted px-4 py-3"
              >
                <PropName prop={prop} />
                <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1">
                  <dt className="caption text-muted-foreground">Type</dt>
                  <dd className="min-w-0">
                    <PropType type={prop.type} />
                  </dd>
                  <dt className="caption text-muted-foreground">Default</dt>
                  <dd className="min-w-0">
                    <PropDefault value={prop.default} />
                  </dd>
                </dl>
                {prop.description ? (
                  <p className="caption mt-2 text-muted-foreground">{prop.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="caption text-muted-foreground">No component-specific props.</p>
      )}

      {inherits ? <p className="caption text-muted-foreground">{inherits}</p> : null}
    </div>
  );
}

function PropsReference({ doc }: { doc: CatalogComponentPropsDoc }) {
  // Page's primary component first, then the rest in source order.
  const components = [...doc.components].sort(
    (a, b) => Number(b.name === doc.primary) - Number(a.name === doc.primary),
  );
  const [first, ...rest] = components;
  if (!first) return null;

  return (
    <section className="mb-10 min-w-0" aria-labelledby="props-reference">
      <Card>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 id="props-reference" className="label text-muted-foreground">
            Props
          </h2>
          <p className="caption break-all text-muted-foreground">
            <code className="font-mono">{doc.package}</code> · {doc.source}
          </p>
        </div>

        <div className="mt-4 space-y-6">
          <div className="min-w-0 space-y-3">
            <h3 className="subheading text-foreground">{first.name}</h3>
            <PropsList component={first} />
          </div>

          {rest.map((component) => (
            <details key={component.name} className="group min-w-0 border-t border-border pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md">
                <span className="subheading text-foreground">{component.name}</span>
                <span className="caption text-muted-foreground">
                  {component.props.length} {component.props.length === 1 ? "prop" : "props"}
                  <span
                    aria-hidden="true"
                    className="ml-2 inline-block transition-transform group-open:rotate-90"
                  >
                    ›
                  </span>
                </span>
              </summary>
              <div className="mt-3">
                <PropsList component={component} />
              </div>
            </details>
          ))}
        </div>
      </Card>
    </section>
  );
}

function ExampleCode({ code }: { code: string }) {
  return (
    <pre className="max-w-full overflow-x-auto rounded-xl bg-ground-950 px-5 py-5 caption leading-relaxed text-ground-300">
      <code className="font-mono">{code}</code>
    </pre>
  );
}

function ComponentDocBlock({
  doc,
  propsDoc,
}: {
  doc: Extract<CatalogPageDoc, { kind: "component" }>;
  propsDoc: CatalogComponentPropsDoc | undefined;
}) {
  // With extracted props, the full table below replaces the summary API list.
  const showApiList = !propsDoc;
  const hasSideColumn = showApiList || Boolean(doc.exampleCode);

  return (
    <>
      <section
        className={
          hasSideColumn
            ? "mb-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]"
            : "mb-10 min-w-0"
        }
      >
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

        {hasSideColumn ? (
          <div className="min-w-0 space-y-6">
            {showApiList ? (
              <Card>
                <SectionLabel>Key Props / API</SectionLabel>
                <div className="mt-3">
                  <ApiList items={doc.api} />
                </div>
              </Card>
            ) : null}

            {doc.exampleCode ? (
              <Card>
                <SectionLabel>Example Code</SectionLabel>
                <div className="mt-3">
                  <ExampleCode code={doc.exampleCode} />
                </div>
              </Card>
            ) : null}
          </div>
        ) : null}
      </section>

      {propsDoc ? <PropsReference doc={propsDoc} /> : null}
    </>
  );
}

function CollectionDocBlock({
  doc,
}: {
  doc: Extract<CatalogPageDoc, { kind: "collection" | "section" }>;
}) {
  return (
    <section className="mb-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
      <Card>
        <div className="space-y-6">
          <div>
            <SectionLabel>How To Use This Page</SectionLabel>
            <div className="mt-3 space-y-3">
              {doc.intro.map((paragraph) => (
                <p key={paragraph} className="body text-muted-foreground">
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
    return <ComponentDocBlock doc={doc} propsDoc={componentProps[path]} />;
  }

  return <CollectionDocBlock doc={doc} />;
}
