import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScoreBadge } from "@/components/ScoreBadge";
import { leads, scoreDistribution } from "@/data/mockData";
import { Users, TrendingUp, Target, Brain } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Leads", value: leads.length, icon: Users, trend: "+12%", up: true },
  { label: "High-Priority", value: leads.filter((l) => l.score >= 70).length, icon: Target, trend: "+8%", up: true },
  { label: "Conversion Rate", value: "28.4%", icon: TrendingUp, trend: "+3.2%", up: true },
  { label: "Avg. Lead Score", value: Math.round(leads.reduce((a, b) => a + b.score, 0) / leads.length), icon: Brain, trend: "-1%", up: false },
];

const barColor = (range: string) => {
  const num = parseInt(range.split("-")[1]);
  if (num <= 39) return "hsl(var(--score-low))";
  if (num <= 59) return "hsl(var(--score-medium))";
  return "hsl(var(--score-high))";
};

export default function Dashboard() {
  const navigate = useNavigate();
  const topLeads = [...leads].sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your lead pipeline</p>
        <p className="mt-2 text-sm font-medium text-score-high">“Yes, basic CRM functionality is complete.”</p>
      </div>

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
                  <s.icon className="h-5 w-5 text-accent-foreground" />
                </div>
              </div>
              <p className={`mt-2 text-xs font-medium ${s.up ? "text-score-high" : "text-score-low"}`}>
                {s.up ? "↑" : "↓"} {s.trend} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Lead Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={scoreDistribution} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
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
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent High-Score Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell className="text-muted-foreground">{lead.company}</TableCell>
                    <TableCell className="text-center">
                      <ScoreBadge score={lead.score} />
                    </TableCell>
                    <TableCell className="text-right">
                      <button
                        onClick={() => navigate(`/analysis?id=${lead.id}`)}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        View →
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
