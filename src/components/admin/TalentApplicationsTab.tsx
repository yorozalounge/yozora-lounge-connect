import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface TalentApplication {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  bio: string;
  specialty: string;
  portfolio_url: string;
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
  if (s === "approved") return "default";
  if (s === "rejected") return "destructive";
  return "outline";
};

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const TalentApplicationsTab = ({ applications, onRefresh }: Props) => {
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase.rpc("approve_talent_application", {
      _application_id: id,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Talent application approved");
      onRefresh();
    }
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    const { error } = await supabase.rpc("reject_talent_application", {
      _application_id: id,
      _notes: "",
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Application rejected");
      onRefresh();
    }
    setProcessing(null);
  };

  const pending = applications.filter((a) => a.status === "pending");
  const reviewed = applications.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-8">
      {/* Pending applications */}
      <div>
        <h3 className="text-foreground font-heading text-lg mb-3 tracking-wide">
          Pending Applications ({pending.length})
        </h3>
        <div className="bg-card border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Name</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Email</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Specialty</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Portfolio</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Applied</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pending.map((app) => (
                <TableRow key={app.id} className="border-border">
                  <TableCell className="text-foreground text-sm font-medium">{app.full_name || "—"}</TableCell>
                  <TableCell className="text-foreground text-sm">{app.email}</TableCell>
                  <TableCell className="text-foreground text-sm">{app.specialty || "—"}</TableCell>
                  <TableCell>
                    {app.portfolio_url ? (
                      <a href={app.portfolio_url} target="_blank" rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1 text-sm">
                        View <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(app.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        disabled={processing === app.id}
                        onClick={() => handleApprove(app.id)}
                        className="text-xs gap-1"
                      >
                        <CheckCircle className="h-3.5 w-3.5" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={processing === app.id}
                        onClick={() => handleReject(app.id)}
                        className="text-xs gap-1"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {pending.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No pending applications
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reviewed applications */}
      <div>
        <h3 className="text-foreground font-heading text-lg mb-3 tracking-wide">
          Reviewed ({reviewed.length})
        </h3>
        <div className="bg-card border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Name</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Email</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Specialty</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-muted-foreground text-[10px] uppercase tracking-widest">Reviewed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviewed.map((app) => (
                <TableRow key={app.id} className="border-border">
                  <TableCell className="text-foreground text-sm">{app.full_name || "—"}</TableCell>
                  <TableCell className="text-foreground text-sm">{app.email}</TableCell>
                  <TableCell className="text-foreground text-sm">{app.specialty || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={statusColor(app.status)} className="text-[10px] uppercase tracking-wider">
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {app.reviewed_at ? formatDate(app.reviewed_at) : "—"}
                  </TableCell>
                </TableRow>
              ))}
              {reviewed.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No reviewed applications yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default TalentApplicationsTab;
