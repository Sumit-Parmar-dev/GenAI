import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail, Building, Briefcase, Globe, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
    New: "bg-primary/15 text-primary border-primary/30",
    Contacted: "bg-chart-4/15 text-chart-4 border-chart-4/30",
    Qualified: "bg-score-high/15 text-score-high border-score-high/30",
    Converted: "bg-score-high text-white border-0",
    Lost: "bg-muted text-muted-foreground border-0",
};

export default function LeadDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getLead, updateLeadMutation } = useLead(id!);

    const { data: lead, isLoading } = getLead;

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateLeadMutation.mutateAsync({ status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Lead not found.</p>
                <Button onClick={() => navigate("/leads")}>Back to Leads</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/leads")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="font-display text-2xl font-bold tracking-tight">Lead Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{lead.name}</CardTitle>
                            <Badge variant="outline" className={statusColor[lead.status] || ""}>
                                {lead.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Building className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.company || "No company"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.jobRole || "No job role"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span>{lead.industry || "No industry"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="h-4 w-4" />
                                <span>Notes</span>
                            </div>
                            <p className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                                {lead.notes || "No notes provided."}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Update Status</Label>
                            <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                    <SelectItem value="Qualified">Qualified</SelectItem>
                                    <SelectItem value="Converted">Converted</SelectItem>
                                    <SelectItem value="Lost">Lost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="pt-4 space-y-2">
                            <Button className="w-full" variant="outline">Schedule Follow-up</Button>
                            <Button className="w-full" variant="outline">Send Email</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
