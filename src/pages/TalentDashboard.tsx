import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Calendar, LogOut } from "lucide-react";

interface Booking {
  id: string;
  client_name: string;
  duration_minutes: number;
  credits_charged: number;
  status: string;
  created_at: string;
}

const TalentDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        if (data?.full_name) {
          // Fetch bookings where this talent is assigned
          // talent_id matches the talent slug, but for DB-registered talents
          // we match by talent_name
          supabase
            .from("bookings")
            .select("*")
            .eq("talent_name", data.full_name)
            .order("created_at", { ascending: false })
            .then(({ data: bookingData }) => {
              const b = (bookingData as Booking[]) || [];
              setBookings(b);
              setTotalEarnings(b.reduce((sum, bk) => sum + bk.credits_charged, 0));
            });
        }
      });
  }, [user]);

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="font-heading text-gold tracking-[0.2em] text-3xl mb-2">
              Welcome, {profile?.full_name || "Talent"}
            </h1>
            <p className="small-caps-ivory text-[10px] opacity-50">Talent Dashboard</p>
          </div>
          <button onClick={signOut} className="btn-gold-outline text-xs py-2 px-6 flex items-center gap-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Earnings */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Earnings</h2>
            </div>
            <p className="font-heading text-gold text-5xl mb-4">
              {totalEarnings.toLocaleString()}
            </p>
            <p className="text-ivory-muted text-sm">credits earned</p>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Sessions</h2>
            </div>
            {bookings.length === 0 ? (
              <p className="text-ivory-muted text-sm italic">
                No sessions yet. Your bookings will appear here once clients book with you.
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0">
                    <div>
                      <p className="text-ivory text-sm">{b.client_name || "Client"}</p>
                      <p className="text-ivory-muted text-xs">
                        {b.duration_minutes} min · {new Date(b.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold text-sm font-heading">
                        {b.credits_charged.toLocaleString()} credits
                      </p>
                      <p className="text-ivory-muted text-xs capitalize">{b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TalentDashboard;
