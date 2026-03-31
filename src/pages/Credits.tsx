import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Wallet } from "lucide-react";

const bundles = [
  { name: "Starter", price: 10, credits: 1000, bonus: 0, popular: false },
  { name: "Popular", price: 25, credits: 2500, bonus: 250, popular: true },
  { name: "Premium", price: 50, credits: 5000, bonus: 750, popular: false },
  { name: "Elite", price: 100, credits: 10000, bonus: 2000, popular: false },
  { name: "VIP", price: 250, credits: 25000, bonus: 7500, popular: false },
];

const pricing = [
  { duration: "20 minutes", min: "2,000", max: "8,000" },
  { duration: "40 minutes", min: "4,000", max: "15,000" },
  { duration: "60 minutes", min: "6,000", max: "25,000" },
  { duration: "10 min extension", min: "1,000", max: "5,000" },
  { duration: "20 min extension", min: "2,000", max: "8,000" },
];

const gifts = [
  { name: "Blossom", emoji: "🌸", credits: 500 },
  { name: "Star", emoji: "⭐", credits: 1000 },
  { name: "Diamond", emoji: "💎", credits: 3000 },
  { name: "Crown", emoji: "👑", credits: 10000 },
  { name: "Yozora Moon", emoji: "🌙", credits: 30000 },
];

const CreditsPage = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [balance, setBalance] = useState<number | null>(null);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("credit_balance")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => setBalance(data?.credit_balance ?? 0));
  }, [user]);

  const handlePurchase = async (bundle: typeof bundles[0]) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (role !== "client") {
      toast({ title: "Clients only", description: "Only clients can purchase credits.", variant: "destructive" });
      return;
    }

    setPurchasing(bundle.name);
    const { error } = await supabase.rpc("purchase_credits", {
      _bundle_name: bundle.name,
      _credits: bundle.credits,
      _bonus: bundle.bonus,
      _amount: bundle.price,
    });
    setPurchasing(null);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    const totalAdded = bundle.credits + bundle.bonus;
    setBalance((prev) => (prev ?? 0) + totalAdded);
    toast({
      title: "Credits purchased!",
      description: `${totalAdded.toLocaleString()} credits added to your wallet.`,
    });
  };

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">Get Your Credits</h1>
          <p className="small-caps-ivory text-[10px] opacity-50 mb-2">Purchase credits to book sessions with our extraordinary talents</p>
          <p className="text-ivory text-sm opacity-60">$1 = 100 credits</p>
        </div>

        {/* Wallet Balance */}
        {user && role === "client" && balance !== null && (
          <div className="flex items-center justify-center gap-3 mb-12 bg-card-dark border border-gold-subtle px-8 py-4 mx-auto w-fit">
            <Wallet size={20} className="text-gold" />
            <span className="small-caps-gold text-sm">Your Balance:</span>
            <span className="font-heading text-gold text-2xl">{balance.toLocaleString()}</span>
            <span className="text-ivory-muted text-sm">credits</span>
          </div>
        )}

        {/* Bundles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8 mb-24">
          {bundles.map((b) => (
            <div
              key={b.name}
              className={`bg-card-dark border p-6 text-center transition-all duration-300 ${
                b.popular ? "border-primary scale-105 relative" : "border-gold-subtle"
              }`}
            >
              {b.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[9px] uppercase tracking-[0.15em] px-3 py-1 font-body">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="font-heading text-gold tracking-[0.15em] text-lg mb-4">{b.name}</h3>
              <p className="font-heading text-gold text-4xl mb-2">${b.price}</p>
              <p className="text-ivory text-sm mb-1">{b.credits.toLocaleString()} credits</p>
              {b.bonus > 0 ? (
                <p className="text-gold text-xs mb-4">+ {b.bonus.toLocaleString()} bonus</p>
              ) : (
                <p className="text-ivory-muted text-xs mb-4">&nbsp;</p>
              )}
              <button
                onClick={() => handlePurchase(b)}
                disabled={purchasing === b.name}
                className="btn-gold-solid w-full text-xs py-2 disabled:opacity-50"
              >
                {purchasing === b.name ? "Processing..." : "Buy Now"}
              </button>
            </div>
          ))}
        </div>

        {/* Session Pricing */}
        <div className="mb-24">
          <h2 className="font-heading text-gold tracking-[0.2em] text-2xl text-center mb-4">Session Pricing</h2>
          <p className="text-ivory-muted text-xs text-center mb-10">Each talent sets their own rate within platform guidelines</p>
          <div className="bg-card-dark border border-gold-subtle overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-subtle">
                  <th className="small-caps-gold text-left p-4 text-[10px]">Duration</th>
                  <th className="small-caps-gold text-right p-4 text-[10px]">Min Credits</th>
                  <th className="small-caps-gold text-right p-4 text-[10px]">Max Credits</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((p) => (
                  <tr key={p.duration} className="border-b border-gold-subtle last:border-0">
                    <td className="text-ivory text-sm p-4 opacity-70">{p.duration}</td>
                    <td className="text-ivory text-sm p-4 text-right opacity-70">{p.min}</td>
                    <td className="text-ivory text-sm p-4 text-right opacity-70">{p.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Virtual Gifts */}
        <div>
          <h2 className="font-heading text-gold tracking-[0.2em] text-2xl text-center mb-10">Virtual Gifts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6">
            {gifts.map((g) => (
              <div key={g.name} className="bg-card-dark border border-gold-subtle p-6 text-center">
                <span className="text-3xl block mb-3">{g.emoji}</span>
                <p className="font-heading text-gold tracking-[0.1em] text-sm mb-1">{g.name}</p>
                <p className="text-ivory-muted text-xs">{g.credits.toLocaleString()} credits</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CreditsPage;
