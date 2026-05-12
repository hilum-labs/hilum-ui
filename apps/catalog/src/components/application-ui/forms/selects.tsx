
import { type ReactNode, useState } from "react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Label } from "@hilum/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hilum/ui";

type PersonId = "tom" | "ana" | "mila";

const people: Array<{ id: PersonId; name: string; role: string; initials: string }> = [
  { id: "tom", name: "Tom Cook", role: "Product Design", initials: "TC" },
  { id: "ana", name: "Ana Portillo", role: "Design Ops", initials: "AP" },
  { id: "mila", name: "Mila Foster", role: "Customer Success", initials: "MF" },
];

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-taupe-100 bg-taupe-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-taupe-400">{title}</p>
      {children}
    </div>
  );
}

export default function Selects() {
  const [country, setCountry] = useState<string>("united-states");
  const [countryWithCode, setCountryWithCode] = useState<string>("us");
  const [selectedPerson, setSelectedPerson] = useState<PersonId>("tom");

  const activePerson = people.find((person) => person.id === selectedPerson) ?? people[0];

  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 lg:grid-cols-3">
        <VariantCard title="1. Simple native">
          <div className="space-y-2">
            <Label htmlFor="country-select">Country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country-select">
                <SelectValue placeholder="Choose a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="canada">Canada</SelectItem>
                <SelectItem value="mexico">Mexico</SelectItem>
                <SelectItem value="united-states">United States</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </VariantCard>

        <VariantCard title="2. With secondary text">
          <div className="space-y-2">
            <Label htmlFor="country-code-select">Shipping region</Label>
            <Select value={countryWithCode} onValueChange={setCountryWithCode}>
              <SelectTrigger id="country-code-select">
                <SelectValue placeholder="Choose a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ca">
                  <div className="flex w-full items-center justify-between gap-4">
                    <span>Canada</span>
                    <span className="caption text-taupe-400">CA</span>
                  </div>
                </SelectItem>
                <SelectItem value="mx">
                  <div className="flex w-full items-center justify-between gap-4">
                    <span>Mexico</span>
                    <span className="caption text-taupe-400">MX</span>
                  </div>
                </SelectItem>
                <SelectItem value="us">
                  <div className="flex w-full items-center justify-between gap-4">
                    <span>United States</span>
                    <span className="caption text-taupe-400">US</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </VariantCard>

        <VariantCard title="3. Custom with avatar">
          <div className="space-y-2">
            <Label htmlFor="owner-select">Owner</Label>
            <Select
              value={selectedPerson}
              onValueChange={(value) => setSelectedPerson(value as PersonId)}
            >
              <SelectTrigger id="owner-select">
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-brand-primary text-white">
                      {activePerson.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="body text-taupe-900">{activePerson.name}</p>
                    <p className="caption text-taupe-400">{activePerson.role}</p>
                  </div>
                </div>
              </SelectTrigger>
              <SelectContent>
                {people.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarFallback className="bg-brand-primary text-white">
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="body text-taupe-900">{person.name}</p>
                        <p className="caption text-taupe-400">{person.role}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
