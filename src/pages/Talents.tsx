import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type SortOption = "default" | "price-high" | "price-low";

interface ApprovedTalent {
  id: string;
  stage_name: string | null;
  full_name: string;
  country: string | null;
  languages: string | null;
  bio: string | null;
  photo_url: string | null;
  specialty: string | null;
}

const TalentsPage = () => {
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [talents, setTalents] = useState<ApprovedTalent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase
      .from("talent_applications")
      .select("id, stage_name, full_name, country, languages, bio, photo_url, specialty")
      .eq("status", "approved")
      .then(({ data }) => {
        setTalents(data || []);
        setLoading(false);
      });
  }, []);

  const allCountries = [...new Set(talents.map((t) => t.country).filter(Boolean))].sort() as string[];

  const filtered = useMemo(() => {
    let list = [...talents];
    if (selectedCountry !== "all") {
      list = list.filter((t) => t.country === selectedCountry);
    }
    return list;
  }, [sort, selectedCountry, talents]);

  const getLanguages = (lang: string | null) => {
    if (!lang) return [];
    return lang.split(",").map((l) => l.trim());
  };

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">Our Talents</h1>
          <p className="small-caps-ivory text-[10px] opacity-50">Extraordinary women from every corner of the world</p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="small-caps-gold text-[10px]">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-card-dark border border-gold-subtle text-ivory text-xs p-2 pr-8 font-body focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Countries</option>
                {allCountries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className="small-caps-gold">
            {filtered.length} Talent{filtered.length !== 1 ? "s" : ""} Available
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-ivory-muted text-sm">Loading talents...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ivory-muted text-sm opacity-60">No talents available yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((t) => (
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
                      <span className="text-ivory-muted text-sm opacity-40">No photo</span>
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
      <Footer />
    </div>
  );
};

export default TalentsPage;
