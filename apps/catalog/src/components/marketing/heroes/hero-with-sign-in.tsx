import { Check } from "lucide-react";
import { Button } from "@hilum/ui";

export default function HeroWithSignIn() {
  return (
    <section className="w-full bg-ground-50 px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-xl">
          <p className="label uppercase tracking-[0.24em] text-ground-400">
            Teams log in. Alignment shows up.
          </p>
          <h1 className="display mt-5 text-ground-900">
            Bring every launch brief, file, and approval into focus.
          </h1>
          <p className="body mt-5 text-ground-500">
            Beacon gives marketers, PMs, and creative leads one place to plan the work and see what
            still needs attention before go-live.
          </p>
          <div className="mt-8 flex items-center gap-3 text-ground-500">
            <div className="flex size-10 items-center justify-center rounded-full bg-white shadow-natural">
              <Check className="size-4 text-brand-primary" />
            </div>
            <p className="body">Used by teams shipping 120+ launches per year.</p>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white p-8 shadow-natural ring-1 ring-ground-100">
          <div className="mb-6">
            <p className="subheading text-ground-900">Sign in to Beacon</p>
            <p className="body mt-2 text-ground-500">
              Continue where your team left off this morning.
            </p>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="label uppercase tracking-[0.18em] text-ground-400">Email</label>
              <input
                type="email"
                placeholder="team@beacon.so"
                className="h-11 w-full rounded-md border border-ground-200 bg-white px-3 body text-ground-900 outline-none placeholder:text-ground-400 focus:border-ground-300"
              />
            </div>
            <div className="space-y-2">
              <label className="label uppercase tracking-[0.18em] text-ground-400">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="h-11 w-full rounded-md border border-ground-200 bg-white px-3 body text-ground-900 outline-none placeholder:text-ground-400 focus:border-ground-300"
              />
            </div>
            <Button size="lg" className="w-full">
              Sign in
            </Button>
          </form>
          <p className="caption mt-4 text-ground-400">
            Need a workspace? Request access from your admin.
          </p>
        </div>
      </div>
    </section>
  );
}
