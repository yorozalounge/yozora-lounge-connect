import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import logo from "@/assets/logo.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConstellationBg from "@/components/ConstellationBg";
import TalentCard from "@/components/TalentCard";
import { talents } from "@/data/talents";

const reviews = [
  { text: "An absolutely refined experience. The conversations are genuine and the platform feels exclusive in the best way.", name: "James", country: "United States" },
  { text: "I've tried many platforms, but nothing compares to the quality and elegance of Yozora Lounge.", name: "Alexander", country: "United Kingdom" },
  { text: "The perfect blend of sophistication and authenticity. Every session feels like a premium experience.", name: "Hiroshi", country: "Japan" },
];

const steps = [
  { num: "01", title: "Browse", desc: "Discover extraordinary talents from around the world" },
  { num: "02", title: "Book", desc: "Choose your session length and purchase credits" },
  { num: "03", title: "Connect", desc: "Enjoy a private video session from anywhere in the world" },
];

const Index = () => (
  <div className="bg-yozora min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ConstellationBg />
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <img src={logo} alt="Yozora Lounge" className="w-[80vw] md:w-[65vw] lg:w-[50vw] h-auto -mb-2 mx-auto" />
        <p className="font-heading italic text-ivory text-xl md:text-2xl mb-6 opacity-80">
          Where the Night Begins
        </p>
        <p className="small-caps-ivory text-[10px] md:text-xs mb-12 opacity-50 max-w-xl mx-auto">
          Connect with extraordinary women from around the world
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/credits" className="btn-gold-solid">Book a Session</Link>
          <Link to="/talents" className="btn-gold-outline">Meet Our Talents</Link>
        </div>
      </div>
    </section>

    {/* Featured Talents */}
    <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-4">
          Featured Talents
        </h2>
        <p className="small-caps-ivory text-[10px] opacity-50">
          Extraordinary women from every corner of the world
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {talents.slice(0, 3).map((t) => (
          <TalentCard key={t.id} talent={t} />
        ))}
      </div>
    </section>

    {/* How It Works */}
    <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto">
      <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl text-center mb-20">
        How It Works
      </h2>
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
        <h2 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl mb-6">
          Client Reviews
        </h2>
        <div className="flex justify-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className="fill-primary text-primary" />
          ))}
        </div>
        <p className="small-caps-ivory text-[10px] opacity-50">Based on 500+ reviews</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="bg-card-dark border border-gold-subtle p-8">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} size={12} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-ivory font-heading italic text-sm leading-relaxed mb-6 opacity-80">
              "{r.text}"
            </p>
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

export default Index;
