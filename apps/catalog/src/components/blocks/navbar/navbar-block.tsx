import { useState } from "react";
import { Bell, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hilum/ui";

const NAV_LINKS = ["Dashboard", "Projects", "Team", "Reports"];

export default function NavbarBlock() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("Dashboard");

  return (
    <nav className="border-b border-ground-100 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo + nav */}
          <div className="flex items-center gap-6">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-ground-900">
              <span className="caption font-bold text-white">D</span>
            </div>
            <div className="hidden gap-0.5 sm:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  onClick={(e) => { e.preventDefault(); setActive(link); }}
                  className={`rounded-md px-3 py-1.5 body font-medium transition-colors ${
                    active === link
                      ? "bg-brand-primary/10 text-brand-primary"
                      : "text-ground-500 hover:bg-ground-50 hover:text-ground-900"
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" className="relative size-8 p-0 text-ground-500">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand-primary" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-ground-50 transition-colors">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-brand-primary text-white">SP</AvatarFallback>
                  </Avatar>
                  <span className="hidden caption font-medium text-ground-700 sm:block">Sofia P.</span>
                  <ChevronDown size={12} className="hidden text-ground-400 sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>Your profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile toggle */}
            <button
              className="rounded-md p-1.5 text-ground-500 hover:bg-ground-50 sm:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-ground-100 py-3 sm:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="block rounded-md px-3 py-2 body font-medium text-ground-500 hover:bg-ground-50 hover:text-ground-900"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
