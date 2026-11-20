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
import PerformanceOverviewMetricCards from "@/components/analytics/PerformanceOverviewMetricCards";
import LatencyTrendChart from "@/components/analytics/LatencyTrendChart";
import LatencyBreakdownTable from "@/components/analytics/LatencyBreakdownTable";
import ErrorsBreakdownTable from "@/components/analytics/ErrorsBreakdownTable";
import CostBreakdownTable from "@/components/analytics/CostBreakdownTable";
import CostTrendChart from "@/components/analytics/CostTrendChart";

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
          <LatencyBreakdownTable
            initialLatencyBreakdown={latencyBreakdown}
            selectedProjectId={selectedProject.id}
          />
          <ErrorsBreakdownTable
            initialErrorBreakdown={errorsBreakdown}
            selectedProjectId={selectedProject.id}
          />
          <CostTrendChart
            initialCostTrend={costTrend}
            selectedProjectId={selectedProject.id}
          />
          <CostBreakdownTable
            initialCostBreakdown={costBreakdown}
            selectedProjectId={selectedProject.id}
          />
        </div>
      </main>
    </div>
  );
}
