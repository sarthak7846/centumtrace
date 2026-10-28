import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  Clock3,
  Coins,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  AnalyticsOverview,
  TraceVolumeRange,
} from "@/app/(signed)/dashboard/types";
import SectionHeading from "./SectionHeading";

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
}) {
  return (
    <Card className="border-border/70 shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="rounded-lg border bg-muted/40 p-2.5">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium ${
                trendUp ? "text-red-500" : "text-emerald-600"
              }`}
            >
              {trendUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend}
            </span>
          )}
          <span>{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const SummaryMetrics = ({
  range,
  overview,
}: {
  range: TraceVolumeRange;
  overview: AnalyticsOverview;
}) => {
  const { totalTokens, totalCost, errorRate, p95LatencyMs } = overview;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <SectionHeading
          title="Performance overview"
          description="A snapshot of your project's LLM activity."
        />
        <Badge variant="outline" className="font-normal">
          {range === "24h"
            ? "24-hour window"
            : range === "7d"
              ? "7-day window"
              : "30-day window"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="P95 latency"
          value={p95LatencyMs.toFixed(0)}
          description="95th percentile response time"
          icon={Clock3}
        />
        <MetricCard
          title="Error rate"
          value="3.00%"
          description="6 failed out of 200 traces"
          icon={AlertTriangle}
        />
        <MetricCard
          title="Total cost"
          value="$0.1257"
          description="Recorded model usage"
          icon={CircleDollarSign}
        />
        <MetricCard
          title="Total tokens"
          value={totalTokens.toLocaleString()}
          description="Input and output combined"
          icon={Coins}
        />
      </div>
    </section>
  );
};

export default SummaryMetrics;
