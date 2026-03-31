import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  DollarSign,
  Calendar,
  LogOut,
  Clock,
  History,
  Settings,
  User,
  Banknote,
} from "lucide-react";

interface Booking {
  id: string;
  client_name: string;
  duration_minutes: number;
  credits_charged: number;
  status: string;
  created_at: string;
  room_url: string | null;
}

interface Availability {
  day_of_week: number;
  start_hour: number;
  end_hour: number;
  is_available: boolean;
}

interface Payout {
  id: string;
  credits_amount: number;
  usd_amount: number;
  status: string;
  payout_date: string;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatHour = (h: number) => {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};

const getNextPayoutDate = () => {
  const now = new Date();
  const start = new Date(2026, 0, 1); // reference start
  const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntilNext = 14 - (diffDays % 14);
  const next = new Date(now);
  next.setDate(next.getDate() + daysUntilNext);
  return next;
};

const TalentDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "availability" | "profile" | "payouts">("overview");

  useEffect(() => {
    if (!user) return;

    // Fetch profile
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        setProfile(data);
        if (data?.full_name) {
          supabase
            .from("bookings")
            .select("*")
            .eq("talent_name", data.full_name)
            .order("created_at", { ascending: false })
            .then(({ data: bd }) => {
              const b = (bd as Booking[]) || [];
              setBookings(b);
              setTotalEarnings(b.reduce((s, bk) => s + bk.credits_charged, 0));
            });
        }
      });

