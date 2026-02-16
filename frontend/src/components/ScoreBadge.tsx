import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScoreBadge({ score, className }: { score: number; className?: string }) {
  const color =
    score >= 70
      ? "bg-score-high/15 text-score-high border-score-high/30"
      : score >= 40
        ? "bg-score-medium/15 text-score-medium border-score-medium/30"
        : "bg-score-low/15 text-score-low border-score-low/30";

  return (
    <Badge variant="outline" className={cn("font-semibold tabular-nums", color, className)}>
      {score}
    </Badge>
  );
}

export function PriorityLabel({ score }: { score: number }) {
  if (score >= 70) return <Badge className="bg-score-high text-white border-0">High Priority</Badge>;
  if (score >= 40) return <Badge className="bg-score-medium text-white border-0">Medium Priority</Badge>;
  return <Badge className="bg-score-low text-white border-0">Low Priority</Badge>;
}
