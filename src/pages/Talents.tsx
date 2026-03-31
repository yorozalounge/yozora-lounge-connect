import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TalentCard from "@/components/TalentCard";
import { talents } from "@/data/talents";

const TalentsPage = () => (
  <div className="bg-yozora min-h-screen">
    <Navbar />
    <section className="pt-32 pb-20 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">Our Talents</h1>
        <p className="small-caps-ivory text-[10px] opacity-50">Extraordinary women from every corner of the world</p>
      </div>
      <div className="flex items-center justify-between mb-12">
        <button className="btn-gold-outline text-xs py-2 px-6">Filter</button>
        <span className="small-caps-gold">{talents.length} Talents Available</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {talents.map((t) => (
          <TalentCard key={t.id} talent={t} />
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default TalentsPage;
