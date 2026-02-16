import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leads, outreachTemplates } from "@/data/mockData";
import { Copy, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const tones = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "persuasive", label: "Persuasive" },
];

export default function AIOutreach() {
  const [selectedId, setSelectedId] = useState(leads[0].id);
  const [tone, setTone] = useState("formal");
  const [refreshKey, setRefreshKey] = useState(0);

  const lead = leads.find((l) => l.id === selectedId) || leads[0];
  const template = outreachTemplates[tone]?.[lead.id];

  const handleCopy = () => {
    if (template) {
      navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
      toast.success("Copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">AI Outreach</h1>
        <p className="text-muted-foreground text-sm">Generate personalized sales emails</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger className="w-full sm:w-64 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {leads.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name} — {l.company}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          {tones.map((t) => (
            <Button
              key={t.value}
              variant={tone === t.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTone(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>

      {template && (
        <Card className="shadow-sm" key={`${selectedId}-${tone}-${refreshKey}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Generated Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-secondary/30 p-4 space-y-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{template.subject}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">Body</p>
                <p className="text-sm whitespace-pre-line leading-relaxed">{template.body}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleCopy}>
                <Copy className="mr-1.5 h-4 w-4" /> Copy to Clipboard
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRefreshKey((k) => k + 1);
                  toast.info("Email regenerated (mock)");
                }}
              >
                <RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
