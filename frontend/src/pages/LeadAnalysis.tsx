import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoreBadge, PriorityLabel } from "@/components/ScoreBadge";
import { leads, aiInsights } from "@/data/mockData";
import { Mail, Phone, Building2, Briefcase, TrendingUp, TrendingDown, Minus } from "lucide-react";

const impactIcon = { positive: TrendingUp, negative: TrendingDown, neutral: Minus };
const impactColor = { positive: "text-score-high", negative: "text-score-low", neutral: "text-muted-foreground" };

export default function LeadAnalysis() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id") || leads[0].id;
  const [selectedId, setSelectedId] = useState(initialId);

  const lead = leads.find((l) => l.id === selectedId) || leads[0];
  const insight = aiInsights[lead.id];

  const scoreColor = lead.score >= 70 ? "text-score-high" : lead.score >= 40 ? "text-score-medium" : "text-score-low";
  const ringColor = lead.score >= 70 ? "border-score-high" : lead.score >= 40 ? "border-score-medium" : "border-score-low";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Lead Analysis</h1>
          <p className="text-muted-foreground text-sm">AI-powered lead scoring & insights</p>
        </div>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-full sm:w-64 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {leads.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name} — {l.company}
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
              <p className="text-sm text-muted-foreground">{lead.jobRole}</p>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" /> {lead.company} · {lead.industry}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {lead.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> {lead.phone}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" /> Status: {lead.status}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Gauge */}
        <Card className="shadow-sm flex flex-col items-center justify-center">
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <div className={`flex h-36 w-36 items-center justify-center rounded-full border-[6px] ${ringColor}`}>
              <span className={`text-5xl font-bold font-display ${scoreColor}`}>{lead.score}</span>
            </div>
            <PriorityLabel score={lead.score} />
            <p className="text-xs text-muted-foreground text-center">AI Confidence: {lead.score >= 70 ? "High" : lead.score >= 40 ? "Moderate" : "Low"}</p>
          </CardContent>
        </Card>

        {/* AI Explanation */}
        <Card className="shadow-sm lg:row-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Explainable AI Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{insight.summary}</p>
            <div className="space-y-3">
              {insight.factors.map((f, i) => {
                const Icon = impactIcon[f.impact];
                return (
                  <div key={i} className="flex items-start gap-2">
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${impactColor[f.impact]}`} />
                    <div>
                      <p className="text-sm font-medium">{f.label}</p>
                      <p className="text-xs text-muted-foreground">{f.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
