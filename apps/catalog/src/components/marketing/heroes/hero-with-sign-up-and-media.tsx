import { Button } from "@hilum/ui";

export default function HeroWithSignUpAndMedia() {
  return (
    <section className="w-full bg-ground-50 px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label uppercase tracking-[0.24em] text-ground-400">
            Early access for scaling teams
          </p>
          <h1 className="display mt-6 text-ground-900">
            Build a repeatable launch engine in one week.
          </h1>
          <p className="body mt-5 text-ground-500">
            Start with your next launch, invite the whole team, and roll the workflow forward as a
            reusable operating system.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Work email"
              className="h-11 flex-1 rounded-md border border-ground-200 bg-white px-3 body text-ground-900 outline-none placeholder:text-ground-400 focus:border-ground-300"
            />
            <Button size="lg" className="sm:px-5">
              Join the waitlist
            </Button>
          </form>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.75rem] bg-white p-6 shadow-natural ring-1 ring-ground-100">
            <p className="caption text-ground-400">Rollout impact</p>
            <p className="heading mt-3 text-ground-900">3.4x faster</p>
            <p className="body mt-3 text-ground-500">
              Teams using guided launch templates cut planning time from nine days to less than
              three.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                ["Templates", "18"],
                ["Approvals", "96%"],
                ["Adoption", "87%"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-ground-50 p-4">
                  <p className="caption text-ground-400">{label}</p>
                  <p className="subheading mt-2 text-ground-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-ground-900 p-6 text-white shadow-elevated">
            <p className="caption text-ground-400">What customers say</p>
            <p className="heading mt-3 text-white">
              "We replaced three disconnected tools in our first rollout."
            </p>
            <p className="body mt-4 text-ground-300">
              "Before Beacon, launch week meant chasing updates in Slack and rebuilding status decks
              at midnight. Now every stakeholder sees the same picture."
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-white/10">
                <span className="subheading text-white">AN</span>
              </div>
              <div>
                <p className="body text-white">Avery Ng</p>
                <p className="caption text-ground-400">VP Marketing, Northstar</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
