import { useState } from "react";
import { MessageSquareQuote } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";

const reviews = [
  {
    author: "Emily Selman",
    avatar: "ES",
    title: "Can't say enough good things",
    rating: 5,
    body: "I was really pleased with the overall shopping experience. My order even included a little personal thank you note, which delighted me!",
  },
  {
    author: "Hector Gibbons",
    avatar: "HG",
    title: "Complements my existing wardrobe",
    rating: 5,
    body: "Adds the perfect finishing touch to any outfit. I was nervous ordering online, but the quality blew me away.",
  },
  {
    author: "Mark Edwards",
    avatar: "ME",
    title: "My wife was resistant but now loves it",
    rating: 4,
    body: "I purchased this for my wife and she was a bit unsure at first. Now she won't leave the house without it.",
  },
  {
    author: "Bonnie Weston",
    avatar: "BW",
    title: "Great for the office",
    rating: 5,
    body: "This goes with my entire wardrobe. I typically wear casual clothes to the office, and this fits right in.",
  },
] as const;

type ReviewAuthor = (typeof reviews)[number]["author"];

const ratingDistribution = [
  { label: "5★", width: "70%" },
  { label: "4★", width: "20%" },
  { label: "3★", width: "5%" },
  { label: "2★", width: "3%" },
  { label: "1★", width: "2%" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 text-sm">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={index < rating ? "text-brand-secondary" : "text-ground-200"}>
          {index < rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}

export default function OverallRatingWithFeaturedReviews() {
  const [activeAuthor, setActiveAuthor] = useState<ReviewAuthor>(reviews[1].author);
  const featuredReviews = reviews.slice(0, 2);

  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white p-6">
      <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[28px] border border-ground-100 bg-ground-50 p-6">
          <Badge variant="secondary">Verified reviews</Badge>
          <div className="mt-6 flex items-center gap-4">
            <p className="display text-ground-900">4.8</p>
            <div>
              <Stars rating={5} />
              <p className="caption mt-2 text-ground-400">Based on 512 reviews</p>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {ratingDistribution.map((row) => (
              <div key={row.label} className="grid grid-cols-[32px_1fr] items-center gap-3">
                <p className="caption text-ground-400">{row.label}</p>
                <div className="h-2 rounded-full bg-ground-100">
                  <div className="h-2 rounded-full bg-brand-primary" style={{ width: row.width }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-3">
            <Button>Write a review</Button>
            <Button variant="ghost">See all reviews</Button>
          </div>
        </div>
        <div className="grid gap-5">
          {featuredReviews.map((review) => {
            const active = activeAuthor === review.author;
            return (
              <button
                key={review.author}
                onClick={() => setActiveAuthor(review.author)}
                className={`rounded-[28px] border p-6 text-left transition-colors ${
                  active
                    ? "border-brand-primary/40 bg-brand-primary/5"
                    : "border-ground-100 hover:border-ground-200"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-brand-secondary/60 text-ground-900">
                        {review.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="body font-semibold text-ground-900">{review.author}</p>
                      <p className="caption mt-0.5 text-ground-400">{review.title}</p>
                    </div>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-ground-100 text-ground-500">
                    <MessageSquareQuote size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <Stars rating={review.rating} />
                </div>
                <p className="body mt-4 leading-relaxed text-ground-500">{review.body}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
