export default function DividerWithLabel() {
  return (
    <div className="w-full bg-white p-6">
      <div className="body text-taupe-500">Sign in with email</div>
      <div className="relative flex items-center py-4">
        <div className="h-px flex-1 bg-taupe-100" />
        <span className="mx-4 caption text-taupe-400">or</span>
        <div className="h-px flex-1 bg-taupe-100" />
      </div>
      <div className="body text-taupe-500">Continue with SSO</div>
    </div>
  );
}