    // Fetch availability
    supabase
      .from("talent_availability")
      .select("day_of_week, start_hour, end_hour, is_available")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setAvailability(data as Availability[]);
        } else {
          // Initialize with defaults
          setAvailability(
            DAYS.map((_, i) => ({
              day_of_week: i,
              start_hour: 9,
              end_hour: 17,
              is_available: i >= 1 && i <= 5, // Mon-Fri
            }))
          );
        }
      });

    // Fetch payouts
    supabase
      .from("talent_payouts")
      .select("*")
      .eq("user_id", user.id)
      .order("payout_date", { ascending: false })
      .limit(10)
      .then(({ data }) => setPayouts((data as Payout[]) || []));
  }, [user]);

  const toggleDay = (dayIndex: number) => {
    setAvailability((prev) =>
      prev.map((a) =>
        a.day_of_week === dayIndex ? { ...a, is_available: !a.is_available } : a
      )
    );
  };

  const updateHour = (dayIndex: number, field: "start_hour" | "end_hour", value: number) => {
    setAvailability((prev) =>
      prev.map((a) => (a.day_of_week === dayIndex ? { ...a, [field]: value } : a))
    );
  };

  const saveAvailability = async () => {
    setSavingAvailability(true);
    for (const a of availability) {
      await supabase.rpc("upsert_availability", {
        _day_of_week: a.day_of_week,
        _start_hour: a.start_hour,
        _end_hour: a.end_hour,
        _is_available: a.is_available,
      });
    }
    setSavingAvailability(false);
    toast({ title: "Availability saved", description: "Your schedule has been updated." });
  };

  const nextPayout = getNextPayoutDate();
  const usdEarnings = (totalEarnings / 100).toFixed(2);

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: DollarSign },
    { id: "availability" as const, label: "Availability", icon: Settings },
    { id: "profile" as const, label: "Profile Preview", icon: User },
    { id: "payouts" as const, label: "Payouts", icon: Banknote },
  ];

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary/20 border border-primary text-gold"
                  : "border border-gold-subtle text-ivory-muted hover:border-primary/40"
              }`}
            >
              <tab.icon size={14} />
              <span className="small-caps-ivory text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ═══════ OVERVIEW TAB ═══════ */}
        {activeTab === "overview" && (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-card-dark border border-gold-subtle p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign size={18} className="text-gold" />
                  <span className="small-caps-gold text-[10px]">Total Earnings</span>
                </div>
                <p className="font-heading text-gold text-4xl">{totalEarnings.toLocaleString()}</p>
                <p className="text-ivory-muted text-xs mt-1">credits (${usdEarnings})</p>
              </div>

              <div className="bg-card-dark border border-gold-subtle p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={18} className="text-gold" />
                  <span className="small-caps-gold text-[10px]">Total Sessions</span>
                </div>
                <p className="font-heading text-gold text-4xl">{bookings.length}</p>
                <p className="text-ivory-muted text-xs mt-1">completed</p>
              </div>

              <div className="bg-card-dark border border-gold-subtle p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Banknote size={18} className="text-gold" />
                  <span className="small-caps-gold text-[10px]">Next Payout</span>
                </div>
                <p className="font-heading text-gold text-xl">
                  {nextPayout.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <p className="text-ivory-muted text-xs mt-1">every 2 weeks</p>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-card-dark border border-gold-subtle p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-gold" />
                <h2 className="small-caps-gold text-sm">Upcoming Sessions</h2>
              </div>
              {bookings.filter((b) => b.status === "confirmed").length === 0 ? (
                <p className="text-ivory-muted text-sm italic">
                  No upcoming sessions. Your bookings will appear here once clients book with you.
                </p>
              ) : (
                <div className="space-y-3">
                  {bookings
                    .filter((b) => b.status === "confirmed")
                    .slice(0, 5)
                    .map((b) => (
                      <div
                        key={b.id}
                        className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 border border-gold-subtle flex items-center justify-center">
                            <User size={16} className="text-gold" />
                          </div>
                          <div>
                            <p className="text-ivory text-sm">{b.client_name || "Client"}</p>
                            <p className="text-ivory-muted text-xs">
                              {b.duration_minutes} min ·{" "}
                              {new Date(b.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gold text-sm font-heading">
                            {b.credits_charged.toLocaleString()} credits
                          </p>
                          <p className="text-primary text-xs capitalize">{b.status}</p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Session History */}
            <div className="bg-card-dark border border-gold-subtle p-8">
              <div className="flex items-center gap-3 mb-6">
                <History size={20} className="text-gold" />
                <h2 className="small-caps-gold text-sm">Session History</h2>
              </div>
              {bookings.length === 0 ? (
                <p className="text-ivory-muted text-sm italic">No sessions yet.</p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-ivory text-sm">{b.client_name || "Client"}</p>
                        <p className="text-ivory-muted text-xs">
                          {b.duration_minutes} min ·{" "}
                          {new Date(b.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold text-sm font-heading">
                          +{b.credits_charged.toLocaleString()}
                        </p>
                        <p className="text-ivory-muted text-xs capitalize">{b.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ═══════ AVAILABILITY TAB ═══════ */}
        {activeTab === "availability" && (
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Settings size={20} className="text-gold" />
                <h2 className="small-caps-gold text-sm">Availability Settings</h2>
              </div>
              <button
                onClick={saveAvailability}
                disabled={savingAvailability}
                className="btn-gold-solid text-xs py-2 px-6 disabled:opacity-50"
              >
                {savingAvailability ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <p className="text-ivory-muted text-xs mb-8 opacity-70">
              Set the days and hours you are available for sessions. Clients will see your availability when booking.
            </p>

            <div className="space-y-4">
              {DAYS.map((day, i) => {
                const slot = availability.find((a) => a.day_of_week === i) || {
                  day_of_week: i,
                  start_hour: 9,
                  end_hour: 17,
                  is_available: false,
                };
                return (
                  <div
                    key={day}
                    className={`flex items-center gap-4 p-4 border transition-all ${
                      slot.is_available ? "border-primary/30 bg-primary/5" : "border-gold-subtle opacity-50"
                    }`}
                  >
                    <button
                      onClick={() => toggleDay(i)}
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        slot.is_available ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-ivory transition-transform ${
                          slot.is_available ? "right-1" : "left-1"
                        }`}
                      />
                    </button>

                    <span className="text-ivory text-sm w-28">{day}</span>

                    {slot.is_available && (
                      <div className="flex items-center gap-2 ml-auto">
                        <select
                          value={slot.start_hour}
                          onChange={(e) => updateHour(i, "start_hour", Number(e.target.value))}
                          className="bg-secondary border border-gold-subtle text-ivory text-xs p-2 focus:outline-none focus:border-primary"
                        >
                          {Array.from({ length: 24 }, (_, h) => (
                            <option key={h} value={h}>
                              {formatHour(h)}
                            </option>
                          ))}
                        </select>
                        <span className="text-ivory-muted text-xs">to</span>
                        <select
                          value={slot.end_hour}
                          onChange={(e) => updateHour(i, "end_hour", Number(e.target.value))}
                          className="bg-secondary border border-gold-subtle text-ivory text-xs p-2 focus:outline-none focus:border-primary"
                        >
                          {Array.from({ length: 24 }, (_, h) => (
                            <option key={h + 1} value={h + 1}>
                              {formatHour(h + 1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════ PROFILE PREVIEW TAB ═══════ */}
        {activeTab === "profile" && (
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-8">
              <User size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Profile Preview</h2>
            </div>
            <p className="text-ivory-muted text-xs mb-8 opacity-70">
              This is how clients see your profile when browsing talents.
            </p>

            <div className="max-w-sm mx-auto bg-background border border-gold-subtle overflow-hidden">
              <div className="aspect-[3/4] bg-secondary flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <User size={64} className="text-gold/30 mx-auto mb-4" />
                    <p className="text-ivory-muted text-xs">No photo uploaded</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-heading text-gold tracking-[0.15em] text-lg mb-2">
                  {profile?.full_name || "Your Name"}
                </h3>
                <p className="small-caps-ivory text-[10px] mb-3 opacity-60">
                  {user?.user_metadata?.country || "Country not set"}
                </p>
                <p className="text-ivory text-xs opacity-60 mb-3">
                  {user?.user_metadata?.languages || "Languages not set"}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-ivory-muted text-xs">{bookings.length} sessions</span>
                </div>
                <button className="btn-gold-outline w-full text-xs py-2" disabled>
                  Book Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ PAYOUTS TAB ═══════ */}
        {activeTab === "payouts" && (
          <div className="space-y-8">
            {/* Payout Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card-dark border border-gold-subtle p-6">
                <span className="small-caps-gold text-[10px] block mb-3">Total Earned</span>
                <p className="font-heading text-gold text-3xl">${usdEarnings}</p>
                <p className="text-ivory-muted text-xs mt-1">
                  {totalEarnings.toLocaleString()} credits
                </p>
              </div>
              <div className="bg-card-dark border border-gold-subtle p-6">
                <span className="small-caps-gold text-[10px] block mb-3">Next Payout</span>
                <p className="font-heading text-gold text-xl">
                  {nextPayout.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-ivory-muted text-xs mt-1">Payouts every 2 weeks</p>
              </div>
              <div className="bg-card-dark border border-gold-subtle p-6">
                <span className="small-caps-gold text-[10px] block mb-3">Pending Payout</span>
                <p className="font-heading text-gold text-3xl">${usdEarnings}</p>
                <p className="text-ivory-muted text-xs mt-1">will be paid on next cycle</p>
              </div>
            </div>

            {/* Payout History */}
            <div className="bg-card-dark border border-gold-subtle p-8">
              <div className="flex items-center gap-3 mb-6">
                <Banknote size={20} className="text-gold" />
                <h2 className="small-caps-gold text-sm">Payout History</h2>
              </div>
              {payouts.length === 0 ? (
                <p className="text-ivory-muted text-sm italic">
                  No payouts yet. Your first payout will be processed on{" "}
                  {nextPayout.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  .
                </p>
              ) : (
                <div className="space-y-3">
                  {payouts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between border-b border-gold-subtle pb-3 last:border-0"
                    >
                      <div>
                        <p className="text-ivory text-sm">
                          {new Date(p.payout_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-ivory-muted text-xs">
                          {p.credits_amount.toLocaleString()} credits
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold text-sm font-heading">${Number(p.usd_amount).toFixed(2)}</p>
                        <p
                          className={`text-xs capitalize ${
                            p.status === "paid" ? "text-primary" : "text-ivory-muted"
                          }`}
                        >
                          {p.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-card-dark border border-gold-subtle p-6">
              <p className="text-ivory-muted text-xs leading-relaxed">
                <span className="text-gold">◆</span> Credits are converted at a rate of 100 credits = $1.00 USD.
                Payouts are processed every two weeks via bank transfer. A minimum balance of 5,000 credits
                ($50) is required for each payout cycle.
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TalentDashboard;
