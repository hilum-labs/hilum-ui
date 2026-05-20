
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  userProfile: `import {
  HoverCard, HoverCardTrigger, HoverCardContent,
} from "@hilum/ui"

<HoverCard>
  <HoverCardTrigger className="underline-offset-4 hover:underline cursor-pointer body text-brand-primary">
    @alexchen
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
        <span className="label font-semibold text-brand-primary">AC</span>
      </div>
      <div className="min-w-0">
        <p className="subheading text-ground-900">Alex Chen</p>
        <p className="caption text-ground-400">@alexchen</p>
        <p className="caption mt-2 text-ground-500">
          Product designer building design systems and tools.
        </p>
        <div className="mt-3 flex gap-4">
          <div>
            <p className="label font-semibold text-ground-900">248</p>
            <p className="caption-xs text-ground-400">Following</p>
          </div>
          <div>
            <p className="label font-semibold text-ground-900">1.4k</p>
            <p className="caption-xs text-ground-400">Followers</p>
          </div>
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`,

  linkPreview: `<HoverCard>
  <HoverCardTrigger className="underline-offset-4 hover:underline cursor-pointer body text-ground-900">
    The Future of Design Systems
  </HoverCardTrigger>
  <HoverCardContent>
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <div className="size-3.5 rounded-sm bg-brand-primary/20" />
        <span className="caption-xs text-ground-400">designsystems.com</span>
      </div>
      <p className="subheading text-ground-900 leading-snug">
        The Future of Design Systems
      </p>
      <p className="caption text-ground-500 leading-relaxed">
        How component libraries are evolving to meet the demands of
        AI-assisted workflows and multi-platform delivery.
      </p>
    </div>
  </HoverCardContent>
</HoverCard>`,

  multipleCards: `const users = [
  { initials: "MR", name: "Maya Reid", handle: "@mayareid", followers: "3.2k" },
  { initials: "JT", name: "Jordan Tate", handle: "@jtate", followers: "891" },
  { initials: "SP", name: "Sam Park", handle: "@sampark", followers: "5.1k" },
]

<div className="flex -space-x-2">
  {users.map((user) => (
    <HoverCard key={user.handle} openDelay={100}>
      <HoverCardTrigger asChild>
        <button className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-ground-100 cursor-pointer hover:z-10 transition-transform hover:scale-110">
          <span className="caption-xs font-semibold text-ground-600">{user.initials}</span>
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ground-100">
            <span className="caption-xs font-semibold text-ground-600">{user.initials}</span>
          </div>
          <div>
            <p className="body font-medium text-ground-900">{user.name}</p>
            <p className="caption text-ground-400">{user.handle} · {user.followers} followers</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ))}
</div>`,
};

const USERS = [
  { initials: "MR", name: "Maya Reid", handle: "@mayareid", followers: "3.2k" },
  { initials: "JT", name: "Jordan Tate", handle: "@jtate", followers: "891" },
  { initials: "SP", name: "Sam Park", handle: "@sampark", followers: "5.1k" },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function HoverCardPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Hover Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Hover Card</h1>
        <p className="body max-w-lg text-ground-500">
          Rich floating card revealed on hover, for previewing user profiles, links, and contextual details.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Variants" />
          <div className="flex flex-col gap-3">
            <PreviewBlock
              title="User Profile"
              description="Hover over a username to reveal a profile card"
              code={CODE.userProfile}
            >
              <HoverCard>
                <HoverCardTrigger className="underline-offset-4 hover:underline cursor-pointer body text-brand-primary">
                  @alexchen
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/10">
                      <span className="label font-semibold text-brand-primary">AC</span>
                    </div>
                    <div className="min-w-0">
                      <p className="subheading text-ground-900">Alex Chen</p>
                      <p className="caption text-ground-400">@alexchen</p>
                      <p className="caption mt-2 text-ground-500">
                        Product designer building design systems and tools.
                      </p>
                      <div className="mt-3 flex gap-4">
                        <div>
                          <p className="label font-semibold text-ground-900">248</p>
                          <p className="caption-xs text-ground-400">Following</p>
                        </div>
                        <div>
                          <p className="label font-semibold text-ground-900">1.4k</p>
                          <p className="caption-xs text-ground-400">Followers</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </PreviewBlock>

            <PreviewBlock
              title="Link Preview"
              description="Hover over an article link to preview its content"
              code={CODE.linkPreview}
            >
              <HoverCard>
                <HoverCardTrigger className="underline-offset-4 hover:underline cursor-pointer body text-ground-900">
                  The Future of Design Systems
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="size-3.5 rounded-sm bg-brand-primary/20" />
                      <span className="caption-xs text-ground-400">designsystems.com</span>
                    </div>
                    <p className="subheading text-ground-900 leading-snug">
                      The Future of Design Systems
                    </p>
                    <p className="caption text-ground-500 leading-relaxed">
                      How component libraries are evolving to meet the demands of
                      AI-assisted workflows and multi-platform delivery.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </PreviewBlock>

            <PreviewBlock
              title="Multiple Cards"
              description="Row of avatars — hover each to reveal a mini profile"
              code={CODE.multipleCards}
            >
              <div className="flex -space-x-2">
                {USERS.map((user) => (
                  <HoverCard key={user.handle} openDelay={100}>
                    <HoverCardTrigger asChild>
                      <button className="relative flex size-9 items-center justify-center rounded-full border-2 border-white bg-ground-100 cursor-pointer hover:z-10 transition-transform hover:scale-110 focus:outline-none">
                        <span className="caption-xs font-semibold text-ground-600">{user.initials}</span>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent side="top">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-ground-100">
                          <span className="caption-xs font-semibold text-ground-600">{user.initials}</span>
                        </div>
                        <div>
                          <p className="body font-medium text-ground-900">{user.name}</p>
                          <p className="caption text-ground-400">
                            {user.handle} · {user.followers} followers
                          </p>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ))}
              </div>
            </PreviewBlock>
          </div>
        </section>
      </div>
    </div>
  );
}
