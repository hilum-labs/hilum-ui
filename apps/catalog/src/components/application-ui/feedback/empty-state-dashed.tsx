
import { Upload } from "lucide-react";
import { Button } from "@hilum/ui";

export default function EmptyStateDashed() {
  return (
    <div className="w-full bg-white px-6 py-10">
      <div className="rounded-xl border-2 border-dashed border-taupe-200 p-12 text-center">
        <Upload size={40} className="mx-auto mb-4 text-taupe-300" />
        <h3 className="heading text-taupe-900">Upload your files</h3>
        <p className="body mt-2 text-taupe-500">Drag and drop files here, or click to browse</p>
        <Button variant="outline" size="sm" className="mt-6">
          Browse files
        </Button>
      </div>
    </div>
  );
}
