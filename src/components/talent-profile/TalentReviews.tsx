import { Star } from "lucide-react";
import type { Talent } from "@/data/talents";

const TalentReviews = ({ talent }: { talent: Talent }) => (
  <div className="border border-gold-subtle p-8">
    <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">Client Reviews</h2>
    <div className="space-y-6">
      {talent.reviews.map((review, i) => (
        <div key={i} className={i < talent.reviews.length - 1 ? "pb-6 border-b border-gold-subtle" : ""}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-ivory text-sm font-body">{review.name}</span>
            <span className="text-ivory-muted text-xs">{review.date}</span>
          </div>
          <div className="flex mb-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={12}
                className={j < review.rating ? "fill-primary text-primary" : "text-primary/30"}
              />
            ))}
          </div>
          <p className="text-ivory text-sm leading-relaxed opacity-70">{review.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export default TalentReviews;
