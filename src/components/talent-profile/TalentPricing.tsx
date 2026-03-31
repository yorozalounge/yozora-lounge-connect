import { Clock } from "lucide-react";
import type { Talent } from "@/data/talents";

interface TalentPricingProps {
  talent: Talent;
  selectedDuration: number | null;
  onSelect: (duration: number) => void;
}

const durationLabels: Record<number, string> = {
  20: "20 minutes",
  40: "40 minutes",
  60: "60 minutes",
};

const TalentPricing = ({ talent, selectedDuration, onSelect }: TalentPricingProps) => (
  <div className="border border-gold-subtle p-8">
    <h2 className="font-heading text-gold tracking-[0.15em] text-xl mb-6">Session Pricing</h2>
    <div className="space-y-3">
      {talent.pricing.map((opt) => (
        <button
          key={opt.duration}
          onClick={() => onSelect(opt.duration)}
          className={`w-full flex items-center justify-between p-4 border transition-all duration-200 ${
            selectedDuration === opt.duration
              ? "border-primary bg-primary/10"
              : "border-gold-subtle hover:border-primary/40"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gold" />
            <span className="text-ivory text-sm">{durationLabels[opt.duration] ?? `${opt.duration} min`}</span>
          </div>
          <span className="font-heading text-gold text-sm">
            {opt.credits.toLocaleString()} credits
          </span>
        </button>
      ))}
    </div>
  </div>
);

export default TalentPricing;
