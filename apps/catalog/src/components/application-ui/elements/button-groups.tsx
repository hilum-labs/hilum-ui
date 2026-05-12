import { useState } from "react";
import {
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Italic,
  Underline,
} from "lucide-react";
import { Button } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@hilum/ui";

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-taupe-100 bg-taupe-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-taupe-400">{title}</p>
      {children}
    </div>
  );
}

export default function ButtonGroups() {
  const [filterChecked, setFilterChecked] = useState<boolean>(true);

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 xl:grid-cols-2">
        <VariantCard title="1. Basic">
          <div className="inline-flex">
            <Button variant="outline" className="rounded-l-md rounded-r-none">
              Years
            </Button>
            <Button variant="outline" className="-ml-px rounded-none">
              Months
            </Button>
            <Button variant="outline" className="-ml-px rounded-l-none rounded-r-md">
              Days
            </Button>
          </div>
        </VariantCard>

        <VariantCard title="2. With dropdown">
          <DropdownMenu>
            <div className="inline-flex">
              <Button className="rounded-r-none">Create</Button>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="icon"
                  className="-ml-px rounded-l-none"
                >
                  <ChevronDown size={14} />
                </Button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
              <DropdownMenuItem>New project</DropdownMenuItem>
              <DropdownMenuItem>New component</DropdownMenuItem>
              <DropdownMenuItem>New workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </VariantCard>

        <VariantCard title="3. With checkbox and dropdown">
          <DropdownMenu>
            <div className="inline-flex items-center overflow-hidden rounded-md border border-taupe-200 bg-white shadow-natural">
              <label className="flex items-center gap-2 px-3 py-2">
                <Checkbox
                  checked={filterChecked}
                  onCheckedChange={(checked) => setFilterChecked(checked === true)}
                />
                <span className="body text-taupe-700">Assigned to me</span>
              </label>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border-l border-taupe-200 px-3 py-2 text-taupe-500 transition hover:bg-taupe-50 hover:text-taupe-700"
                >
                  <ChevronDown size={14} />
                </button>
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
              <DropdownMenuItem>Any owner</DropdownMenuItem>
              <DropdownMenuItem>Design team</DropdownMenuItem>
              <DropdownMenuItem>Engineering</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </VariantCard>

        <VariantCard title="4. Icon only">
          <div className="flex flex-wrap gap-6">
            <div className="inline-flex">
              <Button variant="outline" size="icon-sm" className="rounded-r-none">
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="-ml-px rounded-l-none"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
            <div className="inline-flex">
              <Button variant="outline" size="icon-sm" className="rounded-r-none">
                <Bold size={14} />
              </Button>
              <Button variant="outline" size="icon-sm" className="-ml-px rounded-none">
                <Italic size={14} />
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="-ml-px rounded-l-none"
              >
                <Underline size={14} />
              </Button>
            </div>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
