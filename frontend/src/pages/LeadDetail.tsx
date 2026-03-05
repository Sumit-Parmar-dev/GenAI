import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/hooks/useLeads";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScoreBadge, PriorityLabel } from "@/components/ScoreBadge";
import {
    Loader2, ArrowLeft, Mail, Building, Briefcase, Globe,
    Calendar, FileText, Phone, DollarSign, Sparkles, CheckCircle2,
    Trash2, Bot, MailOpen, Link2, Wand2,
} from "lucide-react";
import { toast } from "sonner";

const statusColor: Record<string, string> = {
    New: "bg-primary/15 text-primary border-primary/30",
    Contacted: "bg-chart-4/15 text-chart-4 border-chart-4/30",
    Qualified: "bg-score-high/15 text-score-high border-score-high/30",
    Converted: "bg-score-high text-white border-0",
    Lost: "bg-muted text-muted-foreground border-0",
};

const categoryColor: Record<string, string> = {
    Hot: "bg-score-low text-white border-0",
    Warm: "bg-score-medium text-white border-0",
    Cold: "bg-primary/15 text-primary border-primary/30",
};

export default function LeadDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getLead, updateLeadMutation, deleteLeadMutation, convertLeadMutation, rescoreLeadMutation } = useLead(id!);

    const { data: lead, isLoading } = getLead;

    const handleRescore = async () => {
        try {
            await rescoreLeadMutation.mutateAsync();
            toast.success("Lead re-scored with AI!");
        } catch (error: any) {
            toast.error(error.message || "ML service unavailable");
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateLeadMutation.mutateAsync({ status: newStatus });
            toast.success(`Status updated to ${newStatus}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    const handleConvert = async () => {
        try {
            await convertLeadMutation.mutateAsync();
            toast.success("Lead marked as converted!");
        } catch (error: any) {
            toast.error(error.message || "Failed to convert lead");
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this lead?")) return;
        try {
            await deleteLeadMutation.mutateAsync();
            toast.success("Lead deleted");
            navigate("/leads");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete lead");
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
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/leads")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="font-display text-2xl font-bold tracking-tight">Lead Details</h1>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={handleDelete}
                    disabled={deleteLeadMutation.isPending}
                >
                    {deleteLeadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* ── Main Info ── */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-xl">{lead.name}</CardTitle>
                                {lead.aiCategory && (
                                    <Badge variant="outline" className={categoryColor[lead.aiCategory] || ""}>
                                        {lead.aiCategory}
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className={statusColor[lead.status] || ""}>{lead.status}</Badge>
                                {lead.isConverted && (
                                    <Badge className="bg-score-high text-white border-0 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" /> Converted
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{lead.email}</span>
                            </div>
                            {lead.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span>{lead.phone}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Building className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{lead.company || "No company"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{lead.jobRole || "No job role"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>{lead.industry || "No industry"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Link2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>Source: {lead.source}</span>
                            </div>
                            {lead.budget != null && (
                                <div className="flex items-center gap-3 text-sm">
                                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span>Budget: ${lead.budget.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span>Created: {new Date(lead.createdAt).toLocaleDateString()}</span>
                            </div>
                            {lead.isConverted && lead.convertedAt && (
                                <div className="flex items-center gap-3 text-sm text-score-high">
                                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                                    <span>Converted: {new Date(lead.convertedAt).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>

                        {lead.notes && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <FileText className="h-4 w-4" />
                                        <span>Notes</span>
                                    </div>
                                    <p className="rounded-lg border bg-muted/30 p-4 text-sm whitespace-pre-wrap">
                                        {lead.notes}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* ── AI Section ── */}
                        {(lead.aiReason || lead.aiInsight || lead.aiEmailDraft) && (
                            <>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        <span>AI Insights</span>
                                    </div>

                                    {lead.aiReason && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Scoring Reason</p>
                                            <p className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">{lead.aiReason}</p>
                                        </div>
                                    )}
                                    {lead.aiInsight && (
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Insight</p>
                                            <p className="rounded-lg border bg-muted/30 p-3 text-sm leading-relaxed">{lead.aiInsight}</p>
                                        </div>
                                    )}
                                    {lead.aiEmailDraft && (
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">AI Email Draft</p>
                                            </div>
                                            <p className="rounded-lg border bg-muted/30 p-3 text-sm whitespace-pre-wrap leading-relaxed font-mono">
                                                {lead.aiEmailDraft}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* ── Sidebar ── */}
                <div className="space-y-4">
                    {/* AI Score */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Bot className="h-4 w-4 text-primary" /> AI Score
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-3">
                            <ScoreBadge score={lead.aiScore} className="text-2xl px-4 py-2" />
                            <PriorityLabel score={lead.aiScore} />
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-1 gap-1.5"
                                onClick={handleRescore}
                                disabled={rescoreLeadMutation.isPending}
                            >
                                {rescoreLeadMutation.isPending
                                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scoring...</>
                                    : <><Wand2 className="h-3.5 w-3.5" /> Re-score with AI</>}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Update Status</Label>
                                <Select defaultValue={lead.status} onValueChange={handleStatusChange} disabled={updateLeadMutation.isPending}>
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

                            <div className="pt-2 space-y-2">
                                {!lead.isConverted && (
                                    <Button
                                        className="w-full bg-score-high hover:bg-score-high/90 text-white"
                                        onClick={handleConvert}
                                        disabled={convertLeadMutation.isPending}
                                    >
                                        {convertLeadMutation.isPending ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Converting...</>
                                        ) : (
                                            <><CheckCircle2 className="mr-2 h-4 w-4" />Convert Lead</>
                                        )}
                                    </Button>
                                )}
                                <Button className="w-full" variant="outline">Schedule Follow-up</Button>
                                <Button className="w-full" variant="outline">Send Email</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
