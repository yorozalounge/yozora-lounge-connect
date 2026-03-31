import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, Clock, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSessionDialog from "@/components/talent-profile/ReviewSessionDialog";
import RateClientDialog from "@/components/RateClientDialog";

interface Booking {
  id: string;
  talent_id: string;
  talent_name: string;
  client_id: string;
  client_name: string;
  duration_minutes: number;
  credits_charged: number;
  status: string;
  room_url: string | null;
  created_at: string;
}

const MySessions = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewedBookingIds, setReviewedBookingIds] = useState<Set<string>>(new Set());
  const [ratedBookingIds, setRatedBookingIds] = useState<Set<string>>(new Set());
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [rateTarget, setRateTarget] = useState<Booking | null>(null);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch profile name
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single();
    setProfileName(profile?.full_name || "");

    // Fetch bookings (user could be client or talent — RLS handles access)
    const { data: bookingData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    const rows = (bookingData as Booking[]) || [];
    setBookings(rows);

    // Fetch which bookings the user already reviewed (as client)
    const { data: reviews } = await supabase
      .from("session_reviews")
      .select("booking_id")
      .eq("reviewer_id", user.id);
    setReviewedBookingIds(new Set((reviews || []).map((r) => r.booking_id)));

    // Fetch which bookings the user already rated (as talent)
    const { data: ratings } = await supabase
      .from("talent_session_ratings")
      .select("booking_id")
      .eq("talent_user_id", user.id);
    setRatedBookingIds(new Set((ratings || []).map((r) => r.booking_id)));

    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="bg-yozora min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 px-6 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const isClient = (b: Booking) => b.client_id === user!.id;

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />

      <section className="pt-32 pb-16 px-6 lg:px-12 max-w-4xl mx-auto">
        <h1 className="font-heading text-primary tracking-[0.2em] text-3xl md:text-4xl mb-2">My Sessions</h1>
        <p className="text-muted-foreground text-sm mb-10">Your booking history and reviews.</p>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading sessions...</p>
        ) : bookings.length === 0 ? (
          <div className="border border-border p-12 text-center">
            <p className="text-foreground text-sm mb-4 opacity-70">No sessions yet.</p>
            <Link to="/talents" className="btn-gold-outline text-xs py-2 px-8">Browse Creators</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const client = isClient(b);
              const canReview = client && !reviewedBookingIds.has(b.id);
              const canRate = !client && !ratedBookingIds.has(b.id);

              return (
                <div key={b.id} className="border border-border p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-body">
                      {client ? (
                        <Link to={`/talent/${b.talent_id}`} className="text-primary hover:underline">
                          {b.talent_name}
                        </Link>
                      ) : (
                        <span>{b.client_name || "Client"}</span>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-muted-foreground text-xs">
                      <span className="flex items-center gap-1"><Clock size={12} /> {b.duration_minutes} min</span>
                      <span>{b.credits_charged.toLocaleString()} credits</span>
                      <span>{new Date(b.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${
                      b.status === "confirmed" ? "border-primary/30 text-primary" : "border-border text-muted-foreground"
                    }`}>
                      {b.status}
                    </span>

                    {canReview && (
                      <button
                        onClick={() => setReviewTarget(b)}
                        className="btn-gold-outline text-[10px] py-1.5 px-3"
                      >
                        Leave Review
                      </button>
                    )}

                    {canRate && (
                      <button
                        onClick={() => setRateTarget(b)}
                        className="btn-gold-outline text-[10px] py-1.5 px-3"
                      >
                        Rate Client
                      </button>
                    )}

                    {reviewedBookingIds.has(b.id) && client && (
                      <span className="text-xs text-primary flex items-center gap-1"><Star size={12} className="fill-primary" /> Reviewed</span>
                    )}

                    {ratedBookingIds.has(b.id) && !client && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Star size={12} /> Rated</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {reviewTarget && (
        <ReviewSessionDialog
          bookingId={reviewTarget.id}
          talentId={reviewTarget.talent_id}
          talentName={reviewTarget.talent_name}
          reviewerName={profileName}
          onClose={() => setReviewTarget(null)}
          onSubmitted={() => { setReviewTarget(null); fetchData(); }}
        />
      )}

      {rateTarget && (
        <RateClientDialog
          bookingId={rateTarget.id}
          clientId={rateTarget.client_id}
          clientName={rateTarget.client_name || "Client"}
          onClose={() => setRateTarget(null)}
          onSubmitted={() => { setRateTarget(null); fetchData(); }}
        />
      )}

      <Footer />
    </div>
  );
};

export default MySessions;
