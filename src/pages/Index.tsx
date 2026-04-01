import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConstellationBg from "@/components/ConstellationBg";
import { supabase } from "@/integrations/supabase/client";

interface ApprovedTalent {
  id: string;
  stage_name: string | null;
  full_name: string;
  country: string | null;
  languages: string | null;
  bio: string | null;
  photo_url: string | null;
}

const reviews = [
  {
    text: "An absolutely refined experience. The conversations are genuine and the platform feels exclusive in the best way.",
    name: "James",
    country: "United States",
  },
  {
    text: "I've tried many platforms, but nothing compares to the quality and elegance of Yozora Lounge.",
    name: "Alexander",
    country: "United Kingdom",
  },
  {
    text: "The perfect blend of sophistication and authenticity. Every session feels like a premium experience.",
    name: "Hiroshi",
    country: "Japan",
  },
];

const steps = [
  { num: "01", title: "Browse", desc: "Discover extraordinary talents from around the world" },
  { num: "02", title: "Book", desc: "Choose your session length and purchase credits" },
  { num: "03", title: "Connect", desc: "Enjoy a private video session from anywhere in the world" },
];

const Index = () => {
  const [featuredTalents, setFeaturedTalents] = useState<ApprovedTalent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("talent_applications")
      .select("id, stage_name, full_name, country, languages, bio, photo_url")
      .eq("status", "approved")
      .limit(3)
      .then(({ data }) => {
        setFeaturedTalents(data || []);
      });
  }, []);

  const getLanguages = (lang: string | null) => {
    if (!lang) return [];
    return lang.split(",").map((l) => l.trim());
  };

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ConstellationBg />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <img src={logo} alt="Yozora Lounge" className="w-[65vw] md:w-[55vw] lg:w-[45vw] h-auto mb-0 mx-auto -mt-12" />
          <p className="font-heading italic text-ivory text-xl md:text-2xl mb-6 opacity-80 -mt-12 md:-mt-16 lg:-mt-20">
            Where the Night Begins
          </p>
          <p className="small-caps-ivory text-[10px] md:text-xs mb-12 opacity-50 max-w-xl mx-auto">
            Connect with extraordinary women from around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/credits" className="btn-gold-solid">
              Book a Session
            </Link>
            <Link to="/talents" className="btn-gold-outline">
              Meet Our Talents
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Talents */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-4">Featured Talents</h2>
          <p className="small-caps-ivory text-[10px] opacity-50">Extraordinary women from every corner of the world</p>
        </div>

        {featuredTalents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-ivory-muted text-sm opacity-50">Our talents are coming soon. Check back shortly.</p>
            <Link to="/talents" className="btn-gold-outline mt-6 inline-block">
              View All Talents
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTalents.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/talent/${t.id}`)}
                className="border border-gold-subtle bg-card-dark cursor-pointer hover:border-gold transition-all duration-300 group"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  {t.photo_url ? (
                    <img
                      src={t.photo_url}
                      alt={t.stage_name || t.full_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-card-dark flex items-center justify-center">
                      <span className="text-ivory-muted text-sm opacity-40">Photo coming soon</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 px-2 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] text-ivory tracking-wider">ONLINE</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-gold tracking-[0.15em] text-xl mb-1">
                    {t.stage_name || t.full_name}
                  </h3>
                  {t.country && <p className="text-ivory-muted text-[11px] small-caps-ivory mb-2">{t.country}</p>}
                  {t.languages && (
                    <p className="text-ivory-muted text-[11px] opacity-60 mb-4">
                      {getLanguages(t.languages).join(" · ")}
                    </p>
                  )}
                  <button className="w-full border border-gold-subtle text-gold text-[11px] tracking-widest py-2.5 hover:bg-gold hover:text-black transition-all duration-300">
                    VIEW PROFILE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl text-center mb-20">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {steps.map((s) => (
            <div key={s.num} className="relative text-center">
              <span className="font-heading text-gold text-[6rem] leading-none opacity-10 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4">
                {s.num}
              </span>
              <div className="relative pt-16">
                <h3 className="small-caps-ivory text-sm mb-4">{s.title}</h3>
                <p className="text-ivory-muted text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-6">Client Reviews</h2>
          <div className="flex justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-primary text-primary" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="bg-card-dark border border-gold-subtle p-8">
              <div className="flex gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={12} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-ivory font-heading italic text-sm leading-relaxed mb-6 opacity-80">"{r.text}"</p>
              <p className="small-caps-gold text-[10px]">
                {r.name}, {r.country}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
