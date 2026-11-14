import OverviewCards from "@/components/dashboard/OverviewCards";
import {
  LatencyMetrics,
  OverviewMetrics,
  ReliabilityMetrics,
  TraceVolumeRange,
  validRanges,
} from "./types";
import VolumeRangeSelector from "@/components/dashboard/VolumeRangeSelector";
import TraceVolumeChart from "@/components/dashboard/TraceVolumeChart";
import { resolveSelectedProject } from "@/services/api/projects";
import {
  getAnalyticsOverview,
  getAnalyticsVolume,
} from "@/services/api/analytics";
import OverviewMetricCards from "@/components/dashboard/OverviewMetricCards";
import ReliabilityMetricCards from "@/components/dashboard/ReliabilityMetricCards";
import LatencyMetricCards from "@/components/dashboard/LatencyMetricCards";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; range?: string }>;
}) => {
  const params = await searchParams;
  const { selectedProject } = await resolveSelectedProject(params.projectId);

  if (!selectedProject) {
    return <p>No projects yet. Create your first project.</p>;
  }

  const range = validRanges.includes(params.range as TraceVolumeRange)
    ? (params.range as TraceVolumeRange)
    : "24h";

  const [overview, analyticsVolume] = await Promise.all([
    getAnalyticsOverview(selectedProject.id),
    getAnalyticsVolume(selectedProject.id, range),
  ]);

  const {
    totalTraces,
    totalTokens,
    totalCost,
    errorTraces,
    errorRate,
    averageLatencyMs,
    p50LatencyMs,
    p95LatencyMs,
    p99LatencyMs,
    successfulTraces,
  } = overview;

  const overviewMetrics: OverviewMetrics = {
    totalTraces,
    totalTokens,
    totalCost,
    errorRate,
    averageLatencyMs,
  };

  const reliabilityMetrics: ReliabilityMetrics = {
    totalTraces,
    successfulTraces,
    errorTraces,
    errorRate,
  };

  const latencyMetrics: LatencyMetrics = {
    p50LatencyMs,
    p95LatencyMs,
    p99LatencyMs,
    totalTraces,
  };

  return (
    <div className="relative z-10 pt-14">
      {/* <!-- MAIN SCROLLABLE CONTENT --> */}
      <main className="relative w-full px-8 bg-transparent min-h-screen">
        <div className="flex flex-col w-full pb-16">
          {/* <!-- TOP COMMAND BAR & TIME CONTROLS (Entry 1) --> */}
          {/* <div className="anim-entry-1 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md py-space-sm mb-space-lg w-full"> */}
            {/* <div className="flex flex-wrap items-center gap-space-sm"> */}
              {/* <!-- Time Range Selector with animated sliding state --> */}
              {/* <div
                className="relative inline-flex p-1 rounded-xl bg-surface-container-low border border-surface-container-high/60 shadow-inner"
                id="time-filter-group"
              >
                <button
                  className="time-filter px-3 py-1 text-label-sm font-label-sm rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-200"
                  data-range="1h"
                >
                  1h
                </button>
                <button
                  className="time-filter px-3 py-1 text-label-sm font-label-sm rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-200"
                  data-range="6h"
                >
                  6h
                </button>
                <button
                  className="time-filter px-3 py-1 text-label-sm font-label-sm rounded-lg bg-surface-container-high text-primary font-semibold shadow-sm transition-all duration-200"
                  data-range="24h"
                >
                  24h
                </button>
                <button
                  className="time-filter px-3 py-1 text-label-sm font-label-sm rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-200"
                  data-range="7d"
                >
                  7d
                </button>
                <button
                  className="time-filter px-3 py-1 text-label-sm font-label-sm rounded-lg text-on-surface-variant hover:text-on-surface transition-all duration-200"
                  data-range="30d"
                >
                  30d
                </button>
              </div> */}
              {/* <div className="h-6 w-px bg-surface-container-highest mx-1 hidden sm:block"></div> */}
              {/* <!-- Live Refresh Beacon with Breathing Countdown --> */}
              {/* <div className="flex items-center gap-2 px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high/50 text-on-surface-variant text-label-sm shadow-xs cursor-default">
                <div className="relative flex items-center justify-center w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                </div>
                <span
                  className="font-caption text-caption text-on-surface font-medium"
                  id="sync-beacon-text"
                >
                  Auto-sync{" "}
                  <span className="text-primary font-mono" id="sync-countdown">
                    5s
                  </span>
                </span>
              </div> */}
            {/* </div> */}
          {/* </div> */}
          {/* <!-- SECTION 1: OVERVIEW TOP 5 KPI CARDS (Entry 2) --> */}
          <OverviewMetricCards overviewMetrics={overviewMetrics} />
          {/* <!-- SECTION 2: RELIABILITY & EXECUTION HEALTH (Entry 3) --> */}
          <ReliabilityMetricCards reliabilityMetrics={reliabilityMetrics} />
          {/* <!-- SECTION 3: LATENCY PERFORMANCE & PERCENTILES (Entry 4) --> */}
          <LatencyMetricCards latencyMetrics={latencyMetrics} />
          {/* <!-- SECTION 4: TRACE VOLUME INTERACTIVE CHART (Entry 5) --> */}
          <TraceVolumeChart
            initialAnalyticsVolume={analyticsVolume}
            selectProjectId={selectedProject.id}
          />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
