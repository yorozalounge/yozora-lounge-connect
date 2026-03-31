import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewDialog from "@/components/ReviewDialog";
import { CreditCard, Clock, LogOut, History, Star, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

interface Transaction {
  id: string;
  bundle_name: string;
  credits_purchased: number;
  bonus_credits: number;
  amount_paid: number;
  created_at: string;
}

interface Booking {
  id: string;
  talent_name: string;
  duration_minutes: number;
  credits_charged: number;
  status: string;
  created_at: string;
  room_url: string | null;
}

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string; credit_balance: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviewedBookings, setReviewedBookings] = useState<Set<string>>(new Set());
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("full_name, credit_balance")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setProfile(data));

    supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setTransactions((data as Transaction[]) || []));

    supabase
      .from("bookings")
      .select("*")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setBookings((data as Booking[]) || []);
        // Fetch which bookings already have reviews
        if (data && data.length > 0) {
          supabase
            .from("session_reviews")
            .select("booking_id")
            .eq("reviewer_id", user.id)
            .then(({ data: reviews }) => {
              setReviewedBookings(new Set((reviews || []).map((r: any) => r.booking_id)));
            });
        }
      });
  }, [user]);

  const now = new Date();
  // Treat "confirmed" bookings created in last 24h as upcoming (simplified)
  const upcomingSessions = bookings.filter((b) => b.status === "confirmed");
  const pastSessions = bookings.filter((b) => b.status !== "confirmed");

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-heading text-gold tracking-[0.2em] text-3xl mb-1">
              Welcome, {profile?.full_name || "Client"}
            </h1>
            <p className="small-caps-ivory text-[10px] opacity-50">Client Dashboard</p>
          </div>
          <button onClick={signOut} className="btn-gold-outline text-xs py-2 px-6 flex items-center gap-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Credit Balance Hero */}
        <div className="bg-card-dark border border-gold-subtle p-10 mb-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="relative">
            <CreditCard size={28} className="text-gold mx-auto mb-4 opacity-60" />
            <p className="small-caps-gold text-sm mb-3">Your Credit Balance</p>
            <p className="font-heading text-gold text-6xl md:text-7xl mb-2">
              {(profile?.credit_balance ?? 0).toLocaleString()}
            </p>
            <p className="text-ivory-muted text-sm mb-8">credits available</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/credits" className="btn-gold-solid text-xs py-3 px-8">
                Buy Credits
              </Link>
              <Link to="/talents" className="btn-gold-outline text-xs py-3 px-8 flex items-center gap-2">
                <Users size={14} /> Browse Talents
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Upcoming Sessions */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <Video size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Upcoming Sessions</h2>
            </div>
            {upcomingSessions.length === 0 ? (
              <div className="space-y-4">
                <p className="text-ivory-muted text-sm italic">
                  No upcoming sessions. Book a session with a talent to get started.
                </p>
                <Link to="/talents" className="btn-gold-outline text-xs py-2 px-6 inline-block">
                  Browse Talents
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {upcomingSessions.map((b) => (
                  <div key={b.id} className="border border-gold-subtle p-4 flex items-center justify-between">
                    <div>
                      <p className="text-ivory text-sm font-body">{b.talent_name}</p>
                      <p className="text-ivory-muted text-xs mt-1">
                        {b.duration_minutes} min · {new Date(b.created_at).toLocaleDateString("en-US", {
                          weekday: "short", month: "short", day: "numeric",
                        })}
                      </p>
                      <p className="text-gold text-xs mt-1">
                        {b.credits_charged.toLocaleString()} credits
                      </p>
                    </div>
                    {b.room_url ? (
                      <a
                        href={b.room_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold-solid text-[10px] py-2 px-4 flex items-center gap-1.5"
                      >
                        <Video size={12} /> Join
                      </a>
                    ) : (
                      <button className="btn-gold-solid text-[10px] py-2 px-4 flex items-center gap-1.5 opacity-50" disabled>
                        <Video size={12} /> Join
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purchase History */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <History size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Purchase History</h2>
            </div>
            {transactions.length === 0 ? (
              <p className="text-ivory-muted text-sm italic">No purchases yet.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0">
                    <div>
                      <p className="text-ivory text-sm">{t.bundle_name} Bundle</p>
                      <p className="text-ivory-muted text-xs">
                        {new Date(t.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold text-sm font-heading">
                        +{(t.credits_purchased + t.bonus_credits).toLocaleString()}
                      </p>
                      <p className="text-ivory-muted text-xs">${Number(t.amount_paid).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Session History */}
        <div className="bg-card-dark border border-gold-subtle p-8">
          <div className="flex items-center gap-3 mb-6">
            <Clock size={20} className="text-gold" />
            <h2 className="small-caps-gold text-sm">Session History</h2>
          </div>
          {pastSessions.length === 0 && upcomingSessions.length === 0 ? (
            <p className="text-ivory-muted text-sm italic">No sessions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold-subtle">
                    <th className="text-left small-caps-gold text-[10px] py-3 pr-4">Talent</th>
                    <th className="text-left small-caps-gold text-[10px] py-3 pr-4">Date</th>
                    <th className="text-left small-caps-gold text-[10px] py-3 pr-4">Duration</th>
                    <th className="text-left small-caps-gold text-[10px] py-3 pr-4">Credits</th>
                    <th className="text-left small-caps-gold text-[10px] py-3 pr-4">Rating</th>
                    <th className="text-left small-caps-gold text-[10px] py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-gold-subtle/50 last:border-0">
                      <td className="text-ivory py-3 pr-4">{b.talent_name}</td>
                      <td className="text-ivory-muted py-3 pr-4">
                        {new Date(b.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="text-ivory-muted py-3 pr-4">{b.duration_minutes} min</td>
                      <td className="text-gold py-3 pr-4 font-heading">{b.credits_charged.toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        {b.status === "completed" ? (
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} size={12} className="text-gold fill-gold" />
                            ))}
                          </div>
                        ) : (
                          <span className="text-ivory-muted text-xs">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`text-xs uppercase tracking-wider ${
                          b.status === "confirmed" ? "text-green-400" : "text-ivory-muted"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
