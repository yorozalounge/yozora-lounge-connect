import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { DollarSign, Calendar, LogOut } from "lucide-react";

const TalentDashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<{ full_name: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
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
            <p className="font-heading text-gold text-5xl mb-4">$0</p>
            <p className="text-ivory-muted text-sm">total earnings</p>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={20} className="text-gold" />
              <h2 className="small-caps-gold text-sm">Upcoming Sessions</h2>
            </div>
            <p className="text-ivory-muted text-sm italic">
              No upcoming sessions. Your schedule will appear here once clients book with you.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TalentDashboard;