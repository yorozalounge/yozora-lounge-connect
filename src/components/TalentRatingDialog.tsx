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

interface TalentRatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingId: string;
  clientName: string;
  clientId: string;
  talentUserId: string;
  onRatingSubmitted?: () => void;
}

const TalentRatingDialog = ({
  open,
  onOpenChange,
  bookingId,
  clientName,
  clientId,
  talentUserId,
  onRatingSubmitted,
}: TalentRatingDialogProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("talent_session_ratings").insert({
      booking_id: bookingId,
      talent_user_id: talentUserId,
      client_id: clientId,
      rating,
      notes: notes.trim() || null,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "Rating failed",
        description: error.message.includes("duplicate")
          ? "You've already rated this session."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Rating submitted" });
    setRating(0);
    setNotes("");
    onOpenChange(false);
    onRatingSubmitted?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card-dark border-gold-subtle max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-gold tracking-[0.15em] text-xl">
            Rate Session with {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          <p className="text-ivory-muted text-xs">This rating is private and for internal tracking only.</p>
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
            placeholder="Private notes (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className="bg-secondary border-gold-subtle text-ivory placeholder:text-ivory-muted min-h-[100px] resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="btn-gold-solid w-full text-xs disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TalentRatingDialog;
