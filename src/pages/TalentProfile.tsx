import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TalentHero from "@/components/talent-profile/TalentHero";
import TalentPricing from "@/components/talent-profile/TalentPricing";
import TalentAvailability from "@/components/talent-profile/TalentAvailability";
import TalentReviews from "@/components/talent-profile/TalentReviews";
import { talents } from "@/data/talents";
import { CheckCircle } from "lucide-react";

const TalentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  const talent = talents.find((t) => t.id === id);

  if (!talent) {
    return (
      <div className="bg-yozora min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 px-6 text-center">
          <h1 className="font-heading text-gold text-3xl mb-4">Talent Not Found</h1>
          <Link to="/talents" className="btn-gold-outline text-xs py-2 px-6">Back to Talents</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getCreditsForDuration = (duration: number) =>
    talent.pricing.find((p) => p.duration === duration)?.credits ?? 0;

  const handleBook = async () => {
    if (!user) { navigate("/login"); return; }
    if (!selectedDuration) return;

    const credits = getCreditsForDuration(selectedDuration);
    setBooking(true);

    const { error } = await supabase.rpc("book_session", {
      _talent_id: talent.id,
      _talent_name: talent.name,
      _duration_minutes: selectedDuration,
      _credits: credits,
    });

    setBooking(false);

    if (error) {
      toast({
        title: "Booking failed",
        description: error.message.includes("Insufficient")
          ? "You don't have enough credits. Please purchase more."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    setBooked(true);
  };

  if (booked) {
    return (
      <div className="bg-yozora min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 px-6 max-w-md mx-auto text-center">
          <div className="bg-card-dark border border-gold-subtle p-12">
            <CheckCircle size={48} className="text-gold mx-auto mb-6" />
            <h1 className="font-heading text-gold tracking-[0.2em] text-2xl mb-4">Session Booked</h1>
            <p className="text-ivory text-sm leading-relaxed mb-2 opacity-80">
              Your {selectedDuration}-minute session with {talent.name} has been confirmed.
            </p>
            <p className="text-gold text-sm mb-8">
              {getCreditsForDuration(selectedDuration!).toLocaleString()} credits deducted
            </p>
            <Link to="/talents" className="btn-gold-outline text-xs py-2 px-8">Browse More Talents</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <TalentHero talent={talent} />
      </section>

      <section className="pb-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TalentPricing
            talent={talent}
            selectedDuration={selectedDuration}
            onSelect={setSelectedDuration}
          />
          <TalentAvailability />
        </div>
      </section>

      <section className="pb-16 px-6 lg:px-12 max-w-6xl mx-auto">
        <TalentReviews talent={talent} />
      </section>

      {/* Sticky booking bar */}
      <div className="sticky bottom-0 bg-card-dark border-t border-gold-subtle py-4 px-6 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-ivory text-sm opacity-70">
            {selectedDuration
              ? `${selectedDuration} min — ${getCreditsForDuration(selectedDuration).toLocaleString()} credits`
              : "Select a session length above"}
          </div>
          <button
            onClick={handleBook}
            disabled={!selectedDuration || booking}
            className="btn-gold-solid text-xs disabled:opacity-40"
          >
            {booking ? "Booking..." : "Book Session"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TalentProfile;
