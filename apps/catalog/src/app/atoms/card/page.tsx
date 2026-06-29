import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { AudioLines, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardMedia, CardTitle } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  cardDefault: `import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@hilum/ui"
import { Avatar, AvatarFallback } from "@hilum/ui"

<Card className="w-72">
  <CardHeader>
    <CardTitle>Student Profile</CardTitle>
    <CardDescription>
      Manage student information and track progress.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback className="bg-brand-primary text-white font-semibold">
          SP
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-ground-900">Sarah Parker</p>
        <p className="text-xs text-ground-400">Grade 10 · Class A</p>
      </div>
    </div>
  </CardContent>
</Card>`,

  cardOutlined: `{/* Outlined card — standard bordered product/admin surface */}
<Card variant="outlined" className="w-72">
  <CardHeader>
    <CardTitle>Plan summary</CardTitle>
    <CardDescription>Current usage and billing status.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-ground-500">Starter · 24 active products</p>
  </CardContent>
</Card>`,

  cardElevated: `{/* Elevated card — high-emphasis auth or focused panel surface */}
<Card variant="elevated" className="w-72">
  <CardHeader>
    <CardTitle>Secure access</CardTitle>
    <CardDescription>Authenticate before managing this workspace.</CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-ground-500">Session protected by Hilum Identity.</p>
  </CardContent>
</Card>`,

  cardFeature: `{/* Feature card — icon + label + description on gray */}
<div className="w-56 rounded-2xl bg-ground-50 p-6 flex flex-col gap-10">
  <div className="size-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
    <AudioLines size={22} strokeWidth={1.5} className="text-ground-600" />
  </div>
  <div>
    <p className="text-sm font-medium text-ground-400 mb-2">Voices</p>
    <p className="text-sm font-medium text-ground-900 leading-snug">
      Clone a replica of your own voice, design one from a prompt,
      or explore 1000s of voices from the library.
    </p>
  </div>
</div>`,

  cardIllustration: `{/* Illustration card — centered art + title + description */}
<div className="w-56 rounded-2xl bg-ground-50 p-6 flex flex-col gap-6">
  <div className="flex flex-1 items-center justify-center py-6">
    {/* Replace with your illustration */}
    <svg viewBox="0 0 100 100" className="w-28 h-28">
      {[8,18,28,38,48].map((r, i) => (
        <circle key={i} cx={5+r} cy={50} r={r}
          fill="none" stroke="#1c1917" strokeWidth="0.8" />
      ))}
      <circle cx={53} cy={50} r={53}
        fill="none" stroke="#1c1917" strokeWidth="0.8"
        strokeDasharray="2 3" />
    </svg>
  </div>
  <div>
    <p className="text-sm font-semibold text-ground-900 mb-1">Provenance</p>
    <p className="text-xs text-ground-400 leading-relaxed">
      We believe that you should know if audio is AI-generated.
    </p>
  </div>
</div>`,

  cardStats: `{/* Stats card — gray outer, white inner panel with chart */}
<div className="w-64 rounded-[2rem] bg-ground-50 p-5 flex flex-col gap-6">
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <p className="text-sm font-semibold text-ground-900">Success rate</p>
    <p className="text-2xl font-semibold text-ground-400 mt-0.5">61.5%</p>
    <svg viewBox="0 0 200 80" className="w-full mt-3">
      {/* chart lines */}
    </svg>
  </div>
  <div>
    <p className="text-sm font-medium text-ground-400 mb-1">Analytics</p>
    <p className="text-sm font-medium text-ground-900 leading-snug">
      Easily measure success rates and CX metrics, optimizing flows over time.
    </p>
  </div>
</div>`,

  cardMedia: `{/* Media/cover card — full-bleed gradient with text overlay */}
<div className="relative w-56 aspect-square rounded-2xl overflow-hidden
  bg-gradient-to-br from-brand-primary via-ground-800 to-ground-950">
  <div className="absolute inset-0 p-5 flex flex-col justify-between">
    <div className="size-8 bg-white/20 backdrop-blur-sm rounded-lg" />
    <p className="text-white text-sm font-medium leading-snug">
      ElevenLabs showcases multilingual AI voice technology with NVIDIA ACE at Computex
    </p>
  </div>
</div>`,

  cardArticle: `{/* Article card — colored header + white pill badge + title below */}
<div className="w-56 rounded-2xl overflow-hidden border border-ground-100">
  <div className="relative aspect-video
    bg-gradient-to-br from-blue-600 via-red-500/60 to-purple-700">
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-20
      [background-image:repeating-linear-gradient(0deg,transparent,transparent_30px,white_30px,white_31px),
        repeating-linear-gradient(90deg,transparent,transparent_30px,white_30px,white_31px)]" />
    <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1
      text-xs font-semibold text-ground-900 shadow-sm">
      Jan 2026
    </div>
  </div>
  <div className="bg-white px-4 py-3 border-t border-ground-100">
    <p className="text-sm font-semibold text-ground-900">Introducing Scribe v2</p>
  </div>
</div>`,

  cardBlog: `{/* Blog card — large image header + title + category/date meta */}
<div className="w-56 rounded-2xl overflow-hidden">
  <div className="aspect-square rounded-2xl overflow-hidden
    bg-gradient-to-b from-sky-300 via-teal-700 to-ground-900
    flex items-center justify-center">
    <p className="text-white text-xl font-medium text-center px-4">
      Expressive mode
    </p>
  </div>
  <div className="pt-4">
    <p className="text-sm font-semibold text-ground-900 leading-snug mb-1.5">
      Introducing Expressive Mode for ElevenAgents
    </p>
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-ground-900">Product</span>
      <span className="text-xs text-ground-400">Feb 10, 2026</span>
    </div>
  </div>
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

function CardPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Card</h1>
        <p className="body max-w-lg text-ground-500">
          Contained surface for grouping related content. Supports media, stats, and article
          layouts.
        </p>
      </div>

      <PageDocs path="/atoms/card/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Card" />

        <PreviewBlock
          title="Default"
          description="Card with header, title, description, and content"
          code={CODE.cardDefault}
          previewClassName="items-start"
        >
          <Card className="w-72">
            <CardHeader>
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>
                Manage student information and track progress across all enrolled courses.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-brand-primary font-semibold text-white">
                    SP
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-ground-900">Sarah Parker</p>
                  <p className="text-xs text-ground-400">Grade 10 · Class A</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Outlined"
          description="variant=outlined — shared bordered surface for product and admin panels"
          code={CODE.cardOutlined}
          previewClassName="items-start"
        >
          <Card variant="outlined" className="w-72">
            <CardHeader>
              <CardTitle>Plan summary</CardTitle>
              <CardDescription>Current usage and billing status.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ground-500">Starter · 24 active products</p>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Elevated"
          description="variant=elevated — shared high-emphasis surface for auth and focused panels"
          code={CODE.cardElevated}
          previewClassName="items-start"
        >
          <Card variant="elevated" className="w-72">
            <CardHeader>
              <CardTitle>Secure access</CardTitle>
              <CardDescription>Authenticate before managing this workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ground-500">Session protected by Hilum Identity.</p>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Feature"
          description="variant=muted — icon block, category label, body text"
          code={CODE.cardFeature}
        >
          <Card variant="muted" className="w-56 rounded-2xl">
            <CardContent className="flex flex-col gap-10 p-6">
              <div className="flex size-14 items-center justify-center rounded-xl bg-white shadow-sm">
                <AudioLines size={22} strokeWidth={1.5} className="text-ground-600" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-ground-400">Voices</p>
                <p className="text-sm font-medium leading-snug text-ground-900">
                  Clone a replica of your own voice, design one from a prompt, or explore 1000s of
                  voices from the library.
                </p>
              </div>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Illustration"
          description="variant=muted — centered artwork, CardTitle + CardDescription"
          code={CODE.cardIllustration}
        >
          <Card variant="muted" className="w-56 rounded-2xl">
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="flex items-center justify-center py-6">
                <svg viewBox="0 0 100 100" className="h-28 w-28">
                  {([8, 18, 28, 38, 48] as const).map((r, i) => (
                    <circle
                      key={i}
                      cx={5 + r}
                      cy={50}
                      r={r}
                      fill="none"
                      stroke="#1c1917"
                      strokeWidth="0.8"
                    />
                  ))}
                  <circle
                    cx={53}
                    cy={50}
                    r={53}
                    fill="none"
                    stroke="#1c1917"
                    strokeWidth="0.8"
                    strokeDasharray="2 3"
                  />
                </svg>
              </div>
              <div>
                <CardTitle>Provenance</CardTitle>
                <CardDescription className="mt-1">
                  We believe that you should know if audio is AI-generated.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Stats"
          description="variant=muted outer + default Card inner panel with mini chart"
          code={CODE.cardStats}
        >
          <Card variant="muted" className="w-64 rounded-[2rem]">
            <CardContent className="flex flex-col gap-6 p-5">
              <Card className="rounded-xl">
                <CardContent className="p-4">
                  <CardTitle>Success rate</CardTitle>
                  <p className="mt-0.5 text-2xl font-semibold text-ground-400">61.5%</p>
                  <svg viewBox="0 0 200 72" className="mt-3 w-full" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="200" y2="0" stroke="#f5f5f4" strokeWidth="1" />
                    <line x1="0" y1="36" x2="200" y2="36" stroke="#f5f5f4" strokeWidth="1" />
                    <line x1="0" y1="72" x2="200" y2="72" stroke="#f5f5f4" strokeWidth="1" />
                    <path
                      d="M0,20 C25,17 50,14 75,18 C100,22 125,14 150,16 C170,18 185,9 200,7 L200,72 L0,72 Z"
                      fill="rgba(251,146,60,0.12)"
                    />
                    <path
                      d="M0,20 C25,17 50,14 75,18 C100,22 125,14 150,16 C170,18 185,9 200,7"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M0,36 C25,33 50,30 75,33 C100,36 125,30 150,32 C170,34 185,28 200,30 L200,72 L0,72 Z"
                      fill="rgba(96,165,250,0.12)"
                    />
                    <path
                      d="M0,36 C25,33 50,30 75,33 C100,36 125,30 150,32 C170,34 185,28 200,30"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <rect x="130" y="8" width="56" height="30" rx="5" fill="white" />
                    <circle cx="138" cy="19" r="3" fill="#f97316" />
                    <circle cx="138" cy="30" r="3" fill="#60a5fa" />
                    <text x="144" y="22" fontSize="7" fill="#57534e" fontFamily="system-ui">
                      87.23%
                    </text>
                    <text x="144" y="33" fontSize="7" fill="#57534e" fontFamily="system-ui">
                      63.04%
                    </text>
                  </svg>
                </CardContent>
              </Card>
              <div>
                <p className="mb-1 text-sm font-medium text-ground-400">Analytics</p>
                <p className="text-sm font-medium leading-snug text-ground-900">
                  Easily measure success rates and CX metrics, optimizing flows over time.
                </p>
              </div>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Media cover"
          description="Card + CardMedia — full-bleed gradient, overlay content via CardContent"
          code={CODE.cardMedia}
        >
          <Card className="relative aspect-square w-52 overflow-hidden rounded-2xl border-0 shadow-none">
            <CardMedia className="absolute inset-0 bg-gradient-to-br from-brand-primary via-ground-800 to-ground-950">
              <div className="absolute inset-0 bg-gradient-to-tl from-black/30 via-transparent to-transparent" />
            </CardMedia>
            <CardContent className="absolute inset-0 flex flex-col justify-between p-5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <Shield size={14} className="text-white" />
              </div>
              <p className="text-sm font-medium leading-snug text-white">
                ElevenLabs showcases multilingual AI voice technology with NVIDIA ACE at Computex
              </p>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Article"
          description="Card + CardMedia header with badge overlay, CardContent below"
          code={CODE.cardArticle}
        >
          <Card className="w-52 overflow-hidden rounded-2xl">
            <CardMedia className="relative aspect-video bg-gradient-to-br from-blue-600 via-red-500/60 to-purple-700">
              <div className="absolute inset-0 opacity-20 [background-image:repeating-linear-gradient(0deg,transparent,transparent_24px,rgba(255,255,255,0.6)_24px,rgba(255,255,255,0.6)_25px),repeating-linear-gradient(90deg,transparent,transparent_24px,rgba(255,255,255,0.6)_24px,rgba(255,255,255,0.6)_25px)]" />
              <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ground-900 shadow-sm">
                Jan 2026
              </div>
            </CardMedia>
            <CardContent className="p-4">
              <CardTitle>Introducing Scribe v2</CardTitle>
            </CardContent>
          </Card>
        </PreviewBlock>

        <PreviewBlock
          title="Blog"
          description="variant=ghost — CardMedia square header, CardTitle + meta in CardContent"
          code={CODE.cardBlog}
        >
          <Card variant="ghost" className="w-52 overflow-hidden rounded-2xl">
            <CardMedia className="flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-b from-sky-300 via-teal-700 to-ground-900">
              <p className="px-4 text-center text-xl font-medium text-white">Expressive mode</p>
            </CardMedia>
            <CardContent className="px-0 pb-0 pt-4">
              <CardTitle className="mb-1.5 body font-semibold leading-snug">
                Introducing Expressive Mode for ElevenAgents
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-ground-900">Product</span>
                <span className="text-xs text-ground-400">Feb 10, 2026</span>
              </div>
            </CardContent>
          </Card>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/card/")({
  head: () => createCatalogPageHead("/atoms/card/"),
  component: CardPage,
});
