
import { ArrowRight } from "lucide-react";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const POSTS = [
  {
    category: "Design",
    title: "How to build a design system that scales",
    excerpt:
      "Learn the principles behind building a component library that grows with your team without becoming a maintenance burden.",
    author: "Sofia Chen",
    authorInitials: "SC",
    date: "Mar 16, 2025",
    readTime: "6 min",
  },
  {
    category: "Engineering",
    title: "The case for server components in design systems",
    excerpt:
      "Server components unlock a new pattern for shipping highly performant UI with zero client-side JavaScript.",
    author: "James Park",
    authorInitials: "JP",
    date: "Mar 10, 2025",
    readTime: "4 min",
  },
  {
    category: "Strategy",
    title: "Aligning design and engineering with a shared language",
    excerpt:
      "How design tokens and shared vocabulary reduce the gap between what designers create and what engineers build.",
    author: "Mia Torres",
    authorInitials: "MT",
    date: "Mar 3, 2025",
    readTime: "8 min",
  },
] as const;

function Avatar({ initials, size = "size-10" }: { initials: string; size?: string }) {
  return (
    <div
      className={`${size} flex items-center justify-center rounded-full bg-taupe-200 body font-semibold text-taupe-500`}
    >
      {initials}
    </div>
  );
}

export default function BlogSectionNewsletter() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.3fr_0.9fr]">
        <div>
          <Badge variant="secondary">Latest posts</Badge>
          <h3 className="heading mt-4 text-taupe-900">Fresh thinking from across design and engineering</h3>
          <div className="mt-8 space-y-4">
            {POSTS.slice(0, 2).map((post) => (
              <article
                key={post.title}
                className="rounded-2xl border border-taupe-100 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline">{post.category}</Badge>
                  <p className="caption text-taupe-500">
                    {post.date}
                    <span className="mx-2 text-taupe-300">•</span>
                    {post.readTime} read
                  </p>
                </div>
                <h4 className="subheading mt-4 text-taupe-900">{post.title}</h4>
                <p className="caption mt-3 leading-6 text-taupe-500">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between gap-4 border-t border-taupe-100 pt-5">
                  <div className="flex items-center gap-3">
                    <Avatar initials={post.authorInitials} size="size-9" />
                    <div>
                      <p className="body font-medium text-taupe-900">{post.author}</p>
                      <p className="caption text-taupe-500">Staff writer</p>
                    </div>
                  </div>
                  <button className="inline-flex items-center gap-2 body font-medium text-taupe-900 transition-colors hover:text-brand-primary">
                    Read article
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="rounded-2xl bg-taupe-50 p-8">
          <Badge variant="brand">Newsletter</Badge>
          <h3 className="heading mt-4 text-taupe-900">Get articles in your inbox</h3>
          <p className="body mt-3 text-taupe-500">
            A weekly note with product essays, design system patterns, and shipping lessons from the team.
          </p>
          <div className="mt-8 space-y-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="h-9 w-full rounded-lg border border-taupe-200 bg-white px-3 body text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary"
            />
            <Button className="w-full">Subscribe</Button>
          </div>
          <div className="mt-8 rounded-2xl border border-taupe-200 bg-white p-5">
            <p className="label text-taupe-400">Also included</p>
            <ul className="mt-4 space-y-3">
              <li className="body text-taupe-700">Monthly component release notes</li>
              <li className="body text-taupe-700">Early previews of upcoming patterns</li>
              <li className="body text-taupe-700">Notes from our design reviews</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
