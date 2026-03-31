import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, CalendarCheck, CreditCard, Star, ClipboardList } from "lucide-react";
import TalentApplicationsTab from "@/components/admin/TalentApplicationsTab";

interface Profile {
  user_id: string;
  full_name: string;
  credit_balance: number;
  created_at: string;
  avatar_url: string | null;
}

interface UserRole {
  user_id: string;
  role: string;
}

interface Booking {
  id: string;
  client_name: string;
  talent_name: string;
  duration_minutes: number;
  credits_charged: number;
  status: string;
  created_at: string;
  room_url: string | null;
}

interface CreditTransaction {
  id: string;
  user_id: string;
  bundle_name: string;
  credits_purchased: number;
  bonus_credits: number;
  amount_paid: number;
  created_at: string;
}

interface Payout {
  id: string;
  user_id: string;
  credits_amount: number;
  usd_amount: number;
  status: string;
  payout_date: string;
}

interface TalentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  bio: string;
  specialty: string;
  portfolio_url: string;
  status: string;
  admin_notes: string;
  created_at: string;
  reviewed_at: string | null;
}

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [applications, setApplications] = useState<TalentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [profilesRes, rolesRes, bookingsRes, txRes, payoutsRes, appsRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("*"),
        supabase.from("bookings").select("*").order("created_at", { ascending: false }),
        supabase.from("credit_transactions").select("*").order("created_at", { ascending: false }),
        supabase.from("talent_payouts").select("*").order("payout_date", { ascending: false }),
        supabase.from("talent_applications").select("*").order("created_at", { ascending: false }),
      ]);
      setProfiles(profilesRes.data ?? []);
      setRoles(rolesRes.data ?? []);
      setBookings(bookingsRes.data ?? []);
      setTransactions(txRes.data ?? []);
      setPayouts(payoutsRes.data ?? []);
      setApplications((appsRes.data as unknown as TalentApplication[]) ?? []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const refreshApplications = async () => {
    const { data } = await supabase.from("talent_applications").select("*").order("created_at", { ascending: false });
    setApplications((data as unknown as TalentApplication[]) ?? []);
  };

  const getRoleForUser = (userId: string) => {
    const found = roles.find((r) => r.user_id === userId);
    return found?.role ?? "unknown";
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount_paid), 0);
  const totalCredits = transactions.reduce((sum, t) => sum + t.credits_purchased + t.bonus_credits, 0);
  const totalBookings = bookings.length;
  const totalUsers = profiles.length;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Loading admin data…</p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-36 pb-20 px-6 max-w-7xl mx-auto">
        <h1 className="font-heading text-primary tracking-[0.2em] text-3xl mb-2">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-xs tracking-widest uppercase mb-10">
          Platform overview & management
        </p>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total Users", value: totalUsers, icon: Users },
            { label: "Total Bookings", value: totalBookings, icon: CalendarCheck },
            { label: "Credits Sold", value: totalCredits.toLocaleString(), icon: Star },
            { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: CreditCard },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border p-5 flex items-center gap-4">
              <div className="bg-secondary p-3 rounded-sm">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest">{label}</p>
                <p className="text-foreground font-heading text-xl">{value}</p>
              </div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-secondary border border-border mb-6">
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-wider">Users</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-wider">Bookings</TabsTrigger>
            <TabsTrigger value="finances" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-wider">Finances</TabsTrigger>
            <TabsTrigger value="payouts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-wider">Payouts</TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs tracking-wider">
              Applications
              {applications.filter(a => a.status === "pending").length > 0 && (
                <span className="ml-1.5 bg-destructive text-destructive-foreground text-[9px] px-1.5 py-0.5 rounded-full">
                  {applications.filter(a => a.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-card border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Name</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Role</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Credits</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((p) => (
                    <TableRow key={p.user_id} className="border-border">
                      <TableCell className="text-foreground text-sm">{p.full_name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-primary/30 text-primary">
                          {getRoleForUser(p.user_id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground text-sm">{p.credit_balance}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(p.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {profiles.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No users yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="bg-card border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Client</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Talent</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Duration</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Credits</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.id} className="border-border">
                      <TableCell className="text-foreground text-sm">{b.client_name || "—"}</TableCell>
                      <TableCell className="text-foreground text-sm">{b.talent_name}</TableCell>
                      <TableCell className="text-foreground text-sm">{b.duration_minutes}m</TableCell>
                      <TableCell className="text-foreground text-sm">{b.credits_charged}</TableCell>
                      <TableCell>
                        <Badge variant={b.status === "confirmed" ? "default" : "outline"} className="text-[10px] uppercase tracking-wider">
                          {b.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(b.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {bookings.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No bookings yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Finances Tab */}
          <TabsContent value="finances">
            <div className="bg-card border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Bundle</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Credits</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Bonus</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Paid</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((t) => (
                    <TableRow key={t.id} className="border-border">
                      <TableCell className="text-foreground text-sm">{t.bundle_name}</TableCell>
                      <TableCell className="text-foreground text-sm">{t.credits_purchased}</TableCell>
                      <TableCell className="text-foreground text-sm">+{t.bonus_credits}</TableCell>
                      <TableCell className="text-foreground text-sm">${Number(t.amount_paid).toFixed(2)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(t.created_at)}</TableCell>
                    </TableRow>
                  ))}
                  {transactions.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No transactions yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <div className="bg-card border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Credits</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">USD</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.map((p) => (
                    <TableRow key={p.id} className="border-border">
                      <TableCell className="text-foreground text-sm">{p.credits_amount}</TableCell>
                      <TableCell className="text-foreground text-sm">${Number(p.usd_amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={p.status === "paid" ? "default" : "outline"} className="text-[10px] uppercase tracking-wider">
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(p.payout_date)}</TableCell>
                    </TableRow>
                  ))}
                  {payouts.length === 0 && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No payouts yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Applications Tab */}
          <TabsContent value="applications">
            <TalentApplicationsTab applications={applications} onRefresh={refreshApplications} />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
