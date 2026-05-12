
import {
  Briefcase,
  ImageIcon,
  Lightbulb,
  Rocket,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { PreviewBlock } from "@/components/catalog/preview-block";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Section heading                                                     */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Slide data                                                          */
/* ------------------------------------------------------------------ */

const IMAGE_SLIDES = [
  { bg: "bg-taupe-100", label: "Slide 1", Icon: ImageIcon },
  { bg: "bg-brand-primary/10", label: "Slide 2", Icon: Star },
  { bg: "bg-brand-secondary/20", label: "Slide 3", Icon: Zap },
  { bg: "bg-brand-secondary/40", label: "Slide 4", Icon: Rocket },
  { bg: "bg-taupe-200", label: "Slide 5", Icon: Shield },
];

const CARD_SLIDES = [
  {
    Icon: Zap,
    title: "Lightning Fast",
    lines: ["Optimised for performance", "from first byte to last render."],
  },
  {
    Icon: Shield,
    title: "Secure by Default",
    lines: ["End-to-end encryption", "with zero-trust architecture."],
  },
  {
    Icon: Rocket,
    title: "Ship Faster",
    lines: ["Pre-built components", "so your team moves at speed."],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "This design system cut our front-end development time in half. Every component is thoughtfully crafted and a joy to work with.",
    name: "Sofia Andersson",
    role: "Lead Designer, Nordlight",
  },
  {
    quote:
      "Finally, a component library that feels truly cohesive. The visual language is consistent and beautiful across every single atom.",
    name: "Marcus Chen",
    role: "CTO, Fieldwork Studio",
  },
  {
    quote:
      "The Tailwind v4 integration is seamless. We dropped it into our existing project and it just worked — instantly.",
    name: "Priya Nair",
    role: "Frontend Engineer, Solace Labs",
  },
  {
    quote:
      "Incredible attention to detail. From shadow levels to typography utilities, everything is intentional and perfectly scaled.",
    name: "Tomás Rivera",
    role: "Product Designer, Helio",
  },
];

const VERTICAL_SLIDES = [
  {
    initials: "SA",
    bg: "bg-brand-primary/10",
    color: "text-brand-primary",
    name: "Sofia Andersson",
    role: "Lead Designer",
  },
  {
    initials: "MC",
    bg: "bg-brand-secondary/20",
    color: "text-taupe-700",
    name: "Marcus Chen",
    role: "CTO",
  },
  {
    initials: "PN",
    bg: "bg-brand-secondary/40",
    color: "text-taupe-700",
    name: "Priya Nair",
    role: "Frontend Engineer",
  },
  {
    initials: "TR",
    bg: "bg-taupe-100",
    color: "text-taupe-700",
    name: "Tomás Rivera",
    role: "Product Designer",
  },
  {
    initials: "AL",
    bg: "bg-brand-primary/10",
    color: "text-brand-primary",
    name: "Aiko Lindqvist",
    role: "Engineering Manager",
  },
];

/* ------------------------------------------------------------------ */
/*  Code snippets                                                       */
/* ------------------------------------------------------------------ */

const CODE = {
  imageCarousel: `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@hilum/ui";

<div className="w-full px-12">
  <Carousel opts={{ loop: true }}>
    <CarouselContent>
      {slides.map((slide, i) => (
        <CarouselItem key={i}>
          <div className={\`aspect-square rounded-2xl \${slide.bg} flex items-center justify-center\`}>
            <slide.Icon className="size-10 text-taupe-400" />
            <span className="body text-taupe-500 ml-2">{slide.label}</span>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,

  cardCarousel: `<div className="w-full px-12">
  <Carousel>
    <CarouselContent>
      {cards.map((card, i) => (
        <CarouselItem key={i} className="basis-1/3">
          <div className="bg-white rounded-xl border border-taupe-100 p-5 shadow-natural">
            <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-brand-primary/10">
              <card.Icon className="size-4 text-brand-primary" />
            </div>
            <p className="subheading text-taupe-900 mb-1">{card.title}</p>
            {card.lines.map((l, j) => (
              <p key={j} className="caption text-taupe-400">{l}</p>
            ))}
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,

  testimonialCarousel: `<div className="w-full px-12">
  <Carousel>
    <CarouselContent>
      {testimonials.map((t, i) => (
        <CarouselItem key={i}>
          <div className="bg-taupe-50 rounded-2xl p-8">
            <p className="body text-taupe-700 italic mb-4">"{t.quote}"</p>
            <p className="subheading text-taupe-900">{t.name}</p>
            <p className="caption text-taupe-400">{t.role}</p>
          </div>
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,

  verticalCarousel: `<div className="w-full px-12">
  <Carousel opts={{ axis: "y" }} orientation="vertical">
    <div className="h-[300px]">
      <CarouselContent className="h-[300px]">
        {people.map((person, i) => (
          <CarouselItem key={i}>
            <div className="flex items-center gap-3 rounded-xl border border-taupe-100 bg-white p-3 shadow-natural">
              <div className={\`flex size-9 shrink-0 items-center justify-center rounded-full \${person.bg}\`}>
                <span className={\`label \${person.color}\`}>{person.initials}</span>
              </div>
              <div>
                <p className="subheading text-taupe-900">{person.name}</p>
                <p className="caption text-taupe-400">{person.role}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </div>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</div>`,
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function CarouselPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Carousel</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Carousel</h1>
        <p className="body max-w-lg text-taupe-500">
          A scrollable slide container built on Embla Carousel. Supports looping,
          multi-item views, and vertical orientation.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Carousel" />

        {/* 1. Image carousel */}
        <PreviewBlock
          title="Image Carousel"
          description="Looping image placeholders with prev/next arrows"
          code={CODE.imageCarousel}
          previewClassName="py-10"
        >
          <div className="w-full px-12">
            <Carousel opts={{ loop: true }}>
              <CarouselContent>
                {IMAGE_SLIDES.map((slide, i) => (
                  <CarouselItem key={i}>
                    <div
                      className={`aspect-square rounded-2xl ${slide.bg} flex flex-col items-center justify-center gap-2`}
                    >
                      <slide.Icon className="size-10 text-taupe-400" />
                      <span className="body text-taupe-500">{slide.label}</span>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </PreviewBlock>

        {/* 2. Card carousel — 3 visible */}
        <PreviewBlock
          title="Card Carousel"
          description="Three cards visible at once with content inside each"
          code={CODE.cardCarousel}
          previewClassName="py-10"
        >
          <div className="w-full px-12">
            <Carousel>
              <CarouselContent>
                {CARD_SLIDES.map((card, i) => (
                  <CarouselItem key={i} className="basis-1/3">
                    <div className="h-full rounded-xl border border-taupe-100 bg-white p-5 shadow-natural">
                      <div className="mb-3 flex size-9 items-center justify-center rounded-full bg-brand-primary/10">
                        <card.Icon className="size-4 text-brand-primary" />
                      </div>
                      <p className="subheading mb-1 text-taupe-900">{card.title}</p>
                      {card.lines.map((line, j) => (
                        <p key={j} className="caption text-taupe-400">
                          {line}
                        </p>
                      ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </PreviewBlock>

        {/* 3. Testimonial carousel */}
        <PreviewBlock
          title="Testimonial Carousel"
          description="Full-width quote cards with author attribution"
          code={CODE.testimonialCarousel}
          previewClassName="py-10"
        >
          <div className="w-full px-12">
            <Carousel>
              <CarouselContent>
                {TESTIMONIALS.map((t, i) => (
                  <CarouselItem key={i}>
                    <div className="rounded-2xl bg-taupe-50 p-8">
                      <p className="body mb-4 italic text-taupe-700">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <p className="subheading text-taupe-900">{t.name}</p>
                      <p className="caption text-taupe-400">{t.role}</p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </PreviewBlock>

        {/* 4. Vertical carousel */}
        <PreviewBlock
          title="Vertical Carousel"
          description="Axis-y orientation scrolling through list rows"
          code={CODE.verticalCarousel}
          previewClassName="py-10"
        >
          <div className="w-full px-12">
            <Carousel opts={{ axis: "y" }} orientation="vertical">
              <div className="h-[300px]">
                <CarouselContent className="h-[300px]">
                  {VERTICAL_SLIDES.map((person, i) => (
                    <CarouselItem key={i}>
                      <div className="flex items-center gap-3 rounded-xl border border-taupe-100 bg-white p-3 shadow-natural">
                        <div
                          className={`flex size-9 shrink-0 items-center justify-center rounded-full ${person.bg}`}
                        >
                          <span className={`label ${person.color}`}>
                            {person.initials}
                          </span>
                        </div>
                        <div>
                          <p className="subheading text-taupe-900">{person.name}</p>
                          <p className="caption text-taupe-400">{person.role}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </div>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
