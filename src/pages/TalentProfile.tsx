import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { talents } from "@/data/talents";
import { Star, Clock, CheckCircle } from "lucide-react";

const sessionOptions = [
  { duration: 20, label: "20 minutes", multiplier: 1 },
  { duration: 40, label: "40 minutes", multiplier: 2 },
  { duration: 60, label: "60 minutes", multiplier: 3 },
];

const TalentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
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
          <Link to="/talents" className="btn-gold-outline text-xs py-2 px-6">
            Back to Talents
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getCreditsForDuration = (duration: number) => {
    const option = sessionOptions.find((o) => o.duration === duration);
    return option ? talent.credits * option.multiplier : 0;
  };

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (role !== "client") {
      toast({ title: "Clients only", description: "Only clients can book sessions.", variant: "destructive" });
      return;
    }
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
            <h1 className="font-heading text-gold tracking-[0.2em] text-2xl mb-4">
              Session Booked
            </h1>
            <p className="text-ivory text-sm leading-relaxed mb-2 opacity-80">
              Your {selectedDuration}-minute session with {talent.name} has been confirmed.
            </p>
            <p className="text-gold text-sm mb-8">
              {getCreditsForDuration(selectedDuration!).toLocaleString()} credits deducted
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/client-dashboard" className="btn-gold-solid text-xs py-2 px-8">
                View Dashboard
              </Link>
              <Link to="/talents" className="btn-gold-outline text-xs py-2 px-8">
                Browse More Talents
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Photo */}
          <div className="aspect-[3/4] overflow-hidden border border-gold-subtle">
            <img
              src={talent.image}
              alt={talent.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Booking */}
          <div className="flex flex-col justify-center">
            <div className="mb-2">
              {talent.online && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="small-caps-gold text-[10px]">Online Now</span>
                </div>
              )}
              <h1 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-2">
                {talent.name}
              </h1>
              <p className="small-caps-ivory text-[10px] opacity-60 mb-4">
                {talent.flag} {talent.country}
              </p>
              <p className="text-ivory text-sm opacity-70 mb-4">
                {talent.languages.join(" · ")}
              </p>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(talent.rating) ? "fill-primary text-primary" : "text-primary/30"}
                    />
                  ))}
                </div>
                <span className="text-ivory text-sm opacity-60">{talent.rating}</span>
                <span className="text-ivory-muted text-sm">· {talent.sessions} sessions</span>
              </div>
            </div>

            {/* Session Selection */}
            <div className="border border-gold-subtle p-6 mb-6">
              <h2 className="font-heading text-gold tracking-[0.15em] text-lg mb-6">
                Book a Session
              </h2>
              <div className="space-y-3">
                {sessionOptions.map((opt) => {
                  const credits = getCreditsForDuration(opt.duration);
                  return (
                    <button
                      key={opt.duration}
                      onClick={() => setSelectedDuration(opt.duration)}
                      className={`w-full flex items-center justify-between p-4 border transition-all duration-200 ${
                        selectedDuration === opt.duration
                          ? "border-primary bg-primary/10"
                          : "border-gold-subtle hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-gold" />
                        <span className="text-ivory text-sm">{opt.label}</span>
                      </div>
                      <span className="font-heading text-gold text-sm">
                        {credits.toLocaleString()} credits
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleBook}
              disabled={!selectedDuration || booking}
              className="btn-gold-solid w-full disabled:opacity-40"
            >
              {booking
                ? "Booking..."
                : selectedDuration
                ? `Confirm Booking — ${getCreditsForDuration(selectedDuration).toLocaleString()} credits`
                : "Select a Session Length"}
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TalentProfile;
