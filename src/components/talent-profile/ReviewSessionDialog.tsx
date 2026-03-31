import { useState } from "react";
import { Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReviewSessionDialogProps {
  bookingId: string;
  talentId: string;
  talentName: string;
  reviewerName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const ReviewSessionDialog = ({
  bookingId,
  talentId,
  talentName,
  reviewerName,
  onClose,
  onSubmitted,
}: ReviewSessionDialogProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    const { error } = await supabase.from("session_reviews").insert({
      booking_id: bookingId,
      talent_id: talentId,
      reviewer_id: (await supabase.auth.getUser()).data.user!.id,
      reviewer_name: reviewerName,
      rating,
      review_text: reviewText.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Review submitted", description: `Thank you for reviewing ${talentName}.` });
    onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <h2 className="font-heading text-primary tracking-[0.15em] text-xl mb-2">Leave a Review</h2>
        <p className="text-muted-foreground text-sm mb-6">Rate your session with {talentName}</p>

        {/* Star rating */}
        <div className="flex gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={
                  star <= (hoveredStar || rating)
                    ? "fill-primary text-primary"
                    : "text-primary/30"
                }
              />
            </button>
          ))}
        </div>

        {/* Review text */}
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience (optional)..."
          maxLength={1000}
          rows={4}
          className="w-full bg-secondary border border-border text-foreground text-sm p-3 mb-6 resize-none placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-gold-outline text-xs py-2 px-6 flex-1">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="btn-gold-solid text-xs py-2 px-6 flex-1 disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSessionDialog;
