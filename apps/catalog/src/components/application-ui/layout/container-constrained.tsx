export default function ContainerConstrained() {
  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-lg border-2 border-dashed border-brand-primary/30 p-4">
          <p className="caption mb-1 text-taupe-400">max-w-7xl · px-6</p>
          <p className="body text-taupe-600">
            Constrained container — the standard page-width wrapper. Keeps
            content readable on large screens.
          </p>
        </div>
      </div>
    </div>
  );
}
