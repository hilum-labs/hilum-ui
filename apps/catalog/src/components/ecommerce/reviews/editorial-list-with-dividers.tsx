
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

export default function EditorialListWithDividers() {
  return (
    <section className="w-full rounded-xl border border-ground-100 bg-white px-6">
      {reviews.map((review, index) => (
        <article
          key={review.author}
          className={`py-6 ${index < reviews.length - 1 ? "border-b border-ground-100" : ""}`}
        >
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-ground-100 text-ground-700">
                {review.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="body font-semibold text-ground-900">{review.author}</p>
                  <p className="caption mt-0.5 text-ground-400">{review.title}</p>
                </div>
                <Stars rating={review.rating} />
              </div>
            </div>
          </div>
          <p className="body mt-4 max-w-4xl leading-relaxed text-ground-500">{review.body}</p>
        </article>
      ))}
    </section>
  );
}
