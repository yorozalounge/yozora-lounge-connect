import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const requirements = [
  "Women aged 18+ with sophisticated communication skills",
  "Fluent in English plus at least one additional language",
  "Culturally aware and well presented",
  "Professional, reliable, and committed to excellence",
];

const JoinPage = () => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="bg-yozora min-h-screen">
      <Navbar />
      <section className="pt-32 pb-20 px-6 lg:px-12 max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-heading text-gold tracking-[0.2em] text-4xl md:text-5xl mb-4">Join Us</h1>
          <p className="small-caps-ivory text-[10px] opacity-50 max-w-lg mx-auto">
            Apply to become a talent on the world's most exclusive online platform
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

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {[
            { label: "Full Legal Name", type: "text" },
            { label: "Stage Name", type: "text" },
            { label: "Date of Birth", type: "date" },
            { label: "Country of Residence", type: "text" },
            { label: "Languages Spoken", type: "text" },
          ].map((f) => (
            <div key={f.label}>
              <label className="small-caps-gold text-[10px] block mb-2">{f.label}</label>
              <input
                type={f.type}
                className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Photo Upload</label>
            <input type="file" accept="image/*" className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none" />
          </div>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Government ID Upload</label>
            <input type="file" className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none" />
          </div>
          <div>
            <label className="small-caps-gold text-[10px] block mb-2">Why do you want to join Yozora Lounge?</label>
            <textarea rows={5} className="w-full bg-card-dark border border-gold-subtle text-ivory text-sm p-3 font-body focus:outline-none focus:border-primary resize-none transition-colors" />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 accent-primary"
            />
            <span className="text-ivory text-xs opacity-70">I agree to the platform rules and terms of service</span>
          </label>

          <button type="submit" disabled={!agreed} className="btn-gold-solid w-full disabled:opacity-40">
            Submit Application
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
};

export default JoinPage;
