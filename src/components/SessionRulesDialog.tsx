import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const talentRules = [
  "Be on time, presentable, and ready to give your full attention.",
  "No inappropriate or explicit conversation of any kind.",
  "Never share your personal contact information with clients.",
  "Never agree to meet a client in person under any circumstances.",
  "Never accept payment outside of Yozora Lounge.",
  "No eating, phone use, or distractions during sessions.",
  "No third parties visible or audible during your session.",
  "No recording sessions without written consent from the client.",
  "You may end any session immediately if you feel uncomfortable.",
  "Report any uncomfortable situations to Yozora Lounge immediately.",
  "Violations result in immediate removal from the platform.",
];

const clientRules = [
  "Treat your talent with complete respect at all times.",
  "No requests for inappropriate content of any kind.",
  "No solicitation of personal contact information.",
  "No asking for or arranging in-person meetings.",
  "No recording sessions without written consent from the talent.",
  "No payments outside of the Yozora Lounge platform.",
  "No third parties visible or audible during your session.",
  "Respect the talent's right to end a session at any time.",
  "Cancellations within 12 hours of session — no refund.",
  "No-shows — no refund.",
  "Violations result in immediate permanent ban from the platform.",
];

interface SessionRulesDialogProps {
  open: boolean;
  role: "client" | "talent";
  onAgree: () => void;
}

const SessionRulesDialog = ({ open, role, onAgree }: SessionRulesDialogProps) => {
  const rules = role === "talent" ? talentRules : clientRules;
  const title = role === "talent" ? "Talent Session Rules" : "Client Session Rules";

  return (
    <Dialog open={open}>
      <DialogContent
        className="bg-card-dark border-gold-subtle max-w-lg [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="font-heading text-gold tracking-[0.15em] text-xl text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] pr-4">
          <p className="text-ivory-muted text-xs mb-4 opacity-70">
            Please read and agree to the following rules before entering your session.
          </p>
          <ol className="space-y-3">
            {rules.map((rule, i) => (
              <li key={i} className="flex gap-3 text-ivory text-sm leading-relaxed">
                <span className="text-gold font-heading text-xs mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {rule}
              </li>
            ))}
          </ol>
        </ScrollArea>
        <DialogFooter className="mt-4">
          <Button onClick={onAgree} className="btn-gold-solid w-full">
            I Agree
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionRulesDialog;
