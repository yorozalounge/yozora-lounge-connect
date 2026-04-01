import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // If user is already signed in, redirect home
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    // onAuthStateChange in AuthProvider will update user → useEffect above navigates
  };

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-md mx-auto">
        <h1 className="font-heading text-gold tracking-[0.2em] text-3xl text-center mb-2">
          Where the Night Begins
        </h1>
        <p className="small-caps-ivory text-[10px] opacity-50 text-center mb-12">
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary border border-gold-subtle px-4 py-3 text-ivory text-sm font-body focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold-solid w-full">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-3">
          <p className="text-ivory-muted text-sm">
            Don't have an account?
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup/client" className="btn-gold-outline text-xs py-2 px-6">
              Join as Client
            </Link>
            <Link to="/signup/talent" className="btn-gold-outline text-xs py-2 px-6">
              Join as Talent
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
