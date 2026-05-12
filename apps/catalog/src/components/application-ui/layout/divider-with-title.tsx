export default function DividerWithTitle() {
  return (
    <div className="w-full bg-white p-6">
      <div className="body text-taupe-500">Previous section</div>
      <div className="relative flex items-center py-4">
        <div className="h-px flex-1 bg-taupe-100" />
        <span className="mx-4 body font-medium text-taupe-900">
          New Section
        </span>
        <div className="h-px flex-1 bg-taupe-100" />
      </div>
      <div className="body text-taupe-500">Next section</div>
    </div>
  );
}
