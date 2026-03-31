import { useState } from "react";
import { Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RateClientDialogProps {
  bookingId: string;
  clientId: string;
  clientName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const RateClientDialog = ({
  bookingId,
  clientId,
  clientName,
  onClose,
  onSubmitted,
}: RateClientDialogProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);

    const { error } = await supabase.from("talent_session_ratings").insert({
      booking_id: bookingId,
      client_id: clientId,
      talent_user_id: (await supabase.auth.getUser()).data.user!.id,
      rating,
      notes: notes.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Rating submitted", description: `Your private rating for ${clientName} has been saved.` });
    onSubmitted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border p-8 max-w-md w-full mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>

        <h2 className="font-heading text-primary tracking-[0.15em] text-xl mb-2">Rate Client</h2>
        <p className="text-muted-foreground text-sm mb-1">Private rating for {clientName}</p>
        <p className="text-muted-foreground text-xs mb-6 opacity-60">This rating is only visible to you.</p>

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

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Private notes (optional)..."
          maxLength={500}
          rows={3}
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
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateClientDialog;
