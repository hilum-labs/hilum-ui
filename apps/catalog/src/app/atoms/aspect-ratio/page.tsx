import { AspectRatio } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  wide: `import { AspectRatio } from "@hilum/ui"

<div className="w-full max-w-sm">
  <AspectRatio ratio={16 / 9} className="bg-ground-100 rounded-xl flex items-center justify-center">
    <span className="label text-ground-400">16 : 9</span>
  </AspectRatio>
</div>`,

  classic: `<div className="w-full max-w-sm">
  <AspectRatio ratio={4 / 3} className="bg-ground-100 rounded-xl flex items-center justify-center">
    <span className="label text-ground-400">4 : 3</span>
  </AspectRatio>
</div>`,

  square: `<div className="w-full max-w-sm">
  <AspectRatio ratio={1} className="bg-ground-100 rounded-xl flex items-center justify-center">
    <span className="label text-ground-400">1 : 1</span>
  </AspectRatio>
</div>`,

  portrait: `<div className="w-full max-w-sm">
  <AspectRatio ratio={2 / 3} className="rounded-xl overflow-hidden">
    <div className="h-full w-full bg-gradient-to-b from-ground-100 to-ground-200 flex items-center justify-center">
      <span className="label text-ground-500">2 : 3 Portrait</span>
    </div>
  </AspectRatio>
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

export default function AspectRatioPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Aspect Ratio</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Aspect Ratio</h1>
        <p className="body max-w-lg text-ground-500">
          Constrains content to a fixed width-to-height ratio — useful for images, videos, and media embeds.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Variants" />
          <div className="flex flex-col gap-3">
            <PreviewBlock
              title="16:9"
              description="Widescreen video and image ratio"
              code={CODE.wide}
            >
              <div className="w-full max-w-sm">
                <AspectRatio
                  ratio={16 / 9}
                  className="rounded-xl bg-ground-100 flex items-center justify-center"
                >
                  <span className="label text-ground-400">16 : 9</span>
                </AspectRatio>
              </div>
            </PreviewBlock>

            <PreviewBlock
              title="4:3"
              description="Classic photo and presentation ratio"
              code={CODE.classic}
            >
              <div className="w-full max-w-sm">
                <AspectRatio
                  ratio={4 / 3}
                  className="rounded-xl bg-ground-100 flex items-center justify-center"
                >
                  <span className="label text-ground-400">4 : 3</span>
                </AspectRatio>
              </div>
            </PreviewBlock>

            <PreviewBlock
              title="1:1"
              description="Square — ideal for avatars and thumbnails"
              code={CODE.square}
            >
              <div className="w-full max-w-sm">
                <AspectRatio
                  ratio={1}
                  className="rounded-xl bg-ground-100 flex items-center justify-center"
                >
                  <span className="label text-ground-400">1 : 1</span>
                </AspectRatio>
              </div>
            </PreviewBlock>

            <PreviewBlock
              title="Portrait 2:3"
              description="Tall portrait format for cards and posters"
              code={CODE.portrait}
            >
              <div className="w-full max-w-sm">
                <AspectRatio ratio={2 / 3} className="rounded-xl overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-b from-ground-100 to-ground-200 flex items-center justify-center">
                    <span className="label text-ground-500">2 : 3 Portrait</span>
                  </div>
                </AspectRatio>
              </div>
            </PreviewBlock>
          </div>
        </section>
      </div>
    </div>
  );
}
