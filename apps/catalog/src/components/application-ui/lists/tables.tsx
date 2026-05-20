
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Checkbox } from "@hilum/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@hilum/ui";

const PEOPLE = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    initials: "LW",
    dept: "Engineering",
  },
  {
    name: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    initials: "CH",
    dept: "Design",
  },
  {
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    initials: "TC",
    dept: "Product",
  },
  {
    name: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    initials: "WF",
    dept: "Marketing",
  },
  {
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    initials: "LK",
    dept: "Design",
  },
] as const;

const STATUS_BY_PERSON = {
  "Lindsay Walton": { label: "Active", variant: "success" },
  "Courtney Henry": { label: "Reviewing", variant: "warning" },
  "Tom Cook": { label: "Offline", variant: "secondary" },
  "Whitney Francis": { label: "Scheduled", variant: "outline" },
  "Leonard Krasner": { label: "Active", variant: "success" },
} as const;

type Person = (typeof PEOPLE)[number];
type SortColumn = "name" | "title" | "email" | null;
type SortDirection = "asc" | "desc" | null;

function PersonAvatar({
  person,
  size = "md",
  className = "",
}: {
  person: Person;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className="bg-brand-primary/10 text-brand-primary">
        {person.initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default function Tables() {
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sortedPeople = [...PEOPLE].sort((a, b) => {
    if (!sortColumn || !sortDirection) {
      return 0;
    }

    const left = a[sortColumn].toLowerCase();
    const right = b[sortColumn].toLowerCase();
    const comparison = left.localeCompare(right);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const handleSort = (column: Exclude<SortColumn, null>) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortDirection("asc");
      return;
    }

    if (sortDirection === "asc") {
      setSortDirection("desc");
      return;
    }

    if (sortDirection === "desc") {
      setSortColumn(null);
      setSortDirection(null);
      return;
    }

    setSortDirection("asc");
  };

  const sortIcon = (column: Exclude<SortColumn, null>) => {
    if (sortColumn !== column) {
      return <ChevronUp size={12} className="text-ground-300" />;
    }

    if (sortDirection === "desc") {
      return <ChevronDown size={12} className="text-brand-primary" />;
    }

    return <ChevronUp size={12} className="text-brand-primary" />;
  };

  const stickyPeople = Array.from({ length: 15 }, (_, index) => {
    const person = PEOPLE[index % PEOPLE.length];
    const [localPart] = person.email.split("@");

    return {
      ...person,
      id: `${person.initials}-${index}`,
      email: `${localPart}+${index}@example.com`,
    };
  });

  return (
    <div className="grid gap-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person) => (
            <TableRow key={person.email}>
              <TableCell className="font-medium text-ground-900">{person.name}</TableCell>
              <TableCell>{person.title}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.dept}</TableCell>
              <TableCell className="text-right">
                <a href="#" className="body font-medium text-brand-primary">Edit</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person) => (
            <TableRow key={person.email}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell className="font-medium text-ground-900">{person.name}</TableCell>
              <TableCell>{person.title}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell className="text-right">
                <a href="#" className="body font-medium text-brand-primary">Edit</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Person</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person) => {
            const status = STATUS_BY_PERSON[person.name];
            return (
              <TableRow key={person.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <PersonAvatar person={person} />
                    <div>
                      <p className="body font-medium text-ground-900">{person.name}</p>
                      <p className="caption text-ground-400">{person.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="body text-ground-900">{person.title}</p>
                  <p className="caption text-ground-400">{person.dept}</p>
                </TableCell>
                <TableCell>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {PEOPLE.map((person, index) => (
            <TableRow key={person.email} className={index % 2 !== 0 ? "bg-ground-50" : ""}>
              <TableCell className="font-medium text-ground-900">{person.name}</TableCell>
              <TableCell>{person.dept}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.title}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <button className="flex items-center gap-1" onClick={() => handleSort("name")} type="button">
                Name {sortIcon("name")}
              </button>
            </TableHead>
            <TableHead>
              <button className="flex items-center gap-1" onClick={() => handleSort("title")} type="button">
                Title {sortIcon("title")}
              </button>
            </TableHead>
            <TableHead>
              <button className="flex items-center gap-1" onClick={() => handleSort("email")} type="button">
                Email {sortIcon("email")}
              </button>
            </TableHead>
            <TableHead>Department</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPeople.map((person) => (
            <TableRow key={person.email}>
              <TableCell className="font-medium text-ground-900">{person.name}</TableCell>
              <TableCell>{person.title}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.dept}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Table containerClassName="max-h-[280px] overflow-auto rounded-xl border border-ground-100 bg-white">
        <TableHeader className="sticky top-0 z-10 bg-ground-50">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Dept</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stickyPeople.map((person) => (
            <TableRow key={person.id}>
              <TableCell className="font-medium text-ground-900">{person.name}</TableCell>
              <TableCell>{person.title}</TableCell>
              <TableCell>{person.email}</TableCell>
              <TableCell>{person.dept}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
