import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TalentCard from "@/components/TalentCard";
import { talents } from "@/data/talents";
import { supabase } from "@/integrations/supabase/client";

type SortOption = "default" | "price-high" | "price-low";

const allCountries = [...new Set(talents.map((t) => t.country))].sort();

const TalentsPage = () => {
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [approvedCount, setApprovedCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("talent_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved")
      .then(({ count }) => setApprovedCount(count ?? null));
  }, []);

  const filtered = useMemo(() => {
    let list = [...talents];
    if (selectedCountry !== "all") {
      list = list.filter((t) => t.country === selectedCountry);
    }
    if (sort === "price-high") list.sort((a, b) => b.credits - a.credits);
    else if (sort === "price-low") list.sort((a, b) => a.credits - b.credits);
    return list;
  }, [sort, selectedCountry]);

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">Our Talents</h1>
          <p className="small-caps-ivory text-[10px] opacity-50">Extraordinary women from every corner of the world</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            {/* Price sort */}
            <div className="flex items-center gap-2">
              <label className="small-caps-gold text-[10px]">Sort by Price</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-card-dark border border-gold-subtle text-ivory text-xs p-2 pr-8 font-body focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="default">Default</option>
                <option value="price-high">Highest First</option>
                <option value="price-low">Lowest First</option>
              </select>
            </div>

            {/* Country filter */}
            <div className="flex items-center gap-2">
              <label className="small-caps-gold text-[10px]">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-card-dark border border-gold-subtle text-ivory text-xs p-2 pr-8 font-body focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Countries</option>
                {allCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <span className="small-caps-gold">{approvedCount !== null ? approvedCount : filtered.length} Talent{(approvedCount !== null ? approvedCount : filtered.length) !== 1 ? "s" : ""} Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filtered.map((t) => (
            <TalentCard key={t.id} talent={t} />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-ivory-muted text-sm">No talents match your filters</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TalentsPage;
