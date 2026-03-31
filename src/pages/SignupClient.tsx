import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const SignupClient = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role: "client" },
        emailRedirectTo: `${window.location.origin}/client-dashboard`,
      },
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-yozora min-h-screen">
        <Navbar />
        <div className="pt-40 pb-20 px-6 max-w-md mx-auto text-center">
          <div className="bg-card-dark border border-gold-subtle p-12">
            <Mail size={48} className="text-gold mx-auto mb-6" />
            <h1 className="font-heading text-gold tracking-[0.2em] text-2xl mb-4">
              Check Your Email
            </h1>
            <p className="text-ivory text-sm leading-relaxed mb-6 opacity-80">
              Please check your email to verify your account before signing in.
            </p>
            <p className="text-ivory-muted text-xs mb-8 opacity-60">
              We sent a verification link to <span className="text-gold">{email}</span>. 
              Click the link in the email to activate your account.
            </p>
            <Link to="/login" className="btn-gold-outline text-xs py-2 px-8 inline-block">
              Go to Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-md mx-auto">
        <h1 className="font-heading text-gold tracking-[0.2em] text-3xl text-center mb-2">
          Join as Client
        </h1>
        <p className="small-caps-ivory text-[10px] opacity-50 text-center mb-12">
          Create your account to book sessions
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

export default SignupClient;
