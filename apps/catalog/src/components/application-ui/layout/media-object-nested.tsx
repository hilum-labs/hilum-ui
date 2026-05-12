import { Avatar, AvatarFallback } from "@hilum/ui";

export default function MediaObjectNested() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex gap-4">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-taupe-200 text-taupe-700">
            PM
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="subheading text-taupe-900">Project Manager</p>
          <p className="mb-3 body text-taupe-500">
            Overseeing delivery across multiple workstreams.
          </p>
          <div className="flex gap-3 rounded-lg bg-taupe-50 p-3">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-brand-primary text-xs text-white">
                DW
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="caption font-medium text-taupe-900">
                Direct Report
              </p>
              <p className="caption text-taupe-500">
                Frontend engineer on the dashboard team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
