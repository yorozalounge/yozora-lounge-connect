import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { num: "01", title: "Browse", desc: "Explore our curated selection of extraordinary talents from around the world. Each profile features detailed information about their background, languages spoken, cultural expertise, and conversation specialties. Read reviews from other clients to find the perfect match for your interests.", icon: "🌍" },
  { num: "02", title: "Book", desc: "Choose your preferred session length — 20, 40, or 60 minutes. Purchase credits through our secure payment system. Credits never expire and can be used across any talent on the platform. Select your preferred date and time that works across time zones.", icon: "📅" },
  { num: "03", title: "Connect", desc: "Join your private video session from anywhere in the world. Our platform ensures crystal-clear video and audio quality. Enjoy authentic cultural exchange, language practice, or simply engaging conversation with remarkable women from diverse backgrounds.", icon: "✨" },
];

const HowItWorksPage = () => (
  <div className="bg-yozora min-h-screen">
    <Navbar />
    <section className="pt-32 pb-20 px-6 lg:px-12 max-w-4xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">How It Works</h1>
        <p className="small-caps-ivory text-[10px] opacity-50">Your journey to extraordinary connections</p>
      </div>
      <div className="space-y-24">
        {steps.map((s) => (
          <div key={s.num} className="relative">
            <span className="font-heading text-gold text-[8rem] leading-none opacity-[0.07] absolute -top-8 left-0">
              {s.num}
            </span>
            <div className="relative pl-4">
              <span className="text-3xl mb-4 block">{s.icon}</span>
              <h2 className="small-caps-ivory text-lg mb-4">{s.title}</h2>
              <p className="text-ivory-muted text-sm leading-relaxed max-w-2xl">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    <Footer />
  </div>
);

export default HowItWorksPage;
