import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

interface TalentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  stage_name: string;
  date_of_birth: string | null;
  country: string;
  languages: string;
  motivation: string;
  photo_url: string;
  id_document_url: string;
  status: string;
  admin_notes: string;
  created_at: string;
  reviewed_at: string | null;
}

interface Props {
  applications: TalentApplication[];
  onRefresh: () => void;
}

const statusColor = (s: string) => {
  if (s === "approved") return "default" as const;
  if (s === "rejected") return "destructive" as const;
  return "outline" as const;
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const TalentApplicationsTab = ({ applications, onRefresh }: Props) => {
  const [processing, setProcessing] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [idDocUrls, setIdDocUrls] = useState<Record<string, string>>({});

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase.rpc("approve_talent_application", { _application_id: id });
    if (error) toast.error(error.message);
    else { toast.success("Talent application approved"); onRefresh(); }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase.rpc("reject_talent_application", { _application_id: id, _notes: "" });
    if (error) toast.error(error.message);
    else { toast.success("Application rejected"); onRefresh(); }
    setProcessing(null);
  };

  const viewIdDoc = async (path: string, appId: string) => {
    if (idDocUrls[appId]) { window.open(idDocUrls[appId], "_blank"); return; }
    const { data } = await supabase.storage.from("talent-id-docs").createSignedUrl(path, 300);
    if (data?.signedUrl) {
      setIdDocUrls((prev) => ({ ...prev, [appId]: data.signedUrl }));
      window.open(data.signedUrl, "_blank");
    } else {
      toast.error("Could not load ID document");
    }
  };

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  const renderCard = (app: TalentApplication, showActions: boolean) => {
    const isExpanded = expanded === app.id;
    return (
      <div key={app.id} className="bg-card border border-border p-5 space-y-4">
        <div className="flex items-start gap-4">
          {/* Photo */}
          {app.photo_url ? (
            <img src={app.photo_url} alt={app.stage_name || app.full_name}
              className="w-16 h-16 object-cover border border-border flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-secondary border border-border flex items-center justify-center flex-shrink-0">
              <span className="text-muted-foreground text-xs">No photo</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-foreground font-heading text-base tracking-wide">{app.stage_name || "—"}</h4>
              <Badge variant={statusColor(app.status)} className="text-[9px] uppercase tracking-wider">
                {app.status}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{app.full_name} · {app.email}</p>
            <p className="text-muted-foreground text-[10px] mt-1">Applied {formatDate(app.created_at)}</p>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setExpanded(isExpanded ? null : app.id)}>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-4 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Date of Birth</p>
                <p className="text-foreground">{app.date_of_birth ? formatDate(app.date_of_birth) : "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Country</p>
                <p className="text-foreground">{app.country || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Languages</p>
                <p className="text-foreground">{app.languages || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">ID Document</p>
                {app.id_document_url ? (
                  <button onClick={() => viewIdDoc(app.id_document_url, app.id)}
                    className="text-primary hover:underline inline-flex items-center gap-1 text-sm">
                    <Eye className="h-3 w-3" /> View ID
                  </button>
                ) : <span className="text-muted-foreground">—</span>}
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest mb-1">Reason for Joining</p>
              <p className="text-foreground text-sm leading-relaxed">{app.motivation || "—"}</p>
            </div>

            {showActions && (
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" variant="default" disabled={processing === app.id}
                  onClick={() => handleApprove(app.id)} className="text-xs gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="destructive" disabled={processing === app.id}
                  onClick={() => handleReject(app.id)} className="text-xs gap-1">
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-foreground font-heading text-lg mb-3 tracking-wide">
          Pending Applications ({pending.length})
        </h3>
        <div className="space-y-3">
          {pending.map((app) => renderCard(app, true))}
          {pending.length === 0 && (
            <div className="bg-card border border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">No pending applications</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-foreground font-heading text-lg mb-3 tracking-wide">
          Reviewed ({reviewed.length})
        </h3>
        <div className="space-y-3">
          {reviewed.map((app) => renderCard(app, false))}
          {reviewed.length === 0 && (
            <div className="bg-card border border-border p-8 text-center">
              <p className="text-muted-foreground text-sm">No reviewed applications yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentApplicationsTab;
