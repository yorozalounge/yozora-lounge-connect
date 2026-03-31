import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<"loading" | "valid" | "already" | "invalid" | "done" | "error">("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`, {
          headers: { apikey: anonKey },
        });
        const data = await res.json();
        if (data.valid === false && data.reason === "already_unsubscribed") setStatus("already");
        else if (data.valid) setStatus("valid");
        else setStatus("invalid");
      } catch { setStatus("error"); }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (data?.success) setStatus("done");
      else if (data?.reason === "already_unsubscribed") setStatus("already");
      else setStatus("error");
    } catch { setStatus("error"); }
    setProcessing(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="pt-40 pb-20 px-6 max-w-md mx-auto text-center">
        <div className="bg-card border border-border p-12">
          {status === "loading" && <p className="text-muted-foreground animate-pulse">Validating…</p>}
          {status === "valid" && (
            <>
              <h1 className="font-heading text-primary tracking-[0.2em] text-2xl mb-4">Unsubscribe</h1>
              <p className="text-foreground text-sm mb-6">Are you sure you want to unsubscribe from emails?</p>
              <Button onClick={handleUnsubscribe} disabled={processing}>
                {processing ? "Processing…" : "Confirm Unsubscribe"}
              </Button>
            </>
          )}
          {status === "done" && (
            <>
              <h1 className="font-heading text-primary tracking-[0.2em] text-2xl mb-4">Unsubscribed</h1>
              <p className="text-foreground text-sm">You have been successfully unsubscribed.</p>
            </>
          )}
          {status === "already" && (
            <>
              <h1 className="font-heading text-primary tracking-[0.2em] text-2xl mb-4">Already Unsubscribed</h1>
              <p className="text-foreground text-sm">You have already unsubscribed from emails.</p>
            </>
          )}
          {status === "invalid" && (
            <>
              <h1 className="font-heading text-primary tracking-[0.2em] text-2xl mb-4">Invalid Link</h1>
              <p className="text-foreground text-sm">This unsubscribe link is invalid or expired.</p>
            </>
          )}
          {status === "error" && (
            <>
              <h1 className="font-heading text-primary tracking-[0.2em] text-2xl mb-4">Error</h1>
              <p className="text-foreground text-sm">Something went wrong. Please try again later.</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
