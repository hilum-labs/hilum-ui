
import { useState } from "react";

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

const reviewDates = ["March 3, 2026", "February 18, 2026", "January 29, 2026", "January 11, 2026"];

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

export default function CompactThreeColumnCards() {
  const [activeAuthor, setActiveAuthor] = useState<ReviewAuthor>(reviews[1].author);

  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review, index) => {
          const active = activeAuthor === review.author;
          return (
            <button
              key={review.author}
              onMouseEnter={() => setActiveAuthor(review.author)}
              onClick={() => setActiveAuthor(review.author)}
              className={`rounded-[22px] border p-5 text-left transition ${
                active
                  ? "border-brand-primary/40 bg-brand-primary/5"
                  : "border-ground-100 hover:border-ground-200 hover:bg-ground-50"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="body font-semibold text-ground-900">{review.author}</p>
                <p className="caption text-ground-400">{reviewDates[index]}</p>
              </div>
              <div className="mt-3">
                <Stars rating={review.rating} />
              </div>
              <p className="subheading mt-4 text-ground-900">{review.title}</p>
              <p className="body mt-3 leading-relaxed text-ground-500">{review.body}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
