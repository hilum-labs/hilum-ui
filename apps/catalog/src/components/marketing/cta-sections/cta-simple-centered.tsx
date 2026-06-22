import { Button } from "@hilum/ui";

export default function CTASimpleCentered() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="heading text-ground-900">Ready to dive in?</h2>
        <p className="body mt-4 text-ground-500">
          Spin up a workspace, invite your team, and start planning your next launch in the same
          afternoon.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg">Start free</Button>
          <Button variant="outline" size="lg">
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  );
}
