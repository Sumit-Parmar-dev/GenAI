import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoreBadge, PriorityLabel } from "@/components/ScoreBadge";
import { useLeads } from "@/hooks/useLeads";
import { Loader2, Mail, Phone, Building2, Briefcase, DollarSign, Sparkles, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryColor: Record<string, string> = {
  Hot: "bg-score-low text-white border-0",
  Warm: "bg-score-medium text-white border-0",
  Cold: "bg-primary/15 text-primary border-primary/30",
};

export default function LeadAnalysis() {
  const [searchParams] = useSearchParams();
  const { getLeads } = useLeads();
  const { data: leads = [], isLoading } = getLeads;

  const initialId = searchParams.get("id") || (leads[0]?.id?.toString() ?? "");
  const [selectedId, setSelectedId] = useState<string>(initialId);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-2">
        <p className="text-muted-foreground">No leads available for analysis.</p>
      </div>
    );
  }

  const effectiveId = selectedId || leads[0].id.toString();
  const lead = leads.find((l) => l.id.toString() === effectiveId) || leads[0];

  const scoreColor =
    lead.aiScore >= 70 ? "text-score-high"
      : lead.aiScore >= 40 ? "text-score-medium"
        : "text-score-low";
  const ringColor =
    lead.aiScore >= 70 ? "border-score-high"
      : lead.aiScore >= 40 ? "border-score-medium"
        : "border-score-low";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Lead Analysis</h1>
          <p className="text-muted-foreground text-sm">AI-powered lead scoring &amp; insights</p>
        </div>
        <Select
          value={effectiveId}
          onValueChange={setSelectedId}
        >
          <SelectTrigger className="w-full sm:w-64 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {leads.map((l) => (
              <SelectItem key={l.id} value={l.id.toString()}>
                {l.name}{l.company ? ` — ${l.company}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lead Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg font-semibold font-display">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.jobRole || "—"}</p>
            </div>
            <div className="space-y-2.5 text-sm">
              {(lead.company || lead.industry) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4 shrink-0" />
                  {[lead.company, lead.industry].filter(Boolean).join(" · ")}
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" /> {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 shrink-0" /> {lead.phone}
                </div>
              )}
              {lead.budget != null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4 shrink-0" /> ${lead.budget.toLocaleString()} budget
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 shrink-0" /> Status: {lead.status}
              </div>
              {lead.aiCategory && (
                <Badge variant="outline" className={categoryColor[lead.aiCategory] || ""}>
                  {lead.aiCategory} Lead
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Gauge */}
        <Card className="shadow-sm flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full border-[6px] ${ringColor}`}>
              <span className={`text-5xl font-bold font-display ${scoreColor}`}>{lead.aiScore}</span>
            </div>
            <PriorityLabel score={lead.aiScore} />
            <p className="text-xs text-muted-foreground text-center">
              AI Confidence: {lead.aiScore >= 70 ? "High" : lead.aiScore >= 40 ? "Moderate" : "Low"}
            </p>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lead.aiReason ? (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Scoring Reason</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{lead.aiReason}</p>
              </div>
            ) : null}
            {lead.aiInsight ? (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Insight</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{lead.aiInsight}</p>
              </div>
            ) : null}
            {!lead.aiReason && !lead.aiInsight && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Bot className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No AI insights yet for this lead.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Email Draft (full width) */}
      {lead.aiEmailDraft && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI Email Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap leading-relaxed font-mono bg-muted/30 rounded-lg border p-4">
              {lead.aiEmailDraft}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
