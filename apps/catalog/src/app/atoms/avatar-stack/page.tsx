
import { AvatarStack } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const AVATARS = [
  { name: "Sofia P.", fallback: "SP", colorClass: "bg-brand-primary text-white" },
  { name: "Marcus K.", fallback: "MK", colorClass: "bg-brand-secondary text-ground-900" },
  { name: "Rachel T.", fallback: "RT", colorClass: "bg-brand-secondary text-ground-900" },
  { name: "James W.", fallback: "JW", colorClass: "bg-ground-900 text-white" },
  { name: "Anna L.", fallback: "AL", colorClass: "bg-ground-400 text-white" },
  { name: "David M.", fallback: "DM", colorClass: "bg-brand-primary text-white" },
];

const CODE = {
  basic: `import { AvatarStack } from "@hilum/ui"

<AvatarStack
  avatars={[
    { name: "Sofia P.", fallback: "SP", colorClass: "bg-brand-primary text-white" },
    { name: "Marcus K.", fallback: "MK", colorClass: "bg-brand-secondary text-ground-900" },
    { name: "Rachel T.", fallback: "RT", colorClass: "bg-brand-secondary text-ground-900" },
    { name: "James W.", fallback: "JW", colorClass: "bg-ground-900 text-white" },
  ]}
/>`,

  max: `import { AvatarStack } from "@hilum/ui"

// Show 3, collapse the rest into a +N overflow badge
<AvatarStack
  avatars={avatars}
  max={3}
/>`,

  sizes: `import { AvatarStack } from "@hilum/ui"

<AvatarStack avatars={avatars} size="sm" />
<AvatarStack avatars={avatars} size="md" />
<AvatarStack avatars={avatars} size="lg" />`,

  withText: `import { AvatarStack } from "@hilum/ui"

<div className="flex items-center gap-3">
  <AvatarStack avatars={avatars} max={4} />
  <p className="body text-ground-500">
    <span className="font-semibold text-ground-900">Sofia</span> and 3 others are viewing
  </p>
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function AvatarStackPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Avatar Stack</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Avatar Stack</h1>
        <p className="body max-w-md text-ground-400">
          Overlapping avatars for showing a group of users at a glance. Supports an overflow badge when the count exceeds a maximum.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Atom</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Avatar</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Avatar Stack · Basic" />
          <PreviewBlock title="Default" description="Four stacked avatars" code={CODE.basic}>
            <AvatarStack avatars={AVATARS.slice(0, 4)} />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Avatar Stack · Overflow" />
          <PreviewBlock title="With max + overflow" description="Collapses to +N when exceeding max" code={CODE.max}>
            <div className="flex flex-col gap-4">
              <AvatarStack avatars={AVATARS} max={3} />
              <AvatarStack avatars={AVATARS} max={4} />
              <AvatarStack avatars={AVATARS} max={5} />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Avatar Stack · Sizes" />
          <PreviewBlock title="sm · md · lg" description="Three size variants" code={CODE.sizes}>
            <div className="flex flex-col gap-4">
              <AvatarStack avatars={AVATARS.slice(0, 4)} size="sm" />
              <AvatarStack avatars={AVATARS.slice(0, 4)} size="md" />
              <AvatarStack avatars={AVATARS.slice(0, 4)} size="lg" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Avatar Stack · In context" />
          <PreviewBlock title="With accompanying text" description="Stack + supporting label" code={CODE.withText}>
            <div className="flex items-center gap-3">
              <AvatarStack avatars={AVATARS} max={4} />
              <p className="body text-ground-500">
                <span className="font-semibold text-ground-900">Sofia</span> and 2 others are viewing
              </p>
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}
