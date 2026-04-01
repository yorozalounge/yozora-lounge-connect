import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TIP_OPTIONS = [
  { amount: 500, label: "500", emoji: "💫" },
  { amount: 1000, label: "1K", emoji: "⭐" },
  { amount: 3000, label: "3K", emoji: "💎" },
  { amount: 10000, label: "10K", emoji: "👑" },
  { amount: 30000, label: "30K", emoji: "🌟" },
];

interface TipPanelProps {
  bookingId: string;
  talentId: string;
  talentName: string;
}

const TipPanel = ({ bookingId, talentId, talentName }: TipPanelProps) => {
  const { toast } = useToast();
  const [sending, setSending] = useState<number | null>(null);
  const [lastTip, setLastTip] = useState<number | null>(null);

  const handleTip = async (amount: number) => {
    setSending(amount);

    const { error } = await supabase.rpc("send_tip", {
      _booking_id: bookingId,
      _talent_id: talentId,
      _amount: amount,
    });

    setSending(null);

    if (error) {
      toast({
        title: "Tip failed",
        description: error.message.includes("Insufficient")
          ? "You don't have enough credits."
          : error.message,
        variant: "destructive",
      });
      return;
    }

    setLastTip(amount);
    toast({
      title: `${amount.toLocaleString()} credits sent!`,
      description: `${talentName} received ${(amount / 2).toLocaleString()} credits.`,
    });

    setTimeout(() => setLastTip(null), 2000);
  };

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart size={14} className="text-primary" />
        <span className="text-foreground text-xs font-body uppercase tracking-[0.15em]">Send a Tip</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {TIP_OPTIONS.map((opt) => (
          <button
            key={opt.amount}
            onClick={() => handleTip(opt.amount)}
            disabled={sending !== null}
            className={`
              relative flex items-center gap-1.5 px-3 py-2 border text-xs transition-all duration-200
              ${lastTip === opt.amount
                ? "border-primary bg-primary/20 text-primary scale-105"
                : "border-border text-foreground hover:border-primary/40 hover:bg-primary/5"
              }
              disabled:opacity-40
            `}
          >
            <span>{opt.emoji}</span>
            <span className="font-heading text-primary">{opt.label}</span>
            {sending === opt.amount && (
              <Sparkles size={12} className="text-primary animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground text-[10px] mt-2 opacity-60">
        
      </p>
    </div>
  );
};

export default TipPanel;
