export default function ContainerFullWidthOnMobile() {
  return (
    <div className="w-full bg-taupe-50 p-6">
      <div className="px-0 sm:px-6">
        <div className="rounded-lg border-2 border-dashed border-brand-primary/30 p-4">
          <p className="caption mb-1 text-taupe-400">px-0 sm:px-6</p>
          <p className="body text-taupe-600">
            No padding on mobile, horizontal padding on sm+ breakpoints. Common
            for card-to-edge pattern.
          </p>
        </div>
      </div>
    </div>
  );
}
