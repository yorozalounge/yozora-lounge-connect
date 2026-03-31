import { Star } from "lucide-react";
import type { Talent } from "@/data/talents";

const TalentCard = ({ talent }: { talent: Talent }) => (
  <div className="bg-card-dark border border-gold-subtle overflow-hidden group transition-all duration-500 hover:border-primary/30">
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={talent.image}
        alt={talent.name}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {talent.online && (
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="small-caps-gold text-[10px]">Online</span>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="font-heading text-gold tracking-[0.15em] text-lg mb-2">{talent.name}</h3>
      <p className="small-caps-ivory text-[10px] mb-3">
        {talent.flag} {talent.country}
      </p>
      <p className="text-ivory text-xs opacity-60 mb-3">
        {talent.languages.join(" · ")}
      </p>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={12}
              className={i < Math.floor(talent.rating) ? "fill-primary text-primary" : "text-primary/30"}
            />
          ))}
        </div>
        <span className="text-ivory text-xs opacity-60">{talent.rating}</span>
        <span className="text-ivory-muted text-xs">· {talent.sessions} sessions</span>
      </div>
      <p className="text-gold text-sm mb-4">From {talent.credits.toLocaleString()} credits</p>
      <button className="btn-gold-outline w-full text-xs py-2">View Profile</button>
    </div>
  </div>
);

export default TalentCard;
