import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { FileText, Image as ImageIcon } from "lucide-react";
import { MediaObject } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const IMG_PLACEHOLDER = (
  <div className="flex size-16 items-center justify-center rounded-lg border border-ground-200 bg-ground-50 text-ground-300">
    <ImageIcon size={24} />
  </div>
);

const CODE = {
  basic: `import { MediaObject } from "@hilum/ui"

<MediaObject media={<img className="size-16 rounded-lg" src="..." alt="" />}>
  <h4 className="heading text-ground-900">Lorem ipsum</h4>
  <p className="mt-1 body text-ground-500">
    Repudiandae sint consequuntur vel. Amet ut nobis explicabo numquam
    expedita quia omnis voluptatem.
  </p>
</MediaObject>`,

  right: `import { MediaObject } from "@hilum/ui"

<MediaObject
  media={<img className="size-16 rounded-lg" src="..." alt="" />}
  mediaPosition="right"
>
  <h4 className="heading text-ground-900">Media on right</h4>
  <p className="mt-1 body text-ground-500">Content on the left, image on the right.</p>
</MediaObject>`,

  center: `import { MediaObject } from "@hilum/ui"

<MediaObject
  media={<Avatar size="md"><AvatarFallback className="bg-brand-primary text-white">SP</AvatarFallback></Avatar>}
  align="center"
  gap="sm"
>
  <p className="body font-semibold text-ground-900">Sofia P.</p>
  <p className="caption text-ground-400">sofia@example.com</p>
</MediaObject>`,

  comment: `import { MediaObject } from "@hilum/ui"

<div className="flex flex-col gap-4">
  {comments.map((c) => (
    <MediaObject key={c.id} media={<Avatar size="sm">...</Avatar>} align="top" gap="sm">
      <p className="body font-medium text-ground-900">{c.author}</p>
      <p className="caption text-ground-400">{c.time}</p>
      <p className="mt-1 body text-ground-600">{c.text}</p>
    </MediaObject>
  ))}
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

const COMMENTS = [
  { id: 1, author: "Bethany Blake", time: "2 hours ago", text: "This is looking great! I especially love the updated color palette — it feels much more cohesive.", initials: "BB", color: "bg-brand-primary text-white" },
  { id: 2, author: "Tom Cook", time: "45 minutes ago", text: "Agreed. The typography hierarchy is a big improvement. Ready to merge.", initials: "TC", color: "bg-brand-secondary text-ground-900" },
  { id: 3, author: "Martha Gardner", time: "10 minutes ago", text: "Shipped to staging! Let me know if there are any issues.", initials: "MG", color: "bg-ground-900 text-white" },
];

function MediaObjectPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Media Object</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Media Object</h1>
        <p className="body max-w-md text-ground-400">
          A layout primitive pairing a fixed media element (image, avatar, icon) with a flexible text block. The foundation of comment threads, feeds, and profile rows.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Avatar · Icon</p>
        </div>
      </div>

      <PageDocs path="/molecules/media-object/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Media Object · Basic" />
          <PreviewBlock title="Left media" description="Image on the left, content on the right" code={CODE.basic} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <MediaObject media={IMG_PLACEHOLDER}>
                <h4 className="heading text-ground-900">Lorem ipsum</h4>
                <p className="mt-1 body text-ground-500">
                  Repudiandae sint consequuntur vel. Amet ut nobis explicabo numquam expedita quia omnis voluptatem.
                </p>
              </MediaObject>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Media Object · Right" />
          <PreviewBlock title="Media on right" description="mediaPosition='right'" code={CODE.right} previewClassName="items-start">
            <div className="w-full max-w-lg">
              <MediaObject media={IMG_PLACEHOLDER} mediaPosition="right">
                <h4 className="heading text-ground-900">Media on the right</h4>
                <p className="mt-1 body text-ground-500">
                  Content flows on the left, with the image anchored to the right side.
                </p>
              </MediaObject>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Media Object · Centered" />
          <PreviewBlock title="Center-aligned avatar" description="Avatar + name/email row" code={CODE.center} previewClassName="items-start">
            <div className="w-full max-w-sm flex flex-col gap-3">
              {COMMENTS.map((c) => (
                <MediaObject
                  key={c.id}
                  media={
                    <Avatar size="md">
                      <AvatarFallback className={c.color}>{c.initials}</AvatarFallback>
                    </Avatar>
                  }
                  align="center"
                  gap="sm"
                >
                  <p className="body font-semibold text-ground-900">{c.author}</p>
                  <p className="caption text-ground-400">{c.time}</p>
                </MediaObject>
              ))}
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Media Object · Comment thread" />
          <PreviewBlock title="Comment list" description="Common pattern: avatar + author + content" code={CODE.comment} previewClassName="items-start">
            <div className="w-full max-w-lg flex flex-col gap-5">
              {COMMENTS.map((c) => (
                <MediaObject
                  key={c.id}
                  media={
                    <Avatar size="sm">
                      <AvatarFallback className={c.color}>{c.initials}</AvatarFallback>
                    </Avatar>
                  }
                  align="top"
                  gap="sm"
                >
                  <div className="flex items-baseline gap-2">
                    <p className="body font-semibold text-ground-900">{c.author}</p>
                    <span className="caption text-ground-400">{c.time}</span>
                  </div>
                  <p className="mt-1 body text-ground-600">{c.text}</p>
                </MediaObject>
              ))}
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/media-object/")({
  head: () => createCatalogPageHead("/molecules/media-object/"),
  component: MediaObjectPage,
});
