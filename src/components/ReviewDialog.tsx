import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  talentName: string;
  talentId: string;
  reviewerId: string;
  reviewerName: string;
  onReviewSubmitted?: () => void;
}

const ReviewDialog = ({
  open,
  onOpenChange,
  bookingId,
  talentName,
  talentId,
  reviewerId,
  reviewerName,
  onReviewSubmitted,
}: ReviewDialogProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("session_reviews").insert({
      booking_id: bookingId,
      reviewer_id: reviewerId,
      talent_id: talentId,
      rating,
      review_text: reviewText.trim() || null,
      reviewer_name: reviewerName,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Review failed",
        description: error.message.includes("duplicate")
          ? "You've already reviewed this session."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Review submitted", description: "Thank you for your feedback!" });
    setRating(0);
    setReviewText("");
    onOpenChange(false);
    onReviewSubmitted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card-dark border-gold-subtle max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-gold tracking-[0.15em] text-xl">
            Rate Your Session with {talentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    s <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-primary/30"
                  }
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Share your experience (optional)..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={500}
            className="bg-secondary border-gold-subtle text-ivory placeholder:text-ivory-muted min-h-[100px] resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="btn-gold-solid w-full text-xs disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
