
import { ChevronRight, Mail, CheckCircle } from "lucide-react";
import { StackedList, StackedListItem } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  <StackedListItem href="#">
    <p className="body font-medium text-ground-900">Ricardo Cooper</p>
    <p className="caption text-ground-400">Backend Developer</p>
  </StackedListItem>
  <StackedListItem href="#">
    <p className="body font-medium text-ground-900">Kristen Ramos</p>
    <p className="caption text-ground-400">Product Manager</p>
  </StackedListItem>
</StackedList>`,

  withAvatar: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  {people.map((person) => (
    <StackedListItem key={person.email} href="#">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white body font-medium">
          {person.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="body font-semibold text-ground-900 truncate">{person.name}</p>
          <p className="caption text-ground-400 truncate">{person.email}</p>
        </div>
        <ChevronRight size={14} className="shrink-0 text-ground-300" />
      </div>
    </StackedListItem>
  ))}
</StackedList>`,

  twoColumn: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  {applications.map((app) => (
    <StackedListItem key={app.id} href="#">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="body font-semibold text-ground-900">{app.name}</p>
          <p className="caption text-ground-400">{app.stage}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{app.date}</Badge>
          <ChevronRight size={14} className="text-ground-300" />
        </div>
      </div>
    </StackedListItem>
  ))}
</StackedList>`,
};

const PEOPLE = [
  { name: "Ricardo Cooper", email: "ricardo.cooper@example.com", initials: "RC", stage: "Completed phone screening", date: "Jan 7" },
  { name: "Kristen Ramos", email: "kristen.ramos@example.com", initials: "KR", stage: "Interview scheduled", date: "Jan 9" },
  { name: "Ted Fox", email: "ted.fox@example.com", initials: "TF", stage: "Offer sent", date: "Jan 12" },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function StackedListPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Stacked List</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Stacked List</h1>
        <p className="body max-w-md text-ground-400">
          A vertically stacked list of rows, each with consistent padding and optional hover/link behavior. The composition of StackedList and StackedListItem.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Badge · Avatar</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Stacked List · Basic" />
          <PreviewBlock title="Simple rows" description="Name and description per row" code={CODE.basic} previewClassName="items-start">
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <p className="body font-medium text-ground-900">{p.name}</p>
                    <p className="caption text-ground-400">{p.email}</p>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stacked List · With avatar" />
          <PreviewBlock title="Avatar + name + email" description="Each row has an inline avatar and meta" code={CODE.withAvatar} previewClassName="items-start">
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white body font-medium">
                        {p.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="body font-semibold text-ground-900 truncate">{p.name}</p>
                        <p className="caption text-ground-400 truncate">{p.email}</p>
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-ground-300" />
                    </div>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stacked List · Two column" />
          <PreviewBlock title="Content + meta on right" description="Dates, badges, or statuses on the right side" code={CODE.twoColumn} previewClassName="items-start">
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="body font-semibold text-ground-900 truncate">{p.name}</p>
                        <p className="caption text-ground-400">{p.stage}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="secondary">{p.date}</Badge>
                        <ChevronRight size={14} className="text-ground-300" />
                      </div>
                    </div>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
