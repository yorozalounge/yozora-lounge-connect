import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CreditCard, Clock, LogOut, History } from "lucide-react";
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
}

const ClientDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string; credit_balance: number } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

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
      .limit(20)
      .then(({ data }) => setBookings((data as Booking[]) || []));
  }, [user]);

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h1 className="font-heading text-gold tracking-[0.2em] text-3xl mb-2">
              Welcome, {profile?.full_name || "Client"}
            </h1>
            <p className="small-caps-ivory text-[10px] opacity-50">Client Dashboard</p>
          </div>
          <button onClick={signOut} className="btn-gold-outline text-xs py-2 px-6 flex items-center gap-2">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Credit Balance */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Credit Balance</h2>
            </div>
            <p className="font-heading text-gold text-5xl mb-4">
              {(profile?.credit_balance ?? 0).toLocaleString()}
            </p>
            <p className="text-ivory-muted text-sm mb-6">credits available</p>
            <Link to="/credits" className="btn-gold-solid text-xs py-2 px-6 inline-block">
              Purchase Credits
            </Link>
          </div>

          {/* Session History */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <Clock size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Session History</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="space-y-4">
                <p className="text-ivory-muted text-sm italic">
                  No sessions yet. Browse our talents and book your first session.
                </p>
                <Link to="/talents" className="btn-gold-outline text-xs py-2 px-6 inline-block">
                  Browse Talents
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0">
                    <div>
                      <p className="text-ivory text-sm">{b.talent_name}</p>
                      <p className="text-ivory-muted text-xs">
                        {b.duration_minutes} min · {new Date(b.created_at).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold text-sm font-heading">
                        {b.credits_charged.toLocaleString()}
                      </p>
                      <p className="text-ivory-muted text-xs capitalize">{b.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
            <div className="space-y-3">
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
      <Footer />
    </div>
  );
};

export default ClientDashboard;
