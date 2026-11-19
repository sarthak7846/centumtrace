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
import { Range, validRanges } from "../dashboard/types";
import { resolveSelectedProject } from "@/services/api/projects";
import {
  getAnalyticsOverview,
  getCostBreakdown,
  getCostTrend,
  getErrorsBreakdown,
  getLatencyBreakdown,
  getLatencyTrend,
} from "@/services/api/analytics";
import SummaryMetrics from "@/components/analytics/SummaryMetrics";
import LatencySection from "@/components/analytics/LatencySection";
import PerformanceOverviewMetricCards from "@/components/analytics/PerformanceOverviewMetricCards";
import LatencyTrendChart from "@/components/analytics/LatencyTrendChart";

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
  searchParams: Promise<{ projectId?: string; range?: Range }>;
}) {
  const params = await searchParams;

  const { selectedProject } = await resolveSelectedProject(params.projectId);

  if (!selectedProject) {
    return <p>No projects yet. Create your first project.</p>;
  }

  const range = validRanges.includes(params.range as Range)
    ? (params.range as Range)
    : "7d";

  const [
    overview,
    latencyTrend,
    latencyBreakdown,
    errorsBreakdown,
    costTrend,
    costBreakdown,
  ] = await Promise.all([
    getAnalyticsOverview(selectedProject.id),
    getLatencyTrend(selectedProject.id, range),
    getLatencyBreakdown(selectedProject.id, range),
    getErrorsBreakdown(selectedProject.id, range),
    getCostTrend(selectedProject.id, range),
    getCostBreakdown(selectedProject.id, range),
  ]);

  const { totalTokens, totalCost, errorRate, p95LatencyMs } = overview;

  const performanceMetrics = {
    p95LatencyMs,
    errorRate,
    totalCost,
    totalTokens,
  };

  return (
    <div className="relative z-10 pt-14">
      <main className="relative w-full px-8 bg-transparent min-h-screen">
        <div className="flex flex-col w-full pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-lg text-headline-lg text-[#f8fafc] font-bold tracking-tight">
                  Analytics
                </span>
              </div>
              <p className="font-body-md text-body-md text-slate-400">
                Understand your LLM performance, reliability, and spending.
              </p>
            </div>
            {/* <!-- Action Toolbar --> */}
            {/* <div className="flex items-center gap-space-sm flex-wrap"> */}
            {/* <!-- Time Range Dropdown --> */}
            {/* <div className="relative inline-block text-left">
                <button
                  className="group flex items-center gap-space-xs px-space-sm py-2 rounded-lg bg-[#131828] border border-[#23293d] hover:bg-[#1a2136] hover:border-indigo-500/40 active:scale-[0.98] text-[#f8fafc] transition-all font-label-md text-label-md shadow-sm"
                  id="timeRangeBtn"
                  type="button"
                >
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-400 text-base transition-colors">
                    calendar_today
                  </span>
                  <span id="currentTimeRange">Last 7 days</span>
                  <span className="material-symbols-outlined text-slate-400 text-sm group-hover:translate-y-0.5 transition-transform">
                    expand_more
                  </span>
                </button>
              </div> */}
            {/* <!-- Trace Navigation Button --> */}
            {/* <button
                className="group flex items-center gap-space-xs px-space-sm py-2 rounded-lg bg-[#131828] border border-[#23293d] hover:bg-[#1a2136] hover:border-indigo-500/40 active:scale-[0.98] text-slate-200 font-label-md text-label-md transition-all shadow-sm"
                type="button"
              >
                <span className="material-symbols-outlined text-indigo-400 text-base group-hover:rotate-45 transition-transform duration-300">
                  conversion_path
                </span>
                <span>View traces</span>
              </button> */}
            {/* <!-- Export CTA --> */}
            {/* <button
                className="group relative overflow-hidden flex items-center gap-space-xs px-space-md py-2 rounded-lg bg-linear-to-r from-primary to-indigo-600 text-white font-label-md text-label-md hover:from-indigo-500 hover:to-indigo-700 active:scale-[0.97] transition-all shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50 border border-indigo-400/20"
                id="exportBtn"
                type="button"
              >
                <span className="material-symbols-outlined text-base group-hover:-translate-y-0.5 transition-transform">
                  download
                </span>
                <span id="exportText">Export</span>
              </button> */}
            {/* </div> */}
          </div>
          <div className="flex flex-col gap-space-md mb-space-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-title-md text-title-md text-[#f8fafc] font-semibold">
                  Performance overview
                </h2>
                <p className="font-label-sm text-label-sm text-slate-400">
                  A snapshot of your project's LLM activity.
                </p>
              </div>
              {/* <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111625] border border-[#23293d] text-indigo-300 font-caption text-caption font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                7-day window
              </div> */}
            </div>
            {/* <!-- 4 Key Metric Cards --> */}
            <PerformanceOverviewMetricCards
              performanceMetrics={performanceMetrics}
            />
          </div>
          <LatencyTrendChart
            initialLatencyTrend={latencyTrend}
            selectedProjectId={selectedProject.id}
          />
          <div className="flex flex-col gap-space-md mb-space-xl">
            <div className="flex flex-col gap-space-xs">
              <h2 className="font-title-md text-title-md text-[#f8fafc] font-semibold">
                Latency performance
              </h2>
              <p className="font-label-sm text-label-sm text-slate-400">
                Track response times and identify slower model requests.
              </p>
            </div>
            <div className="rounded-xl bg-[#0f1424] border border-[#1e263d] p-space-lg shadow-xl hover:border-[#283552] transition-colors flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-indigo-400 text-lg">
                    timeline
                  </span>
                  <h3 className="font-label-md text-label-md font-semibold text-[#f8fafc]">
                    Latency over time
                  </h3>
                  <span className="hidden md:inline font-caption text-caption text-slate-400">
                    — Compare median latency against the slowest 5% and 1% of
                    requests.
                  </span>
                </div>
                <span className="font-caption text-caption text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>{" "}
                  Live Scrubbing Enabled • ms
                </span>
              </div>
              {/* <!-- SVG Chart Wrapper --> */}
              <div
                className="relative w-full h-72 pt-space-xs select-none cursor-crosshair"
                id="chartContainer"
              >
                {/* <!-- Floating Glass Tooltip --> */}
                <div
                  className="absolute z-30 pointer-events-none opacity-0 transition-all duration-150 bg-[#10162a]/95 backdrop-blur-md border border-[#2a3656] text-[#f8fafc] p-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.5)] font-caption text-caption flex flex-col gap-1.5 w-44 -translate-x-1/2 -translate-y-full mb-4"
                  id="chartTooltip"
                  style={{
                    transform: "translate(-50%, -100%)",
                    opacity: 0,
                    left: "186px",
                    top: "36%",
                  }}
                >
                  <div className="font-semibold text-white border-b border-[#222c44] pb-1 flex items-center justify-between">
                    <span id="tooltipDate">Oct 22, 2024</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      200 runs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-amber-400">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      P99
                    </span>
                    <span
                      className="font-bold font-mono text-xs"
                      id="tooltipP99"
                    >
                      1,410 ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-indigo-300">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      P95
                    </span>
                    <span
                      className="font-bold font-mono text-xs"
                      id="tooltipP95"
                    >
                      1,180 ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-cyan-300">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                      P50
                    </span>
                    <span
                      className="font-bold font-mono text-xs"
                      id="tooltipP50"
                    >
                      840 ms
                    </span>
                  </div>
                </div>
                {/* <!-- Inline SVG Visualization --> */}
                <svg
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 760 220"
                >
                  <defs>
                    {/* <!-- Background vertical track highlights --> */}
                    <linearGradient id="p95Glow" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stop-color="#6366f1"
                        stop-opacity="0.25"
                      ></stop>
                      <stop
                        offset="100%"
                        stop-color="#6366f1"
                        stop-opacity="0.0"
                      ></stop>
                    </linearGradient>
                    <linearGradient id="p50Glow" x1="0" x2="0" y1="0" y2="1">
                      <stop
                        offset="0%"
                        stop-color="#06b6d4"
                        stop-opacity="0.18"
                      ></stop>
                      <stop
                        offset="100%"
                        stop-color="#06b6d4"
                        stop-opacity="0.0"
                      ></stop>
                    </linearGradient>
                    {/* <!-- Soft node filter glow --> */}
                    <filter
                      height="200%"
                      id="glowAmber"
                      width="200%"
                      x="-50%"
                      y="-50%"
                    >
                      <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="3"
                      ></feGaussianBlur>
                      <feMerge>
                        <feMergeNode></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                      </feMerge>
                    </filter>
                    <filter
                      height="200%"
                      id="glowIndigo"
                      width="200%"
                      x="-50%"
                      y="-50%"
                    >
                      <feGaussianBlur
                        in="SourceGraphic"
                        stdDeviation="3.5"
                      ></feGaussianBlur>
                      <feMerge>
                        <feMergeNode></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                      </feMerge>
                    </filter>
                  </defs>
                  {/* <!-- Horizontal Grid Guides --> */}
                  <g
                    className="stroke-[#1e2538]"
                    stroke-dasharray="4 4"
                    stroke-width="1"
                  >
                    <line x1="0" x2="760" y1="20" y2="20"></line>
                    <line x1="0" x2="760" y1="70" y2="70"></line>
                    <line x1="0" x2="760" y1="120" y2="120"></line>
                    <line x1="0" x2="760" y1="170" y2="170"></line>
                    <line
                      stroke-dasharray="none"
                      stroke-width="1.5"
                      x1="0"
                      x2="760"
                      y1="210"
                      y2="210"
                    ></line>
                  </g>
                  {/* <!-- Y-Axis Labels --> */}
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="10"
                    text-anchor="end"
                    x="755"
                    y="24"
                  >
                    1600ms
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="10"
                    text-anchor="end"
                    x="755"
                    y="74"
                  >
                    1200ms
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="10"
                    text-anchor="end"
                    x="755"
                    y="124"
                  >
                    800ms
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="10"
                    text-anchor="end"
                    x="755"
                    y="174"
                  >
                    400ms
                  </text>
                  {/* <!-- Gradient Area under P95 --> */}
                  <path
                    className="transition-opacity duration-300"
                    d="M 10 95 Q 130 80, 250 100 T 500 70 T 750 85 L 750 210 L 10 210 Z"
                    fill="url(#p95Glow)"
                    id="areaP95"
                  ></path>
                  {/* <!-- P50 Curve (Median - Cyan/Teal #06b6d4) --> */}
                  <path
                    className="chart-curve-animate-delay-2 transition-all duration-300"
                    d="M 10 135 C 130 145, 230 125, 380 130 C 510 135, 620 120, 750 130"
                    fill="none"
                    id="curveP50"
                    stroke="#06b6d4"
                    stroke-linecap="round"
                    stroke-width="2.5"
                  ></path>
                  {/* <!-- P95 Curve (Indigo #6366f1) --> */}
                  <path
                    className="chart-curve-animate-delay-1 transition-all duration-300"
                    d="M 10 95 C 120 70, 240 105, 380 85 C 500 68, 620 95, 750 85"
                    fill="none"
                    id="curveP95"
                    stroke="#6366f1"
                    stroke-linecap="round"
                    stroke-width="3"
                  ></path>
                  {/* <!-- P99 Curve (Amber/Orange #f59e0b) --> */}
                  <path
                    className="chart-curve-animate transition-all duration-300"
                    d="M 10 55 C 120 40, 260 65, 380 48 C 510 32, 630 60, 750 50"
                    fill="none"
                    id="curveP99"
                    stroke="#f59e0b"
                    stroke-dasharray="3 3"
                    stroke-linecap="round"
                    stroke-width="2"
                  ></path>
                  {/* <!-- Interactive Target Crosshair & Points --> */}
                  <g
                    className="transition-transform duration-75"
                    id="interactiveMarker"
                    transform="translate(380, 0)"
                  >
                    <line
                      opacity="0.75"
                      stroke="#6366f1"
                      stroke-dasharray="3 3"
                      stroke-width="1.5"
                      x1="0"
                      x2="0"
                      y1="10"
                      y2="210"
                    ></line>
                    {/* <!-- P99 dot --> */}
                    <circle
                      className="cursor-pointer"
                      cx="0"
                      cy="48"
                      fill="#f59e0b"
                      filter="url(#glowAmber)"
                      id="markerP99"
                      r="4.5"
                      stroke="#080b12"
                      stroke-width="2"
                    ></circle>
                    {/* <!-- P95 dot with animated ring --> */}
                    <circle
                      className="animate-ping"
                      cx="0"
                      cy="85"
                      fill="#6366f1"
                      id="pingRingP95"
                      opacity="0.4"
                      r="8"
                    ></circle>
                    <circle
                      className="cursor-pointer"
                      cx="0"
                      cy="85"
                      fill="#818cf8"
                      filter="url(#glowIndigo)"
                      id="markerP95"
                      r="5.5"
                      stroke="#080b12"
                      stroke-width="2"
                    ></circle>
                    {/* <!-- P50 dot --> */}
                    <circle
                      className="cursor-pointer"
                      cx="0"
                      cy="130"
                      fill="#06b6d4"
                      id="markerP50"
                      r="4.5"
                      stroke="#080b12"
                      stroke-width="2"
                    ></circle>
                  </g>
                  {/* <!-- Day Ticks along X-axis --> */}
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    x="10"
                    y="218"
                  >
                    Oct 21
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    x="135"
                    y="218"
                  >
                    Oct 22
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    x="255"
                    y="218"
                  >
                    Oct 23
                  </text>
                  <text
                    className="font-caption font-mono font-bold"
                    fill="#818cf8"
                    font-size="11"
                    id="tickOct24"
                    x="380"
                    y="218"
                  >
                    Oct 24
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    x="500"
                    y="218"
                  >
                    Oct 25
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    x="625"
                    y="218"
                  >
                    Oct 26
                  </text>
                  <text
                    className="font-caption font-mono"
                    fill="#64748b"
                    font-size="11"
                    text-anchor="end"
                    x="740"
                    y="218"
                  >
                    Oct 27
                  </text>
                </svg>
              </div>
              {/* <!-- Chart Legend Pills --> */}
              <div className="flex items-center justify-between flex-wrap gap-space-sm pt-space-xs border-t-0">
                <div className="flex items-center gap-space-md">
                  {/* <!-- P50 Legend --> */}
                  <button
                    className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-[#131828] border border-[#23293d] hover:border-cyan-500/50 hover:bg-[#192238] active:scale-95 text-[#f8fafc] font-label-sm text-label-sm transition-all shadow-sm"
                    id="toggleP50"
                    title="Click to isolate P50 curve"
                    type="button"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4] shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                    <span className="font-medium text-slate-200">
                      P50 (Median)
                    </span>
                    <span className="font-caption text-caption text-slate-400 font-mono">
                      ~812ms
                    </span>
                  </button>
                  {/* <!-- P95 Legend --> */}
                  <button
                    className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/50 hover:border-indigo-400 hover:bg-indigo-900/60 active:scale-95 text-indigo-200 font-label-sm text-label-sm shadow-[0_0_12px_rgba(99,102,241,0.25)] transition-all"
                    id="toggleP95"
                    title="Click to isolate P95 curve"
                    type="button"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_8px_rgba(99,102,241,0.9)]"></span>
                    <span className="font-semibold text-white">
                      P95 (Slowest 5%)
                    </span>
                    <span className="font-caption text-caption text-indigo-300 font-mono">
                      1,442ms
                    </span>
                  </button>
                  {/* <!-- P99 Legend --> */}
                  <button
                    className="flex items-center gap-space-xs px-2.5 py-1 rounded-full bg-[#131828] border border-[#23293d] hover:border-amber-500/50 hover:bg-[#192238] active:scale-95 text-[#f8fafc] font-label-sm text-label-sm transition-all shadow-sm"
                    id="toggleP99"
                    title="Click to isolate P99 curve"
                    type="button"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
                    <span className="font-medium text-slate-200">
                      P99 (Slowest 1%)
                    </span>
                    <span className="font-caption text-caption text-slate-400 font-mono">
                      ~1,590ms
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-space-xs text-slate-400 font-caption text-caption">
                  <span className="material-symbols-outlined text-sm text-indigo-400">
                    info
                  </span>
                  <span>
                    Hover over chart to inspect granular data • Sampled 200 runs
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Latency by Model Section (Benchmarking Table) --> */}
          <div className="flex flex-col gap-space-md mb-space-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
              <div>
                <h2 className="font-title-md text-title-md text-[#f8fafc] font-semibold">
                  Latency by model
                </h2>
                <p className="font-label-sm text-label-sm text-slate-400">
                  Compare performance across providers and models.
                </p>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="font-caption text-caption text-slate-400">
                  Sort by:
                </span>
                <div
                  className="flex items-center bg-[#131828] p-0.5 rounded-lg border border-[#23293d]"
                  id="sortControls"
                >
                  <button
                    className="sort-btn active px-2.5 py-1 rounded-md text-xs font-semibold text-white bg-indigo-600 transition-all shadow-sm"
                    data-sort="requests"
                    type="button"
                  >
                    Requests (Desc)
                  </button>
                  <button
                    className="sort-btn px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-all"
                    data-sort="latency"
                    type="button"
                  >
                    Avg Latency
                  </button>
                  <button
                    className="sort-btn px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-white transition-all"
                    data-sort="p95"
                    type="button"
                  >
                    P95
                  </button>
                </div>
              </div>
            </div>
            {/* <!-- Clean Data Table Container --> */}
            <div className="overflow-x-auto rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-xl">
              <table
                className="w-full text-left border-collapse"
                id="modelBenchmarkTable"
              >
                <thead>
                  <tr className="bg-[#0c101c] border-b border-[#1e263d] text-slate-400 font-caption text-caption uppercase tracking-wider">
                    <th className="py-3.5 px-space-md font-semibold">Model</th>
                    <th className="py-3.5 px-space-md font-semibold">
                      Provider
                    </th>
                    <th className="py-3.5 px-space-md font-semibold text-right">
                      Requests
                    </th>
                    <th className="py-3.5 px-space-md font-semibold text-right">
                      Avg. Latency
                    </th>
                    <th className="py-3.5 px-space-md font-semibold text-right">
                      P95
                    </th>
                    <th className="py-3.5 px-space-md font-semibold text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e263d]" id="tableBody">
                  {/* <!-- Row 1: GPT-5 --> */}
                  <tr
                    className="model-row hover:bg-[#161f36] transition-all duration-200 group cursor-pointer hover:shadow-inner"
                    data-latency="950"
                    data-p95="1420"
                    data-requests="120"
                  >
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-2 ring-emerald-500/20"></span>
                        </span>
                        <span className="font-label-md text-label-md font-semibold text-[#f8fafc] group-hover:text-indigo-400 transition-colors">
                          GPT-5
                        </span>
                        <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-[#1c2438] border border-[#273352] text-slate-300">
                          Default
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="font-body-md text-body-md text-slate-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-400 transition-colors">
                          smart_toy
                        </span>
                        OpenAI
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-medium">
                      120
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc]">
                      950 ms
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-semibold">
                      1,420 ms
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 font-caption text-caption font-medium shadow-[0_0_8px_rgba(16,185,129,0.15)] group-hover:border-emerald-400/50 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Optimal
                      </span>
                    </td>
                  </tr>
                  {/* <!-- Row 2: Claude Sonnet --> */}
                  <tr
                    className="model-row hover:bg-[#161f36] transition-all duration-200 group cursor-pointer hover:shadow-inner"
                    data-latency="878"
                    data-p95="1300"
                    data-requests="50"
                  >
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 ring-2 ring-amber-500/20"></span>
                        </span>
                        <span className="font-label-md text-label-md font-semibold text-[#f8fafc] group-hover:text-indigo-400 transition-colors">
                          Claude Sonnet
                        </span>
                        <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-[#1c2438] border border-[#273352] text-slate-300">
                          v3.5
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="font-body-md text-body-md text-slate-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-400 transition-colors">
                          psychology
                        </span>
                        Anthropic
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-medium">
                      50
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc]">
                      878 ms
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-semibold">
                      1,300 ms
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/50 border border-amber-500/30 text-amber-300 font-caption text-caption font-medium shadow-[0_0_8px_rgba(245,158,11,0.15)] group-hover:border-amber-400/50 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                        Elevated
                      </span>
                    </td>
                  </tr>
                  {/* <!-- Row 3: Gemini --> */}
                  <tr
                    className="model-row hover:bg-[#161f36] transition-all duration-200 group cursor-pointer hover:shadow-inner"
                    data-latency="820"
                    data-p95="1180"
                    data-requests="30"
                  >
                    <td className="py-3.5 px-space-md">
                      <div className="flex items-center gap-space-sm">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400 ring-2 ring-cyan-500/20"></span>
                        </span>
                        <span className="font-label-md text-label-md font-semibold text-[#f8fafc] group-hover:text-indigo-400 transition-colors">
                          Gemini
                        </span>
                        <span className="font-caption text-caption px-1.5 py-0.5 rounded bg-[#1c2438] border border-[#273352] text-slate-300">
                          1.5 Flash
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md">
                      <span className="font-body-md text-body-md text-slate-300 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base text-slate-400 group-hover:text-indigo-400 transition-colors">
                          auto_awesome
                        </span>
                        Google
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-medium">
                      30
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc]">
                      820 ms
                    </td>
                    <td className="py-3.5 px-space-md text-right font-mono font-label-md text-label-md text-[#f8fafc] font-semibold">
                      1,180 ms
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-caption text-caption font-medium shadow-[0_0_8px_rgba(6,182,212,0.15)] group-hover:border-cyan-400/50 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Fastest
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
