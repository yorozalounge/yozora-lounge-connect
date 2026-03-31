import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const SignupTalent = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "talent" },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Check your email",
      description: "We've sent you a verification link. Please confirm your email to sign in.",
    });
    navigate("/login");
  };

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-md mx-auto">
        <h1 className="font-heading text-gold tracking-[0.2em] text-3xl text-center mb-2">
          Join as Talent
        </h1>
        <p className="small-caps-ivory text-[10px] opacity-50 text-center mb-12">
          Create your account to start earning
        </p>

        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label className="small-caps-ivory text-[10px] opacity-70 block mb-2">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-secondary border border-gold-subtle px-4 py-3 text-ivory text-sm font-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="small-caps-ivory text-[10px] opacity-70 block mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary border border-gold-subtle px-4 py-3 text-ivory text-sm font-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="small-caps-ivory text-[10px] opacity-70 block mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-gold-subtle px-4 py-3 text-ivory text-sm font-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold-solid w-full">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-ivory-muted text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignupTalent;