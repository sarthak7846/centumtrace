'use client'

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
import SectionHeading from "./SectionHeading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const latencyData = [
  { date: "Oct 21", p50: 720, p95: 1100, p99: 1280 },
  { date: "Oct 22", p50: 790, p95: 1240, p99: 1390 },
  { date: "Oct 23", p50: 750, p95: 1180, p99: 1350 },
  { date: "Oct 24", p50: 820, p95: 1310, p99: 1450 },
  { date: "Oct 25", p50: 860, p95: 1390, p99: 1480 },
  { date: "Oct 26", p50: 810, p95: 1320, p99: 1440 },
  { date: "Oct 27", p50: 927, p95: 1455, p99: 1499 },
];

const latencyBreakdown = [
  { model: "GPT-5", provider: "OpenAI", requests: 120, avg: 950, p95: 1420 },
  {
    model: "Claude Sonnet",
    provider: "Anthropic",
    requests: 50,
    avg: 878,
    p95: 1300,
  },
  { model: "Gemini", provider: "Google", requests: 30, avg: 820, p95: 1180 },
];

const tooltipStyle = {
  backgroundColor: "var(--background)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  fontSize: 12,
};

const LatencySection = () => {
  return (
   <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-5 w-5 text-muted-foreground" />
          <SectionHeading
            title="Latency performance"
            description="Track response times and identify slower model requests."
          />
        </div>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Latency over time</CardTitle>
            <CardDescription>
              Compare median latency against the slowest 5% and 1% of requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={latencyData}
                  margin={{ top: 8, right: 12, bottom: 0, left: -12 }}
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
                    tickFormatter={(value) => `${value}ms`}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value} ms`]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="p50"
                    name="P50"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p95"
                    name="P95"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="p99"
                    name="P99"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Latency by model</CardTitle>
            <CardDescription>
              Compare performance across providers and models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-162.5 text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 font-medium">Model</th>
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 text-right font-medium">Requests</th>
                    <th className="pb-3 text-right font-medium">
                      Avg. latency
                    </th>
                    <th className="pb-3 text-right font-medium">P95</th>
                  </tr>
                </thead>
                <tbody>
                  {latencyBreakdown.map((item) => (
                    <tr key={item.model} className="border-b last:border-0">
                      <td className="py-4 font-medium">{item.model}</td>
                      <td className="py-4 text-muted-foreground">
                        {item.provider}
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {item.requests}
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {item.avg.toLocaleString()} ms
                      </td>
                      <td className="py-4 text-right tabular-nums">
                        {item.p95.toLocaleString()} ms
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>
  )
}

export default LatencySection