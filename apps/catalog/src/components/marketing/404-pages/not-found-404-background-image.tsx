import { Button } from "@hilum/ui";

export default function NotFound404BackgroundImage() {
  return (
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-xl bg-ground-900 px-6 py-24 text-center">
      {/* gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,77,1,0.15),transparent_70%)]" />
      <div className="relative">
        <p className="label uppercase tracking-widest text-ground-400">404 error</p>
        <h1 className="display mt-4 text-white">You&apos;re lost in the void</h1>
        <p className="body mt-4 max-w-sm text-ground-400">
          The page you were looking for doesn&apos;t exist.
        </p>
        <div className="mt-8">
          <Button variant="brand" className="rounded-full">
            Go back home
          </Button>
        </div>
      </div>
    </div>
  );
}
