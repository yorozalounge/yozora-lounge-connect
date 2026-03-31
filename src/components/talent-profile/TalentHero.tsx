import { Star } from "lucide-react";
import type { Talent } from "@/data/talents";

const TalentHero = ({ talent }: { talent: Talent }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
    {/* Portrait */}
    <div className="aspect-[3/4] overflow-hidden border border-gold-subtle">
      <img
        src={talent.image}
        alt={talent.name}
        className="w-full h-full object-cover"
      />
    </div>

    {/* Info */}
    <div className="flex flex-col justify-center">
      {talent.online && (
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="small-caps-gold text-[10px]">Online Now</span>
        </div>
      )}

      <h1 className="font-heading text-gold tracking-[0.2em] text-3xl md:text-4xl lg:text-5xl mb-3">
        {talent.name}
      </h1>

      <p className="small-caps-ivory text-[10px] opacity-60 mb-3">
        {talent.flag} {talent.country}
      </p>

      <p className="text-ivory text-sm opacity-70 mb-4">
        {talent.languages.join(" · ")}
      </p>

      <div className="flex items-center gap-2 mb-8">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < Math.floor(talent.rating) ? "fill-primary text-primary" : "text-primary/30"}
            />
          ))}
        </div>
        <span className="text-ivory text-sm opacity-60">{talent.rating}</span>
        <span className="text-ivory-muted text-sm">· {talent.sessions} sessions</span>
      </div>

      {/* Bio */}
      <div className="border-t border-gold-subtle pt-8">
        <h2 className="font-heading text-gold tracking-[0.15em] text-lg mb-4">About</h2>
        <p className="text-ivory text-sm leading-relaxed opacity-70">
          {talent.bio}
        </p>
      </div>
    </div>
  </div>
);

export default TalentHero;
