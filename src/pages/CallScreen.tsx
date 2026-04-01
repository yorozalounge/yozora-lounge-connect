import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Gift, ArrowLeft, Sparkles, Clock, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const GIFT_OPTIONS = [
  { amount: 500, label: "500", icon: "💫" },
  { amount: 1000, label: "1K", icon: "⭐" },
  { amount: 3000, label: "3K", icon: "💎" },
  { amount: 10000, label: "10K", icon: "👑" },
  { amount: 30000, label: "30K", icon: "🌟" },
];

const EXTENSION_OPTIONS = [
  { minutes: 10, label: "+10 min" },
  { minutes: 20, label: "+20 min" },
];

const CallScreen = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [booking, setBooking] = useState<{
    id: string;
    talent_id: string;
    talent_name: string;
    client_id: string;
    room_url: string | null;
    credits_charged: number;
    duration_minutes: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<number | null>(null);
  const [lastGift, setLastGift] = useState<number | null>(null);
  const [showGifts, setShowGifts] = useState(false);
  const [extending, setExtending] = useState<number | null>(null);
  const [showExtend, setShowExtend] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!user || !bookingId) return;
      const { data } = await supabase
        .from("bookings")
        .select("id, talent_id, talent_name, client_id, room_url, credits_charged, duration_minutes")
        .eq("id", bookingId)
        .single();
      setBooking(data);
      setLoading(false);
    };
    if (user) fetchBooking();
  }, [user, bookingId]);

  const isClient = booking?.client_id === user?.id;

  const handleGift = async (amount: number) => {
    if (!booking) return;
    setSending(amount);

    const { error } = await supabase.rpc("send_tip", {
      _booking_id: booking.id,
      _talent_id: booking.talent_id,
      _amount: amount,
    });

    setSending(null);

    if (error) {
      toast({
        title: "Transfer failed",
        description: error.message.includes("Insufficient")
          ? "You don't have enough credits."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    setLastGift(amount);
    toast({
      title: `${amount.toLocaleString()} credits sent!`,
      description: `${booking.talent_name} received ${(amount / 2).toLocaleString()} credits.`,
    });
    setTimeout(() => setLastGift(null), 2500);
  };

  const perMinuteRate = booking ? Math.ceil(booking.credits_charged / booking.duration_minutes) : 0;

  const getExtensionCost = (minutes: number) => {
    const raw = perMinuteRate * minutes;
    if (minutes === 10) return Math.max(1000, Math.min(5000, raw));
    return Math.max(2000, Math.min(8000, raw));
  };

  const handleExtend = async (minutes: number) => {
    if (!booking) return;
    setExtending(minutes);

    const { error } = await supabase.rpc("extend_session", {
      _booking_id: booking.id,
      _extra_minutes: minutes,
    });

    setExtending(null);

    if (error) {
      toast({
        title: "Extension failed",
        description: error.message.includes("Insufficient")
          ? "You don't have enough credits."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    const cost = getExtensionCost(minutes);
    setBooking((prev) =>
      prev ? { ...prev, duration_minutes: prev.duration_minutes + minutes } : prev
    );
    toast({
      title: `+${minutes} minutes added!`,
      description: `${cost.toLocaleString()} credits deducted.`,
    });
    setShowExtend(false);
  };

  if (authLoading || loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading call...</p>
      </div>
    );
  }

  if (!booking || !booking.room_url) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-foreground text-sm">Call not available.</p>
        <button onClick={() => navigate("/my-sessions")} className="text-primary text-xs underline">
          Back to Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <iframe
        src={booking.room_url}
        className="w-full h-screen border-0"
        allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
        title="Video Call"
      />

      {/* Top bar overlay */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent z-10">
        <button
          onClick={() => navigate("/my-sessions")}
          className="flex items-center gap-2 text-white/80 hover:text-white text-xs transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="hidden sm:inline">Back</span>
        </button>
        <span className="text-white/80 text-xs font-heading tracking-[0.15em]">
          {booking.talent_name}
        </span>
      </div>

      {/* Client controls */}
      {isClient && (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-3">
          {/* Extend time panel */}
          {showExtend && (
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg p-3 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-2 text-center">
                Extend Call
              </p>
              <div className="flex flex-col gap-2">
                {EXTENSION_OPTIONS.map((opt) => (
                  <button
                    key={opt.minutes}
                    onClick={() => handleExtend(opt.minutes)}
                    disabled={extending !== null}
                    className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 bg-muted/50 text-foreground hover:bg-accent/20 hover:text-accent-foreground border border-transparent disabled:opacity-40"
                  >
                    <span className="font-heading">{opt.label}</span>
                    <span className="text-muted-foreground text-xs">
                      {(perMinuteRate * opt.minutes).toLocaleString()} cr
                    </span>
                    {extending === opt.minutes && (
                      <Sparkles size={14} className="text-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground mt-2 text-center opacity-60">
                Based on session rate
              </p>
            </div>
          )}

          {/* Gift options panel */}
          {showGifts && (
            <div className="bg-background/95 backdrop-blur-md border border-border rounded-lg p-3 mb-2 animate-in slide-in-from-bottom-4 fade-in duration-200">
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] mb-2 text-center">
                Send Credits
              </p>
              <div className="flex flex-col gap-2">
                {GIFT_OPTIONS.map((opt) => (
                  <button
                    key={opt.amount}
                    onClick={() => handleGift(opt.amount)}
                    disabled={sending !== null}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-md text-sm transition-all duration-200
                      ${lastGift === opt.amount
                        ? "bg-primary/20 text-primary scale-105 border border-primary/40"
                        : "bg-muted/50 text-foreground hover:bg-primary/10 hover:text-primary border border-transparent"
                      }
                      disabled:opacity-40
                    `}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    <span className="font-heading text-primary min-w-[3rem]">{opt.label}</span>
                    {sending === opt.amount && (
                      <Sparkles size={14} className="text-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-muted-foreground mt-2 text-center opacity-60">
                Creator receives 50%
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { setShowExtend(!showExtend); setShowGifts(false); }}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                ${showExtend
                  ? "bg-accent text-accent-foreground rotate-12 scale-110"
                  : "bg-accent/90 text-accent-foreground hover:bg-accent hover:scale-105"
                }
              `}
            >
              <Clock size={24} />
            </button>
            <button
              onClick={() => { setShowGifts(!showGifts); setShowExtend(false); }}
              className={`
                w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300
                ${showGifts
                  ? "bg-primary text-primary-foreground rotate-12 scale-110"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary hover:scale-105"
                }
              `}
            >
              <Gift size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallScreen;
