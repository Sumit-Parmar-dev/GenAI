import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { useLeads } from "@/hooks/useLeads";
import { Users, TrendingUp, Target, Brain, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

const statusColor: Record<string, string> = {
  New: "bg-primary/15 text-primary border-primary/30",
  Contacted: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Qualified: "bg-score-high/15 text-score-high border-score-high/30",
  Converted: "bg-score-high text-white border-0",
  Lost: "bg-muted text-muted-foreground border-0",
};

const barColor = (range: string) => {
  const num = parseInt(range.split("–")[1]);
  if (num <= 39) return "hsl(var(--score-low))";
  if (num <= 59) return "hsl(var(--score-medium))";
  if (num <= 79) return "hsl(var(--score-medium))";
  return "hsl(var(--score-high))";
};

const CATEGORY_COLORS: Record<string, string> = {
  Hot: "hsl(var(--score-low))",
  Warm: "hsl(var(--score-medium))",
  Cold: "hsl(var(--primary))",
  Unscored: "hsl(var(--muted-foreground))",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { getLeads } = useLeads();
  const { data: leads = [], isLoading } = getLeads;

  // ── Computed stats ──────────────────────────────────────────────────────
  const total = leads.length;
  const highPriority = leads.filter((l) => l.aiScore >= 70).length;
  const converted = leads.filter((l) => l.isConverted).length;
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) + "%" : "—";
  const avgScore =
    total > 0
      ? Math.round(leads.reduce((sum, l) => sum + (l.aiScore ?? 0), 0) / total)
      : 0;

  const stats = [
    { label: "Total Leads", value: total, icon: Users, color: "text-primary" },
    { label: "High Priority", value: highPriority, icon: Target, color: "text-score-low" },
    { label: "Conversion Rate", value: conversionRate, icon: TrendingUp, color: "text-score-high" },
    { label: "Avg. AI Score", value: avgScore, icon: Brain, color: "text-score-medium" },
  ];

  // ── Score distribution (bands of 20) ───────────────────────────────────
  const BANDS = ["0–19", "20–39", "40–59", "60–79", "80–100"];
  const scoreDistribution = BANDS.map((range) => {
    const [lo, hi] = range.split("–").map(Number);
    return {
      range,
      count: leads.filter((l) => l.aiScore >= lo && l.aiScore <= hi).length,
    };
  });

  // ── Category breakdown for pie chart ────────────────────────────────────
  const categoryMap: Record<string, number> = { Hot: 0, Warm: 0, Cold: 0, Unscored: 0 };
  leads.forEach((l) => {
    if (l.aiCategory && categoryMap[l.aiCategory] !== undefined) categoryMap[l.aiCategory]++;
    else if (!l.aiCategory) categoryMap.Unscored++;
  });
  const categoryData = Object.entries(categoryMap)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // ── Status breakdown ─────────────────────────────────────────────────────
  const statusMap: Record<string, number> = {};
  leads.forEach((l) => { statusMap[l.status] = (statusMap[l.status] || 0) + 1; });
  const statusData = Object.entries(statusMap).sort((a, b) => b[1] - a[1]);

  // ── Top 5 leads by AI score ──────────────────────────────────────────────
  const topLeads = [...leads].sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0)).slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your lead pipeline — {total} total leads</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold font-display">{s.value}</p>
                </div>
                <div className="rounded-lg bg-accent p-2.5">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score distribution bar chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">AI Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {total === 0 ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">No leads yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={scoreDistribution} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Leads">
                    {scoreDistribution.map((entry, i) => (
                      <Cell key={i} fill={barColor(entry.range)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Category pie chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Lead Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">No AI scores yet — add leads to score them</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || "#8884d8"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top leads table */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Top Leads by AI Score</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topLeads.length === 0 ? (
              <p className="p-6 text-sm text-muted-foreground">No leads yet. Add your first lead to get started.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Company</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="text-center">AI Score</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{lead.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{lead.company || "—"}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">{lead.company || "—"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={statusColor[lead.status] || ""}>{lead.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <ScoreBadge score={lead.aiScore ?? 0} />
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => navigate(`/leads/${lead.id}`)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          View →
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Status breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {statusData.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet</p>
            ) : (
              statusData.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <Badge variant="outline" className={statusColor[status] || ""}>{status}</Badge>
                  <div className="flex items-center gap-2">
                    <div className="h-2 rounded-full bg-muted overflow-hidden w-24">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium tabular-nums w-6 text-right">{count}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
