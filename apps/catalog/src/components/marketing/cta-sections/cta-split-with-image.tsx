import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

export default function CTASplitWithImage() {
  return (
    <section className="w-full bg-white py-16 lg:py-24">
      <div className="grid lg:grid-cols-2">
        <div className="min-h-[320px] bg-ground-200">
          <div className="flex h-full items-end p-8 sm:p-10">
            <div className="rounded-[1.75rem] bg-white/75 p-6 shadow-natural backdrop-blur">
              <p className="caption text-ground-500">Field note</p>
              <p className="subheading mt-2 text-ground-900">
                Teams that standardize launch reviews reduce approval time by
                41%.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center px-8 py-16 sm:px-10 lg:px-14">
          <div className="max-w-xl">
            <p className="label uppercase tracking-[0.24em] text-ground-400">
              Built for fast-moving teams
            </p>
            <h2 className="heading mt-4 text-ground-900">
              Move from launch guesswork to launch confidence.
            </h2>
            <p className="body mt-4 text-ground-500">
              Standardize the playbook, keep execution visible, and give every
              team a place to resolve issues before they hit customers.
            </p>
            <Button size="lg" className="mt-8">
              Get started
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
