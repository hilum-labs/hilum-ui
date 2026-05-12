
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

export default function BlogSectionList() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="outline">Editorial</Badge>
            <h3 className="heading mt-4 text-taupe-900">A sharper read on product craft</h3>
            <p className="body mt-3 text-taupe-500">
              A simplified article index with denser content, clearer scanning, and a more newsroom-like rhythm.
            </p>
          </div>
          <Button variant="ghost" className="hidden text-taupe-600 lg:inline-flex">
            Browse all articles
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="flex h-full flex-col rounded-2xl border border-taupe-100 bg-taupe-50 p-6"
            >
              <Badge variant="secondary" className="w-fit">
                {post.category}
              </Badge>
              <h4 className="subheading mt-4 text-taupe-900">{post.title}</h4>
              <p className="caption mt-3 leading-6 text-taupe-500">{post.excerpt}</p>
              <div className="mt-5 flex items-center gap-3 border-t border-taupe-200 pt-5">
                <Avatar initials={post.authorInitials} size="size-9" />
                <div className="min-w-0 flex-1">
                  <p className="body font-medium text-taupe-900">{post.author}</p>
                  <p className="caption text-taupe-500">
                    {post.date}
                    <span className="mx-2 text-taupe-300">•</span>
                    {post.readTime}
                  </p>
                </div>
              </div>
              <button className="mt-5 inline-flex items-center gap-2 body font-medium text-taupe-900 transition-colors hover:text-brand-primary">
                Read more
                <ArrowRight className="size-4" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
