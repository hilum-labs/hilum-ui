
import { Button } from "@hilum/ui";

export default function HeaderBrandedWithBackground() {
  return (
    <section
      className="w-full bg-brand-primary px-8 py-20 text-white"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(circle at top, rgba(255,255,255,0.18), transparent 45%)",
        backgroundSize: "24px 24px, 24px 24px, auto",
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="caption text-white/70">Spring release</p>
        <h2 className="display mt-4 text-white">Launch pages that feel unmistakably branded</h2>
        <p className="body mt-5 text-white/80">
          Pair expressive color, strong messaging, and fast calls to action for product launches, pricing announcements, and campaign landers.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            className="bg-white text-ground-900 hover:bg-white/90"
          >
            Start a project
          </Button>
          <Button
            variant="ghost"
            className="border-transparent text-white ring-1 ring-inset ring-white/[0.035] hover:bg-white/10 hover:text-white"
          >
            View examples
          </Button>
        </div>
      </div>
    </section>
  );
}
