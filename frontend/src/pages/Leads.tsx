import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScoreBadge } from "@/components/ScoreBadge";
import { useNavigate } from "react-router-dom";
import { useLeads, type Lead } from "@/hooks/useLeads";
import { Search, Plus, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
  New: "bg-primary/15 text-primary border-primary/30",
  Contacted: "bg-chart-4/15 text-chart-4 border-chart-4/30",
  Qualified: "bg-score-high/15 text-score-high border-score-high/30",
  Converted: "bg-score-high text-white border-0",
  Lost: "bg-muted text-muted-foreground border-0",
};

export default function Leads() {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { getLeads, createLeadMutation } = useLeads();
  const { data: leadsData = [], isLoading } = getLeads;

  const industries = [...new Set(leadsData.map((l) => l.industry).filter(Boolean))];
  const statuses = ["New", "Contacted", "Qualified", "Converted", "Lost"];

  const filtered = leadsData.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || (l.company || "").toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industryFilter === "all" || l.industry === industryFilter;
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    return matchesSearch && matchesIndustry && matchesStatus;
  });

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    try {
      await createLeadMutation.mutateAsync({
        name: fd.get("name") as string,
        email: fd.get("email") as string,
        company: fd.get("company") as string,
        jobRole: fd.get("jobRole") as string,
        industry: fd.get("industry") as string,
        notes: fd.get("notes") as string,
        source: "Manual",
        status: "New",
      });
      setDialogOpen(false);
      toast.success("Lead added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add lead");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm">{filtered.length} leads found</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("CSV import is a UI-only feature")}>
            <Upload className="mr-1.5 h-4 w-4" /> Import CSV
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" /> Add Lead</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>Fill in the lead details below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAdd} className="grid gap-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" name="company" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="jobRole">Job Role</Label>
                    <Input id="jobRole" name="jobRole" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" rows={2} />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Lead</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-full sm:w-40 h-9"><SelectValue placeholder="Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-36 h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden lg:table-cell">Industry</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading leads...
                  </div>
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-primary hover:underline">{lead.name}</p>
                      <p className="text-xs text-muted-foreground md:hidden">{lead.company || "-"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{lead.company || "-"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{lead.industry || "-"}</TableCell>
                  <TableCell className="text-center"><ScoreBadge score={lead.score || 0} /></TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={statusColor[lead.status] || ""}>{lead.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
