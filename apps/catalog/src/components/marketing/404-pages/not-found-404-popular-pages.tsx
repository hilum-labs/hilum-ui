import { ArrowRight, BookOpen, FileText, List, Rss } from "lucide-react";

const POPULAR_LINKS = [
  { title: "Documentation", description: "Learn how to integrate our tools with your app", icon: BookOpen },
  { title: "API Reference", description: "A complete reference for all API endpoints", icon: List },
  { title: "Guides", description: "Step-by-step setup guides for popular stacks", icon: FileText },
  { title: "Blog", description: "News, tutorials, and product updates", icon: Rss },
];

export default function NotFound404PopularPages() {
  return (
    <div className="bg-white px-6 py-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <p className="label uppercase tracking-widest text-brand-primary">404 error</p>
          <h1 className="display mt-4 text-taupe-900">This page does not exist</h1>
          <p className="body mt-3 text-taupe-500">
            The page you are looking for could not be found.
          </p>
        </div>
        <div className="mt-10">
          <p className="label uppercase tracking-widest text-taupe-400">Popular pages</p>
          <ul className="mt-4 divide-y divide-taupe-100 border-y border-taupe-100">
            {POPULAR_LINKS.map((link) => (
              <li key={link.title} className="group relative flex items-start gap-4 py-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                  <link.icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <a href="#" className="body font-semibold text-taupe-900 before:absolute before:inset-0">
                    {link.title}
                  </a>
                  <p className="caption text-taupe-500">{link.description}</p>
                </div>
                <ArrowRight size={16} className="mt-1 shrink-0 text-taupe-300 transition-transform group-hover:translate-x-1 group-hover:text-taupe-600" />
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <a href="#" className="body font-semibold text-brand-primary hover:text-brand-primary/80">
              Or go back home →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
