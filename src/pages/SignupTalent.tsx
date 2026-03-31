import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const requirements = [
  "Women aged 18+ with sophisticated communication skills",
  "Fluent in English plus at least one additional language",
  "Culturally aware and well presented",
  "Professional, reliable, and committed to excellence",
];

const SignupTalent = () => {
  const [fullName, setFullName] = useState("");
  const [stageName, setStageName] = useState("");
  const [dob, setDob] = useState("");
  const [country, setCountry] = useState("");
  const [languages, setLanguages] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [motivation, setMotivation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [idDoc, setIdDoc] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Agreement required", description: "You must agree to the platform rules.", variant: "destructive" });
      return;
    }
    if (!photo) {
      toast({ title: "Photo required", description: "Please upload a photo.", variant: "destructive" });
      return;
    }
    if (!idDoc) {
      toast({ title: "ID required", description: "Please upload a government ID.", variant: "destructive" });
      return;
    }

    setLoading(true);

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          stage_name: stageName,
          date_of_birth: dob,
          country,
          languages,
          motivation,
          role: "talent",
        },
        emailRedirectTo: `${window.location.origin}/talent-dashboard`,
      },
    });

    if (authError) {
      setLoading(false);
      toast({ title: "Error", description: authError.message, variant: "destructive" });
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      setLoading(false);
      toast({ title: "Error", description: "Could not create account.", variant: "destructive" });
      return;
    }

    // 2. Upload photo
    const photoExt = photo.name.split(".").pop();
    const photoPath = `${userId}/photo.${photoExt}`;
    const { error: photoErr } = await supabase.storage.from("talent-photos").upload(photoPath, photo);
    const photoUrl = photoErr
      ? ""
      : supabase.storage.from("talent-photos").getPublicUrl(photoPath).data.publicUrl;

    // 3. Upload ID document
    const idExt = idDoc.name.split(".").pop();
    const idPath = `${userId}/id-doc.${idExt}`;
    await supabase.storage.from("talent-id-docs").upload(idPath, idDoc);
    const idDocUrl = idPath; // Store path, admin fetches signed URL

    // 4. Insert talent application
    await supabase.from("talent_applications" as any).insert({
      user_id: userId,
      full_name: fullName,
      email,
      stage_name: stageName,
      date_of_birth: dob,
      country,
      languages,
      motivation,
      photo_url: photoUrl,
      id_document_url: idDocUrl,
      status: "pending",
    } as any);

    // 5. Send admin notification email
    await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "new-talent-application",
        recipientEmail: "yozoralounge@outlook.com",
        idempotencyKey: `new-talent-app-${userId}`,
        templateData: {
          applicantName: fullName,
          stageName,
          email,
          country,
          languages,
        },
      },
    });

    setLoading(false);
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
              Application Submitted
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
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-4">
            Apply as Talent
          </h1>
          <p className="small-caps-ivory text-[10px] opacity-50 max-w-lg mx-auto">
            Apply to join the world's most exclusive online platform
          </p>
        </div>

        <div className="border border-gold-subtle p-8 mb-16">
          <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">What We're Looking For</h2>
          <ul className="space-y-3">
            {requirements.map((r, i) => (
              <li key={i} className="text-ivory text-sm opacity-70 flex items-start gap-3">
                <span className="text-gold mt-1 text-xs">◆</span> {r}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Account credentials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Password</label>
              <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          {/* Personal details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Full Legal Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Stage Name</label>
              <input type="text" required value={stageName} onChange={(e) => setStageName(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Date of Birth</label>
              <input type="date" required value={dob} onChange={(e) => setDob(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Country of Residence</label>
              <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="small-caps-gold text-[10px] block mb-2">Languages Spoken</label>
              <input type="text" required value={languages} onChange={(e) => setLanguages(e.target.value)}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>

          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Photo Upload</label>
            <input type="file" accept="image/*" required onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none" />
          </div>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Government ID Upload</label>
            <input type="file" required onChange={(e) => setIdDoc(e.target.files?.[0] ?? null)}
              className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none" />
          </div>

          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Why do you want to join Yozora Lounge?</label>
            <textarea rows={5} required value={motivation} onChange={(e) => setMotivation(e.target.value)}
              className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary resize-none transition-colors" />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 accent-primary" />
            <span className="text-ivory text-xs opacity-70">I agree to the platform rules and terms of service</span>
          </label>

          <button type="submit" disabled={!agreed || loading} className="btn-gold-solid w-full disabled:opacity-40">
            {loading ? "Submitting application..." : "Submit Application"}
          </button>
        </form>

        <p className="mt-8 text-center text-ivory-muted text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in</Link>
        </p>
      </section>
      <Footer />
    </div>
  );
};

export default SignupTalent;
