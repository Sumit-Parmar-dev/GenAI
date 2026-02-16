import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { funnelData, conversionByScore } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { TrendingUp, Award, Clock } from "lucide-react";

const stats = [
  { label: "Best Converting Industry", value: "Healthcare", icon: Award },
  { label: "Avg. Time to Convert", value: "18 days", icon: Clock },
  { label: "Overall Conversion", value: "28.4%", icon: TrendingUp },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm">Pipeline performance & conversion metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-accent p-2.5">
                <s.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold font-display">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelData.map((item, i) => {
                const maxValue = funnelData[0].value;
                const pct = (item.value / maxValue) * 100;
                return (
                  <div key={item.stage} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{item.stage}</span>
                      <span className="text-muted-foreground">{item.value}</span>
                    </div>
                    <div className="h-8 w-full rounded-md bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-md transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: item.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Lead Score vs. Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={conversionByScore} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="score" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid hsl(var(--border))",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value: number, name: string, props: any) => {
                    if (name === "rate") return [`${value}%`, "Conversion Rate"];
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey={(d: any) => Math.round((d.converted / d.total) * 100)}
                  name="rate"
                  radius={[6, 6, 0, 0]}
                  fill="hsl(var(--primary))"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
