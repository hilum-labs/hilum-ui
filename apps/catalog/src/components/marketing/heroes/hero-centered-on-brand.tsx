import { Button } from "@hilum/ui";

const GRADIENT_CURVES = [
  "M-120 560C140 438 446 392 784 426C1112 458 1352 418 1600 294",
  "M-120 646C170 526 478 486 832 518C1144 548 1368 508 1600 388",
  "M-120 736C214 604 538 566 910 596C1174 618 1388 592 1600 490",
  "M-120 830C248 692 592 656 984 676C1210 688 1396 670 1600 604",
];

const GRADIENT_NODES = [
  {
    badge: "AL",
    eyebrow: "Creator match",
    label: "Amber Liu",
    className: "left-[15%] top-[68%] hidden md:block",
    badgeClassName: "bg-[#f3ede5] text-ground-900",
  },
  {
    badge: "JQ",
    eyebrow: "Verified payout",
    label: "Jordan Quinn",
    className: "left-[40%] top-[46%] hidden lg:block",
    badgeClassName: "bg-[#ffd9f3] text-ground-900",
  },
  {
    badge: "92%",
    eyebrow: "Campaign health",
    label: "On track this week",
    className: "right-[16%] top-[58%] hidden md:block",
    badgeClassName: "bg-[#fff5bf] text-ground-900",
  },
];

const GRADIENT_STATS = [
  ["Live campaigns", "Active brand opportunities"],
  ["Creator earnings", "Track work and payouts"],
  ["Campaign performance", "Measure lift and delivery"],
  ["Verified agencies", "Hire expert partners"],
];

export default function HeroCenteredOnBrand() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-10 sm:px-10 lg:px-14">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fcf7f4_0%,#f8edf7_40%,#f7efe7_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_92%,rgba(201,165,255,0.5),transparent_28%),radial-gradient(circle_at_38%_36%,rgba(255,174,218,0.42),transparent_25%),radial-gradient(circle_at_72%_84%,rgba(255,188,96,0.38),transparent_28%),radial-gradient(circle_at_74%_48%,rgba(255,255,255,0.96),transparent_17%),radial-gradient(circle_at_92%_20%,rgba(255,255,255,0.75),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-90">
        <svg
          viewBox="0 0 1440 820"
          className="h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {GRADIENT_CURVES.map((path) => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <path
            d="M-80 680C230 560 546 514 928 544C1188 566 1400 520 1600 426"
            fill="none"
            stroke="rgba(229,93,255,0.66)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M764 676C952 574 1168 470 1600 348"
            fill="none"
            stroke="rgba(240,118,255,0.6)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="relative mx-auto flex min-h-[720px] max-w-6xl flex-col justify-between">
        <div className="max-w-2xl px-2 pt-10 sm:pt-14">
          <p className="label uppercase tracking-[0.24em] text-ground-400">
            Creator campaigns, visualized
          </p>
          <h1 className="display mt-6 text-balance text-ground-900 sm:text-[4.25rem] sm:leading-[0.96]">
            The fastest way to run creator marketing.
          </h1>
          <p className="body-lg mt-5 max-w-xl text-ground-500">
            Connect brands, creators, and agency partners through verified
            campaigns, transparent payouts, and one operating view that keeps
            every launch moving.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full rounded-full bg-ground-950 px-7 text-white shadow-elevated hover:bg-ground-800 sm:w-auto"
            >
              Launch a campaign
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full rounded-full border-transparent bg-white/72 px-7 text-ground-900 ring-1 ring-inset ring-white/[0.035] backdrop-blur-md hover:bg-white sm:w-auto"
            >
              Join as a creator
            </Button>
          </div>
        </div>

        {GRADIENT_NODES.map((node) => (
          <div key={node.label} className={`absolute ${node.className}`}>
            <div className="rounded-[1.25rem] bg-white/68 p-2.5 shadow-natural ring-1 ring-inset ring-white/[0.035] backdrop-blur-md">
              <div className="flex items-center gap-3 rounded-2xl bg-white/65 px-3 py-3">
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl label tracking-[0.08em] ${node.badgeClassName}`}
                >
                  {node.badge}
                </div>
                <div>
                  <p className="caption text-ground-400">{node.eyebrow}</p>
                  <p className="body text-ground-900">{node.label}</p>
                </div>
              </div>
            </div>
            <div className="mx-auto mt-2 size-2 rounded-full bg-fuchsia-500/80" />
          </div>
        ))}

        <div className="relative mt-10 rounded-[2rem] bg-white/74 p-4 shadow-natural ring-1 ring-inset ring-white/[0.035] backdrop-blur-md sm:p-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {GRADIENT_STATS.map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[1.25rem] bg-white/50 px-4 py-4 ring-1 ring-inset ring-white/[0.035]"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-white/80 shadow-natural ring-1 ring-inset ring-white/[0.035]" />
                  <div>
                    <p className="body font-medium text-ground-900">{title}</p>
                    <p className="caption text-ground-400">{copy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
