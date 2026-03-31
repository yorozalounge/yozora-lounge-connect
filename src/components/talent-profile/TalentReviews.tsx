import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Talent } from "@/data/talents";

interface DbReview {
  id: string;
  rating: number;
  review_text: string | null;
  reviewer_name: string;
  created_at: string;
}

const TalentReviews = ({ talent }: { talent: Talent }) => {
  const [dbReviews, setDbReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("session_reviews")
      .select("id, rating, review_text, reviewer_name, created_at")
      .eq("talent_id", talent.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setDbReviews((data as DbReview[]) || []);
        setLoading(false);
      });
  }, [talent.id]);

  // Merge: DB reviews first, then static fallback
  const allReviews = [
    ...dbReviews.map((r) => ({
      name: r.reviewer_name || "Anonymous",
      rating: r.rating,
      text: r.review_text || "",
      date: new Date(r.created_at).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric",
      }),
    })),
    ...talent.reviews,
  ];

  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  return (
    <div className="border border-gold-subtle p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-gold tracking-[0.15em] text-xl">Client Reviews</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                size={14}
                className={j < Math.round(avgRating) ? "fill-primary text-primary" : "text-primary/30"}
              />
            ))}
          </div>
          <span className="text-gold text-sm font-heading">{avgRating.toFixed(1)}</span>
          <span className="text-ivory-muted text-xs">({allReviews.length})</span>
        </div>
      </div>
      <div className="space-y-6">
        {allReviews.map((review, i) => (
          <div key={i} className={i < allReviews.length - 1 ? "pb-6 border-b border-gold-subtle" : ""}>
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
            {review.text && (
              <p className="text-ivory text-sm leading-relaxed opacity-70">{review.text}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentReviews;
