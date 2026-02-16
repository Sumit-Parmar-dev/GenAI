import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Shield, Activity } from "lucide-react";

const systemStatus = [
  { name: "Lead Scoring API", status: "Operational", ok: true },
  { name: "Email Service", status: "Operational", ok: true },
  { name: "Analytics Engine", status: "Degraded", ok: false },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account and system preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium">John Doe</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium">john.doe@company.com</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">Sales Manager</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Team</span>
              <span className="font-medium">Enterprise Sales</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemStatus.map((s) => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{s.name}</span>
                <Badge variant="outline" className={s.ok ? "bg-score-high/15 text-score-high border-score-high/30" : "bg-score-medium/15 text-score-medium border-score-medium/30"}>
                  {s.status}
                </Badge>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">Last synced: 2 minutes ago</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4" /> Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif" className="cursor-pointer">Email notifications</Label>
              <Switch id="email-notif" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="weekly-report" className="cursor-pointer">Weekly report digest</Label>
              <Switch id="weekly-report" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="cursor-pointer">Dark mode</Label>
              <Switch id="dark-mode" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
