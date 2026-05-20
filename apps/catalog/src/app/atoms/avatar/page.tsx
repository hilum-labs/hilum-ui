
import { Avatar, AvatarFallback, AvatarWithStatus } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  avatarSizes: `import { Avatar, AvatarFallback, AvatarImage } from "@hilum/ui"

// size prop: "xs" | "sm" | "md" | "lg" | "xl"
<Avatar size="xs"><AvatarFallback>SP</AvatarFallback></Avatar>
<Avatar size="sm"><AvatarFallback>SP</AvatarFallback></Avatar>
<Avatar><AvatarFallback>SP</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>SP</AvatarFallback></Avatar>
<Avatar size="xl"><AvatarFallback>SP</AvatarFallback></Avatar>`,

  avatarColors: `import { Avatar, AvatarFallback } from "@hilum/ui"

<Avatar>
  <AvatarFallback className="bg-brand-primary text-white font-semibold">
    SP
  </AvatarFallback>
</Avatar>
<Avatar>
  <AvatarFallback className="bg-brand-secondary text-ground-900 font-semibold">
    GL
  </AvatarFallback>
</Avatar>
<Avatar>
  <AvatarFallback className="bg-brand-secondary text-ground-900 font-semibold">
    AP
  </AvatarFallback>
</Avatar>`,

  avatarStatus: `import { AvatarWithStatus, AvatarFallback } from "@hilum/ui"

<AvatarWithStatus status="online">
  <AvatarFallback>KB</AvatarFallback>
</AvatarWithStatus>
<AvatarWithStatus status="away">
  <AvatarFallback>AM</AvatarFallback>
</AvatarWithStatus>
<AvatarWithStatus status="busy">
  <AvatarFallback>LM</AvatarFallback>
</AvatarWithStatus>
<AvatarWithStatus status="offline">
  <AvatarFallback>JD</AvatarFallback>
</AvatarWithStatus>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function AvatarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Avatar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Avatar</h1>
        <p className="body max-w-lg text-ground-500">
          User representations with image, fallback, and optional status indicator.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Avatar" />

        <PreviewBlock
          title="Sizes"
          description="xs · sm · md (default) · lg · xl"
          code={CODE.avatarSizes}
        >
          <div className="flex items-end gap-3">
            <Avatar size="xs">
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <Avatar size="sm">
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <Avatar size="xl">
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Colored fallbacks"
          description="Color-coded for user identification"
          code={CODE.avatarColors}
        >
          <Avatar>
            <AvatarFallback className="bg-brand-primary font-semibold text-white">
              SP
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">
              GL
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">
              AP
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-ground-900 font-semibold text-white">
              LM
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">
              EC
            </AvatarFallback>
          </Avatar>
        </PreviewBlock>

        <SectionHeading label="Avatar · Status" />

        <PreviewBlock
          title="Status indicator"
          description="online · away · busy · offline"
          code={CODE.avatarStatus}
        >
          <AvatarWithStatus status="online">
            <AvatarFallback className="bg-brand-primary font-semibold text-white">KB</AvatarFallback>
          </AvatarWithStatus>
          <AvatarWithStatus status="away">
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">AM</AvatarFallback>
          </AvatarWithStatus>
          <AvatarWithStatus status="busy">
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">LM</AvatarFallback>
          </AvatarWithStatus>
          <AvatarWithStatus status="offline">
            <AvatarFallback>JD</AvatarFallback>
          </AvatarWithStatus>
          <AvatarWithStatus status="online" size="lg">
            <AvatarFallback className="bg-brand-secondary font-semibold text-ground-900">EC</AvatarFallback>
          </AvatarWithStatus>
        </PreviewBlock>
      </div>
    </div>
  );
}
