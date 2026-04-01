import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Phone, DollarSign, Star, CheckCircle, XCircle } from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalUsers: number;
  completedCalls: number;
  activeCreators: number;
}

interface PendingApp {
  id: string;
  full_name: string;
  email: string;
  stage_name: string | null;
  country: string | null;
  languages: string | null;
  created_at: string;
  photo_url: string | null;
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalUsers: 0, completedCalls: 0, activeCreators: 0 });
  const [pending, setPending] = useState<PendingApp[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Check admin role
  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }

    const checkAdmin = async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!data) { navigate("/"); return; }
      setIsAdmin(true);
    };
    checkAdmin();
  }, [user, authLoading, navigate]);

  // Fetch stats & pending apps
  useEffect(() => {
    if (!isAdmin) return;
    const fetchData = async () => {
      const [profilesRes, bookingsRes, rolesRes, appsRes, tipsRes] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("bookings").select("credits_charged, status"),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "talent"),
        supabase.from("talent_applications").select("id, full_name, email, stage_name, country, languages, created_at, photo_url").eq("status", "pending").order("created_at", { ascending: true }),
        supabase.from("tips").select("amount"),
      ]);

      const bookings = bookingsRes.data ?? [];
      const completedCalls = bookings.filter(b => b.status === "completed").length;
      const bookingRevenue = bookings.reduce((sum, b) => sum + (b.credits_charged || 0), 0);
      const tipRevenue = (tipsRes.data ?? []).reduce((sum, t) => sum + (t.amount || 0), 0);

      setStats({
        totalRevenue: bookingRevenue + tipRevenue,
        totalUsers: profilesRes.count ?? 0,
        completedCalls,
        activeCreators: rolesRes.count ?? 0,
      });
      setPending((appsRes.data as PendingApp[]) ?? []);
    };
    fetchData();
  }, [isAdmin]);

  const handleApprove = async (appId: string) => {
    setActionLoading(appId);
    const { error } = await supabase.rpc("approve_talent_application", { _application_id: appId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Approved", description: "Application approved successfully." });
      setPending(prev => prev.filter(a => a.id !== appId));
    }
    setActionLoading(null);
  };

  const handleReject = async (appId: string) => {
    setActionLoading(appId);
    const { error } = await supabase.rpc("reject_talent_application", { _application_id: appId });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rejected", description: "Application rejected." });
      setPending(prev => prev.filter(a => a.id !== appId));
    }
    setActionLoading(null);
  };

  if (authLoading || isAdmin === null) {
    return (
      <div className="bg-background min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 text-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  const statCards = [
    { label: "Total Revenue (Credits)", value: stats.totalRevenue.toLocaleString(), icon: DollarSign },
    { label: "Registered Users", value: stats.totalUsers.toLocaleString(), icon: Users },
    { label: "Completed Calls", value: stats.completedCalls.toLocaleString(), icon: Phone },
    { label: "Active Creators", value: stats.activeCreators.toLocaleString(), icon: Star },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <h1 className="font-heading text-primary tracking-[0.2em] text-3xl mb-12">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statCards.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-body uppercase tracking-widest text-muted-foreground">{label}</CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-heading text-foreground">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Applications */}
        <h2 className="font-heading text-primary tracking-[0.15em] text-xl mb-6">
          Pending Creator Applications ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending applications.</p>
        ) : (
          <div className="space-y-4">
            {pending.map(app => (
              <Card key={app.id} className="bg-card border-border">
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    {app.photo_url ? (
                      <img src={app.photo_url} alt={app.full_name} className="w-12 h-12 rounded-full object-cover border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground text-lg font-heading">
                        {app.full_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-foreground font-heading text-lg">{app.full_name}</p>
                      {app.stage_name && <p className="text-primary text-sm">{app.stage_name}</p>}
                      <p className="text-muted-foreground text-xs">{app.email}</p>
                      <p className="text-muted-foreground text-xs mt-1">
                        {[app.country, app.languages].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary/30 transition-colors disabled:opacity-40"
                    >
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      disabled={actionLoading === app.id}
                      className="flex items-center gap-2 bg-destructive/20 text-destructive border border-destructive/30 px-4 py-2 text-xs uppercase tracking-widest hover:bg-destructive/30 transition-colors disabled:opacity-40"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
