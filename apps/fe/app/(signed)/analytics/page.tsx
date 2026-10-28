import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Coins,
  Download,
  Gauge,
  Layers3,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TraceVolumeRange, validRanges } from "../dashboard/types";
import { resolveSelectedProject } from "@/services/api/projects";
import { getAnalyticsOverview } from "@/services/api/analytics";
import SummaryMetrics from "@/components/analytics/SummaryMetrics";
import LatencySection from "@/components/analytics/LatencySection";

const errorData = [
  { type: "Rate limit", count: 4, fill: "#f59e0b" },
  { type: "Timeout", count: 2, fill: "#ef4444" },
];

const costTrend = [
  { date: "Oct 21", cost: 0.014, input: 850, output: 650 },
  { date: "Oct 22", cost: 0.019, input: 1000, output: 700 },
  { date: "Oct 23", cost: 0.016, input: 920, output: 620 },
  { date: "Oct 24", cost: 0.021, input: 1100, output: 800 },
  { date: "Oct 25", cost: 0.018, input: 950, output: 700 },
  { date: "Oct 26", cost: 0.017, input: 880, output: 680 },
  { date: "Oct 27", cost: 0.020711, input: 1000, output: 800 },
];

const costBreakdown = [
  { model: "GPT-5", provider: "OpenAI", tokens: 6900, cost: 0.1, share: 79.55 },
  {
    model: "Claude Sonnet",
    provider: "Anthropic",
    tokens: 1200,
    cost: 0.018,
    share: 14.31,
  },
  {
    model: "Gemini",
    provider: "Google",
    tokens: 798,
    cost: 0.007711,
    share: 6.14,
  },
];



function ChartEmptyLabel() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      No data available for this period
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; range?: TraceVolumeRange }>;
}) {
  const params = await searchParams;

  const { selectedProject } = await resolveSelectedProject(params.projectId);

  if (!selectedProject) {
    return <p>No projects yet. Create your first project.</p>;
  }

  const range = validRanges.includes(params.range as TraceVolumeRange)
    ? (params.range as TraceVolumeRange)
    : "7d";

  const [overview] = await Promise.all([
    getAnalyticsOverview(selectedProject.id),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 p-4 md:p-8">
      {/* Page header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="rounded-lg border bg-muted/40 p-2">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Understand your LLM performance, reliability, and spending.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Download className="h-4 w-4" />
            Export
          </Button>

          <Button variant="outline" className="gap-2">
            <a href="/dashboard/traces">View traces</a>
          </Button>

          <div className="relative">
            <select
              value={range}
              // onChange={(event) => {}}
              className="h-9 appearance-none rounded-md border border-input bg-background py-1 pl-3 pr-9 text-sm outline-none focus:ring-2 focus:ring-ring"
              aria-label="Analytics date range"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Summary metrics */}
      <SummaryMetrics range={range} overview={overview} />

      {/* Latency section */}
      <LatencySection/>

      {/* Reliability section */}
      {/* <section className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          <SectionHeading
            title="Error analysis"
            description="Understand which errors are affecting your LLM requests."
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Errors by type</CardTitle>
              <CardDescription>
                Distribution of failed traces by error category.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-65">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={errorData}
                    layout="vertical"
                    margin={{ top: 8, right: 24, bottom: 0, left: 8 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      horizontal={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      width={90}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar
                      dataKey="count"
                      name="Failed traces"
                      radius={[0, 5, 5, 0]}
                      barSize={28}
                    >
                      {errorData.map((item) => (
                        <Cell key={item.type} fill={item.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Reliability summary</CardTitle>
              <CardDescription>
                Current failure distribution for the selected project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-500/10 p-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Failed traces</p>
                    <p className="text-xs text-muted-foreground">
                      Requests with errors
                    </p>
                  </div>
                </div>
                <span className="text-xl font-semibold">6</span>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-emerald-500/10 p-2">
                    <Zap className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Successful traces</p>
                    <p className="text-xs text-muted-foreground">
                      Requests completed successfully
                    </p>
                  </div>
                </div>
                <span className="text-xl font-semibold">194</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Success rate</span>
                  <span className="font-medium">97%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[97%] rounded-full bg-emerald-500" />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  window.location.href = "/dashboard/traces?status=ERROR";
                }}
              >
                Investigate failed traces
              </Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* Cost section */}
      {/* <section className="space-y-4">
        <div className="flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
          <SectionHeading
            title="Cost and token usage"
            description="Monitor spending and understand which models consume your budget."
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Cost over time</CardTitle>
              <CardDescription>
                Daily spending across all model requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-70">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={costTrend}
                    margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
                  >
                    <defs>
                      <linearGradient
                        id="costGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#6366f1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      tickFormatter={(value) => `$${value.toFixed(3)}`}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(value) => [
                        `$${Number(value).toFixed(6)}`,
                        "Cost",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      name="Cost"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="url(#costGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Token usage over time</CardTitle>
              <CardDescription>
                Compare input and output token consumption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-70">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={costTrend}
                    margin={{ top: 8, right: 8, bottom: 0, left: -10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                    />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Bar
                      dataKey="input"
                      name="Input tokens"
                      fill="#6366f1"
                      radius={[3, 3, 0, 0]}
                    />
                    <Bar
                      dataKey="output"
                      name="Output tokens"
                      fill="#10b981"
                      radius={[3, 3, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Spending by model</CardTitle>
            <CardDescription>
              Models ranked by their contribution to total cost.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-162.5 text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Model</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 text-right font-medium">Tokens</th>
                    <th className="pb-3 text-right font-medium">Total cost</th>
                    <th className="pb-3 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {costBreakdown.map((item) => (
                    <tr key={item.model} className="border-b last:border-0">
                      <td className="py-4 font-medium">{item.model}</td>
                      <td className="py-4 text-muted-foreground">
                        {item.provider}
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {item.tokens.toLocaleString()}
                      </td>
                      <td className="py-4 text-right font-medium tabular-nums">
                        ${item.cost.toFixed(6)}
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {item.share.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section> */}

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Layers3 className="h-3.5 w-3.5" />
          Analytics for the selected project
        </span>
        <span>Times shown in UTC</span>
      </div>
    </div>
  );
}
