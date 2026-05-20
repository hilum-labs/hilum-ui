import { Button } from "@hilum/ui";

export default function NotFound404Simple() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center bg-white px-6 py-24 text-center">
      <p className="label uppercase tracking-widest text-brand-primary">404 error</p>
      <h1 className="display mt-4 text-ground-900">Page not found</h1>
      <p className="body mt-4 max-w-sm text-ground-500">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="mt-8 flex gap-3">
        <Button>Go back home</Button>
        <Button variant="outline">Contact support</Button>
      </div>
    </div>
  );
}
