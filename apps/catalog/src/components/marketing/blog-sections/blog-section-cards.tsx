
import { ArrowRight } from "lucide-react";
import { Badge } from "@hilum/ui";

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
      className={`${size} flex items-center justify-center rounded-full bg-ground-200 body font-semibold text-ground-500`}
    >
      {initials}
    </div>
  );
}

function PostMeta({
  author,
  authorInitials,
  date,
  readTime,
}: (typeof POSTS)[number]) {
  return (
    <div className="mt-5 flex items-center gap-3">
      <Avatar initials={authorInitials} />
      <div className="min-w-0">
        <p className="body font-medium text-ground-900">{author}</p>
        <p className="caption text-ground-500">
          {date}
          <span className="mx-2 text-ground-300">•</span>
          {readTime} read
        </p>
      </div>
    </div>
  );
}

export default function BlogSectionCards() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Badge variant="secondary">From the blog</Badge>
          <h3 className="heading mt-4 text-ground-900">Insights from the team shaping the system</h3>
          <p className="body mt-3 text-ground-500">
            Practical writing on design operations, UI architecture, and the systems work behind high-velocity product teams.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="flex h-full flex-col rounded-2xl border border-ground-100 bg-white p-6 shadow-sm"
            >
              <div className="aspect-video rounded-xl bg-ground-100" />
              <Badge variant="brand" className="mt-5 w-fit">
                {post.category}
              </Badge>
              <h4 className="subheading mt-4 text-ground-900">{post.title}</h4>
              <p className="caption mt-3 leading-6 text-ground-500">{post.excerpt}</p>
              <div className="mt-auto">
                <PostMeta {...post} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
