import OverviewCards from "@/components/dashboard/OverviewCards";
import { TraceVolumeRange, validRanges } from "./types";
import VolumeRangeSelector from "@/components/dashboard/VolumeRangeSelector";
import TraceVolumeChart from "@/components/dashboard/TraceVolumeChart";
import { resolveSelectedProject } from "@/services/api/projects";
import {
  getAnalyticsOverview,
  getAnalyticsVolume,
} from "@/services/api/analytics";

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

  return (
    <div className="relative z-10">
      {/* <!-- TOP APP BAR --> */}
      <header className="anim-header fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl border-b border-surface-container-high/40 z-40 flex items-center justify-between px-space-lg">
        {/* <!-- Interactive Search Bar --> */}
        <div className="flex items-center gap-space-md flex-1 max-w-xl">
          <div className="relative w-full flex items-center group">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] group-focus-within:text-primary transition-colors duration-200">
              search
            </span>
            <input
              className="w-full h-9 pl-9 pr-14 rounded-lg bg-surface-container/60 hover:bg-surface-container text-on-surface placeholder-outline font-body-md text-body-md border border-outline-variant/30 focus:border-primary/60 focus:bg-surface-container focus:outline-none focus:ring-2 focus:ring-primary/25 transition-all duration-200"
              id="global-search"
              placeholder="Search traces, spans, run IDs..."
              type="text"
            />
            <kbd className="absolute right-2.5 flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-outline group-focus-within:text-primary border border-outline-variant/30 font-caption text-caption tracking-wider transition-colors">
              ⌘K
            </kbd>
          </div>
        </div>
        {/* <!-- Right Header Actions --> */}
        <div className="flex items-center gap-space-md">
          {/* <!-- Live Stream Active indicator with radar ping ring --> */}
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-tertiary-container/15 border border-tertiary/30 text-tertiary font-label-sm text-label-sm shadow-sm cursor-default select-none">
            <div className="relative flex items-center justify-center w-2.5 h-2.5">
              <span className="radar-ring absolute inline-flex h-full w-full rounded-full bg-tertiary"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
            </div>
            <span className="font-medium">Live Stream Active</span>
          </div>
          {/* <!-- Docs link --> */}
          <a
            className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 px-2.5 py-1.5 rounded-lg transition-all duration-200 font-label-sm text-label-sm"
            href="#"
          >
            <span className="material-symbols-outlined text-[18px]">
              library_books
            </span>
            Docs
          </a>
          {/* <!-- Notification bell with badge --> */}
          <button
            className="relative p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-200 active:scale-95"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error shadow-[0_0_6px_rgba(255,180,171,0.8)]"></span>
          </button>
          {/* <!-- Profile Avatar --> */}
          <div className="flex items-center pl-space-xs cursor-pointer group">
            <div className="relative">
              <img
                alt="User profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30 group-hover:ring-primary transition-all duration-200"
                src="https://lh3.googleusercontent.com/aida/AEtjO1USKXx1a3puZfbWB-X4hjjn8o27LjHnoN1g7O7faICkHT_zO7bmM_UljpMP6i89ov9OWrhxFkyZTCQ4kR4gSzeyGdYsvhLc64-dyD_5DOezwAFZPllOHjIJp1f3wQuWHfCOGRJuCkcpqSDWm5JfajY1PeCPsLBFn0sHlQb9EcAeBl3NCmCCjklrzgBisxpb67AUOGBBX9XwglCLOHfiMEQ06PLVyVaPF6UoOBo8UHScqMT9G-YA8y17G5b_"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-surface"></span>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- MAIN SCROLLABLE CONTENT --> */}
      <main className="relative w-full px-8 bg-transparent min-h-screen">
        <div className="flex flex-col w-full pb-16">
          {/* <!-- TOP COMMAND BAR & TIME CONTROLS (Entry 1) --> */}
          <div className="anim-entry-1 flex flex-col xl:flex-row xl:items-center justify-between gap-space-md py-space-sm mb-space-lg w-full">
            <div className="flex flex-wrap items-center gap-space-sm">
              {/* <!-- Time Range Selector with animated sliding state --> */}
              <div
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
              </div>
              <div className="h-6 w-px bg-surface-container-highest mx-1 hidden sm:block"></div>
              {/* <!-- Live Refresh Beacon with Breathing Countdown --> */}
              <div className="flex items-center gap-2 px-space-sm py-1.5 rounded-lg bg-surface-container-low border border-surface-container-high/50 text-on-surface-variant text-label-sm shadow-xs cursor-default">
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
              </div>
            </div>
          </div>
          {/* <!-- SECTION 1: OVERVIEW TOP 5 KPI CARDS (Entry 2) --> */}
          <div className="anim-entry-2 mb-space-lg">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  monitoring
                </span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold tracking-tight">
                  Overview Metrics
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
              {/* <!-- Total Traces --> */}
              <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Total Traces
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-primary transition-colors"
                    id="counter-total"
                  >
                    600
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-caption text-caption text-emerald-400">
                  <span className="material-symbols-outlined text-[13px]">
                    trending_up
                  </span>
                  <span>100% active run coverage</span>
                </div>
              </div>
              {/* <!-- Error Rate --> */}
              <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Error Rate
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-error/40 group-hover:bg-error transition-colors"></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-error transition-colors">
                    1.17
                    <span className="font-headline-md text-headline-md text-outline font-normal">
                      %
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-caption text-caption text-outline">
                  <span className="w-1.5 h-1.5 rounded-full bg-error inline-block"></span>
                  <span>7 failures logged</span>
                </div>
              </div>
              {/* <!-- Average Latency --> */}
              <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Average Latency
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary/40 group-hover:bg-secondary transition-colors"></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-secondary transition-colors">
                    902
                    <span className="font-headline-md text-headline-md text-outline font-normal">
                      {" "}
                      ms
                    </span>
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-caption text-caption text-emerald-400">
                  <span className="material-symbols-outlined text-[13px]">
                    speed
                  </span>
                  <span>Optimal response curve</span>
                </div>
              </div>
              {/* <!-- Total Cost --> */}
              <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Total Cost
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary/40 group-hover:bg-tertiary transition-colors"></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-tertiary transition-colors">
                    $0.00
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-caption text-caption text-outline">
                  <span>Free tier sandbox model</span>
                </div>
              </div>
              {/* <!-- Total Tokens --> */}
              <div className="interactive-card relative overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-md group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                    Total Tokens
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors"></span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight group-hover:text-primary transition-colors">
                    27,278
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 font-caption text-caption text-on-surface-variant">
                  <span>Prompt: 19k | Comp: 8.2k</span>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- SECTION 2: RELIABILITY & EXECUTION HEALTH (Entry 3) --> */}
          <div className="anim-entry-3 mb-space-lg">
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">
                  verified
                </span>
                <h2 className="font-title-md text-title-md text-on-surface font-semibold">
                  Reliability &amp; Execution Health
                </h2>
              </div>
              <span className="font-caption text-caption text-outline px-2.5 py-0.5 rounded-full bg-surface-container-low border border-surface-container-high/40">
                98.83% Total Success Ratio
              </span>
            </div>
            <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
              {/* <!-- Successful Traces Card --> */}
              <div className="interactive-card rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                      Successful Traces
                    </span>
                    <span className="material-symbols-outlined text-emerald-400 text-[18px] group-hover:scale-110 transition-transform">
                      check_circle
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                      593
                    </span>
                    <span className="font-label-sm text-label-sm text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-400/10">
                      98.83%
                    </span>
                  </div>
                </div>
                <div>
                  <div
                    className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mb-2 relative group/bar cursor-pointer"
                    title="593 Successful completions (98.83%)"
                  >
                    <div
                      className="h-full bg-emerald-400 rounded-full w-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(52,211,153,0.6)] group-hover/bar:brightness-125"
                      id="bar-success-fill"
                    ></div>
                  </div>
                  <div className="flex items-center justify-between font-caption text-caption text-outline">
                    <span>Status 200 OK completions</span>
                    <span className="text-on-surface font-mono font-medium">
                      593 / 600
                    </span>
                  </div>
                </div>
              </div>
              {/* <!-- Error Traces Card --> */}
              <div className="interactive-card rounded-xl bg-surface-container-low p-space-md shadow-md flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface-variant font-medium">
                      Error Traces
                    </span>
                    <span className="material-symbols-outlined text-error text-[18px] group-hover:scale-110 transition-transform">
                      error
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-headline-lg text-headline-lg text-error font-bold tracking-tight">
                      7
                    </span>
                    <span className="font-label-sm text-label-sm text-error font-semibold px-2 py-0.5 rounded bg-error/10">
                      1.17%
                    </span>
                  </div>
                </div>
                <div>
                  <div
                    className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden mb-2 relative group/bar cursor-pointer"
                    title="7 Errors (1.17%)"
                  >
                    <div
                      className="h-full bg-error rounded-full w-0 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,180,171,0.6)] group-hover/bar:brightness-125"
                      id="bar-error-fill"
                    ></div>
                  </div>
                  <div className="flex items-center justify-between font-caption text-caption">
                    <a
                      className="text-error hover:text-on-error-container hover:underline flex items-center gap-1 font-semibold transition-colors group/link"
                      href="#"
                    >
                      <span>Inspect 7 failed traces</span>
                      <span className="material-symbols-outlined text-[13px] group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform">
                        north_east
                      </span>
                    </a>
                    <span className="text-outline font-mono">
                      HTTP 429 / 500
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- SECTION 3: LATENCY PERFORMANCE & PERCENTILES (Entry 4) --> */}
          <div className="anim-entry-4 gap-space-md mb-space-lg w-full">
            <div className="interactive-card rounded-xl bg-surface-container-low p-space-lg shadow-md w-full">
              {/* <!-- Card Header --> */}
              <div className="flex items-center justify-between mb-space-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[24px]">
                    timer
                  </span>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold tracking-tight">
                    Latency Performance &amp; Percentiles
                  </h3>
                </div>
                <span className="text-caption text-outline font-mono">
                  Aggregation: Mean Window
                </span>
              </div>
              {/* <!-- Percentiles 3-Column Grid --> */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-lg mb-space-lg">
                {/* <!-- P50 Latency --> */}
                <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-md text-label-md font-semibold text-primary">
                        P50 Latency
                      </span>
                      <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                        Median
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-1.5">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                        882
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-normal">
                        ms
                      </span>
                    </div>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-2">
                    Median response time across 600 queries.
                  </p>
                </div>
                {/* <!-- P95 Latency --> */}
                <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-md text-label-md font-semibold text-primary">
                        P95 Latency
                      </span>
                      <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                        Tail 5%
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-1.5">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                        1,446
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-normal">
                        ms
                      </span>
                    </div>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-2">
                    95% of user interactions finish within this budget.
                  </p>
                </div>
                {/* <!-- P99 Latency --> */}
                <div className="flex flex-col justify-between p-3 rounded-lg hover:bg-surface-container/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-md text-label-md font-semibold text-tertiary">
                        P99 Latency
                      </span>
                      <span className="font-caption text-caption text-outline px-1.5 py-0.5 rounded bg-surface-container">
                        Outliers
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 my-1.5">
                      <span className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                        1,499
                      </span>
                      <span className="font-label-sm text-label-sm text-outline font-normal">
                        ms
                      </span>
                    </div>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant mt-2">
                    99% of traces finish within 1.5s max cap.
                  </p>
                </div>
              </div>
              {/* <!-- Interactive Latency Distribution Bands Section --> */}
              <div className="pt-space-md border-t border-surface-container-high/40">
                <div className="flex justify-between items-center text-caption font-caption text-outline mb-2">
                  <span className="font-medium text-on-surface">
                    Latency Distribution Bands
                  </span>
                  <span
                    className="transition-all duration-200"
                    id="band-description"
                  >
                    &lt;1000ms:{" "}
                    <strong className="text-emerald-400">78%</strong> |
                    1000-1400ms: <strong className="text-secondary">17%</strong>{" "}
                    | &gt;1400ms: <strong className="text-error">5%</strong>
                  </span>
                </div>
                <div className="w-full h-3 rounded-full flex overflow-hidden gap-1 bg-surface-container-highest p-0.5">
                  <div
                    className="h-full bg-emerald-400 rounded-l-full w-[78%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(52,211,153,0.4)]"
                    id="band-fast"
                    title="Fast (&lt;1000ms): 78% (468 traces)"
                  ></div>
                  <div
                    className="h-full bg-secondary w-[17%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(208,188,255,0.4)]"
                    id="band-medium"
                    title="Medium (1000-1400ms): 17% (102 traces)"
                  ></div>
                  <div
                    className="h-full bg-error rounded-r-full w-[5%] transition-all duration-300 hover:brightness-125 cursor-pointer shadow-[0_0_8px_rgba(255,180,171,0.4)]"
                    id="band-slow"
                    title="Slow (&gt;1400ms): 5% (30 traces)"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- SECTION 4: TRACE VOLUME INTERACTIVE CHART (Entry 5) --> */}
          <div className="anim-entry-5 interactive-card rounded-xl bg-surface-container-low p-space-lg shadow-xl relative">
            {/* <!-- Chart Header & Granularity Filters --> */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Trace Volume
                  </h3>
                  <span className="relative flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-caption text-caption font-semibold border border-primary/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    Real-time
                  </span>
                </div>
                <p className="font-body-md text-body-md text-outline mt-0.5">
                  Requests, successful traces, and errors over time
                </p>
              </div>
              {/* <!-- Chart Controls --> */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <div
                  className="inline-flex rounded-lg bg-surface-container p-0.5 border border-surface-container-high/60"
                  id="chart-res-filter"
                >
                  <button className="res-btn px-2.5 py-1 text-label-sm font-label-sm rounded-md text-outline hover:text-on-surface transition-colors">
                    1m
                  </button>
                  <button className="res-btn px-2.5 py-1 text-label-sm font-label-sm rounded-md bg-surface-container-high text-on-surface font-medium shadow-xs transition-colors">
                    5m
                  </button>
                  <button className="res-btn px-2.5 py-1 text-label-sm font-label-sm rounded-md text-outline hover:text-on-surface transition-colors">
                    1h
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-all duration-200 active:scale-95 border border-surface-container-high/40"
                    id="chart-zoom-btn"
                    title="Zoom in"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      zoom_in
                    </span>
                  </button>
                  <button
                    className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-all duration-200 active:scale-95 border border-surface-container-high/40"
                    id="chart-reset-btn"
                    title="Reset View"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      restart_alt
                    </span>
                  </button>
                </div>
              </div>
            </div>
            {/* <!-- Main Interactive Timeline SVG Chart Container --> */}
            <div
              className="relative w-full h-80 select-none"
              id="chart-area-wrapper"
            >
              {/* <!-- SVG Canvas --> */}
              <svg
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
                viewBox="0 0 1000 280"
              >
                <defs>
                  {/* <!-- Gradient for Total Traces Line Fill --> */}
                  <linearGradient
                    id="totalTracesGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stop-color="#8083ff"
                      stop-opacity="0.32"
                    ></stop>
                    <stop
                      offset="80%"
                      stop-color="#8083ff"
                      stop-opacity="0.04"
                    ></stop>
                    <stop
                      offset="100%"
                      stop-color="#8083ff"
                      stop-opacity="0.0"
                    ></stop>
                  </linearGradient>
                  {/* <!-- Gradient for Successful Traces Glow Area --> */}
                  <linearGradient
                    id="successTracesGradient"
                    x1="0"
                    x2="0"
                    y1="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stop-color="#34d399"
                      stop-opacity="0.25"
                    ></stop>
                    <stop
                      offset="100%"
                      stop-color="#34d399"
                      stop-opacity="0.0"
                    ></stop>
                  </linearGradient>
                </defs>
                {/* <!-- Horizontal Grid Lines & Y-Axis Labels --> */}
                {/* <!-- 600 Level (y=30) --> */}
                <line
                  stroke="#31353f"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                  x1="40"
                  x2="980"
                  y1="30"
                  y2="30"
                ></line>
                <text
                  fill="#908fa0"
                  font-family="Plus Jakarta Sans"
                  font-size="11"
                  text-anchor="end"
                  x="32"
                  y="34"
                >
                  600
                </text>
                {/* <!-- 450 Level (y=85) --> */}
                <line
                  stroke="#31353f"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                  x1="40"
                  x2="980"
                  y1="85"
                  y2="85"
                ></line>
                <text
                  fill="#908fa0"
                  font-family="Plus Jakarta Sans"
                  font-size="11"
                  text-anchor="end"
                  x="32"
                  y="89"
                >
                  450
                </text>
                {/* <!-- 300 Level (y=140) --> */}
                <line
                  stroke="#31353f"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                  x1="40"
                  x2="980"
                  y1="140"
                  y2="140"
                ></line>
                <text
                  fill="#908fa0"
                  font-family="Plus Jakarta Sans"
                  font-size="11"
                  text-anchor="end"
                  x="32"
                  y="144"
                >
                  300
                </text>
                {/* <!-- 150 Level (y=195) --> */}
                <line
                  stroke="#31353f"
                  stroke-dasharray="4 4"
                  stroke-width="1"
                  x1="40"
                  x2="980"
                  y1="195"
                  y2="195"
                ></line>
                <text
                  fill="#908fa0"
                  font-family="Plus Jakarta Sans"
                  font-size="11"
                  text-anchor="end"
                  x="32"
                  y="199"
                >
                  150
                </text>
                {/* <!-- 0 Baseline (y=250) --> */}
                <line
                  stroke="#464554"
                  stroke-width="1.2"
                  x1="40"
                  x2="980"
                  y1="250"
                  y2="250"
                ></line>
                <text
                  fill="#908fa0"
                  font-family="Plus Jakarta Sans"
                  font-size="11"
                  text-anchor="end"
                  x="32"
                  y="254"
                >
                  0
                </text>
                {/* <!-- Vertical Timestamp Guides --> */}
                <line
                  stroke="#262a34"
                  stroke-dasharray="2 4"
                  stroke-width="0.8"
                  x1="160"
                  x2="160"
                  y1="30"
                  y2="250"
                ></line>
                <line
                  stroke="#262a34"
                  stroke-dasharray="2 4"
                  stroke-width="0.8"
                  x1="340"
                  x2="340"
                  y1="30"
                  y2="250"
                ></line>
                <line
                  opacity="0.65"
                  stroke="#6366f1"
                  stroke-dasharray="2 2"
                  stroke-width="1.2"
                  x1="510"
                  x2="510"
                  y1="30"
                  y2="250"
                ></line>
                <line
                  stroke="#262a34"
                  stroke-dasharray="2 4"
                  stroke-width="0.8"
                  x1="690"
                  x2="690"
                  y1="30"
                  y2="250"
                ></line>
                <line
                  stroke="#262a34"
                  stroke-dasharray="2 4"
                  stroke-width="0.8"
                  x1="860"
                  x2="860"
                  y1="30"
                  y2="250"
                ></line>
                {/* <!-- Dynamic Interactive Cursor Line (tracked via mouse) --> */}
                <line
                  className="transition-opacity duration-200"
                  id="interactive-cursor-line"
                  opacity="0.3"
                  stroke="#8083ff"
                  stroke-dasharray="3 3"
                  stroke-width="1"
                  x1="510"
                  x2="510"
                  y1="30"
                  y2="250"
                ></line>
                {/* <!-- Area Paths --> */}
                <path
                  className="transition-opacity duration-300"
                  d="M 40 250 L 160 248 L 280 249 L 450 247 L 510 30 L 570 248 L 720 249 L 850 249 L 980 250 Z"
                  fill="url(#totalTracesGradient)"
                  id="path-total-area"
                ></path>
                <path
                  className="transition-opacity duration-300"
                  d="M 40 250 L 160 248 L 280 249 L 450 247 L 510 32.5 L 570 248 L 720 249 L 850 249 L 980 250 Z"
                  fill="url(#successTracesGradient)"
                  id="path-success-area"
                ></path>
                {/* <!-- Line Strokes with initial animated path drawing --> */}
                <path
                  className="svg-animate-stroke transition-opacity duration-300"
                  d="M 40 250 L 160 248 L 280 249 L 450 247 L 510 30 L 570 248 L 720 249 L 850 249 L 980 250"
                  fill="none"
                  id="path-total-line"
                  stroke="#8083ff"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                ></path>
                <path
                  className="svg-animate-stroke transition-opacity duration-300"
                  d="M 40 250 L 160 248 L 280 249 L 450 247 L 510 32.5 L 570 248 L 720 249 L 850 249 L 980 250"
                  fill="none"
                  id="path-success-line"
                  stroke="#34d399"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                ></path>
                <path
                  className="svg-animate-stroke transition-opacity duration-300"
                  d="M 40 250 L 160 250 L 280 250 L 450 250 L 510 247.4 L 570 250 L 720 250 L 850 250 L 980 250"
                  fill="none"
                  id="path-error-line"
                  stroke="#ffb4ab"
                  stroke-linecap="round"
                  stroke-width="2"
                ></path>
                {/* <!-- Peak Nodes at 15 Oct, 05:30 am (x=510) --> */}
                {/* <!-- Total Traces Peak Dot --> */}
                <g
                  className="cursor-pointer transition-transform duration-200"
                  id="peak-node-total"
                >
                  <circle
                    className="opacity-50 animate-ping"
                    cx="510"
                    cy="30"
                    fill="none"
                    r="10"
                    stroke="#8083ff"
                    stroke-width="1.5"
                  ></circle>
                  <circle
                    className="hover:r-7 transition-all"
                    cx="510"
                    cy="30"
                    fill="#8083ff"
                    r="5"
                    stroke="#0f131c"
                    stroke-width="2"
                  ></circle>
                </g>
                {/* <!-- Successful Traces Peak Dot --> */}
                <circle
                  cx="510"
                  cy="32.5"
                  fill="#34d399"
                  r="3.5"
                  stroke="#0f131c"
                  stroke-width="1.5"
                ></circle>
                {/* <!-- Error Traces Peak Dot (7 Errors at bottom) --> */}
                <g className="cursor-pointer" id="peak-node-error">
                  <circle
                    className="animate-pulse opacity-75"
                    cx="510"
                    cy="247.4"
                    fill="none"
                    r="8"
                    stroke="#ffb4ab"
                    stroke-width="1.5"
                  ></circle>
                  <circle
                    cx="510"
                    cy="247.4"
                    fill="#ffb4ab"
                    r="4.5"
                    stroke="#690005"
                    stroke-width="1.5"
                  ></circle>
                </g>
              </svg>
              {/* <!-- Interactive Pop-up Floating Tooltip on the Spike --> */}
              <div
                className="absolute left-[51%] top-4 -translate-x-1/2 rounded-xl bg-surface-container-high/95 backdrop-blur-xl shadow-2xl p-3 z-30 pointer-events-none w-56 border border-outline-variant/40 transition-all duration-200 scale-100 opacity-100"
                id="chart-tooltip"
              >
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-surface-container-highest">
                  <span className="font-caption text-caption text-outline font-medium">
                    15 Oct, 05:30 am
                  </span>
                  <span className="text-caption px-1.5 py-0.5 rounded bg-surface-container text-primary font-mono border border-primary/20">
                    Run #8492
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(128,131,255,0.7)]"></span>{" "}
                      Total Traces
                    </span>
                    <span className="font-bold text-on-surface">600</span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]"></span>{" "}
                      Successful
                    </span>
                    <span className="font-bold text-emerald-400">593</span>
                  </div>
                  <div className="flex items-center justify-between font-label-sm text-label-sm">
                    <span className="flex items-center gap-1.5 text-on-surface-variant">
                      <span className="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_6px_rgba(255,180,171,0.7)]"></span>{" "}
                      Errors
                    </span>
                    <span className="font-bold text-error">7</span>
                  </div>
                </div>
              </div>
              {/* <!-- Time Axis Labels Below Chart Baseline --> */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-10 font-caption text-caption text-outline select-none pointer-events-none">
                <span>14 Oct 06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span className="text-primary font-semibold drop-shadow-[0_0_8px_rgba(192,193,255,0.5)]">
                  15 Oct, 05:30 am
                </span>
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00 pm</span>
              </div>
            </div>
            {/* <!-- Chart Footer Legend with Interactive Filter Toggles --> */}
            <div className="flex flex-wrap items-center justify-center gap-space-lg mt-space-lg pt-space-md border-t border-surface-container-high/60">
              {/* <!-- Errors Toggle --> */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/20 transition-all duration-200 group active:scale-95"
                id="toggle-errors"
                title="Toggle error series visibility"
              >
                <span className="w-3 h-1.5 rounded-full bg-error shadow-[0_0_8px_rgba(255,180,171,0.7)]"></span>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-error transition-colors">
                  Errors
                </span>
                <span className="text-caption px-1.5 py-0.5 rounded bg-surface-container-highest text-error font-mono">
                  7
                </span>
              </button>
              {/* <!-- Successful Toggle --> */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/20 transition-all duration-200 group active:scale-95"
                id="toggle-success"
                title="Toggle successful series visibility"
              >
                <span className="w-3 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]"></span>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-emerald-300 transition-colors">
                  Successful
                </span>
                <span className="text-caption px-1.5 py-0.5 rounded bg-surface-container-highest text-emerald-400 font-mono">
                  593
                </span>
              </button>
              {/* <!-- Total Traces Toggle --> */}
              <button
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container/70 hover:bg-surface-container-high border border-outline-variant/20 transition-all duration-200 group active:scale-95"
                id="toggle-total"
                title="Toggle total series visibility"
              >
                <span className="w-3 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_rgba(128,131,255,0.7)]"></span>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
                  Total Traces
                </span>
                <span className="text-caption px-1.5 py-0.5 rounded bg-surface-container-highest text-primary font-mono">
                  600
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
    // <main className="space-y-8 p-6">
    //   <div>
    //     <h1 className="text-2xl font-bold">Dashboard</h1>
    //     <p className="mt-1 text-sm text-gray-500">
    //       Monitor your LLM application's performance and usage.
    //     </p>
    //   </div>

    //   <OverviewCards analyticsOverview={overview} />

    //   <section className="space-y-4">
    //     <div className="flex flex-wrap items-center justify-between gap-3">
    //       <h2 className="text-lg font-semibold">Trace Activity</h2>
    //       <VolumeRangeSelector selectedRange={range} />
    //     </div>

    //     <TraceVolumeChart analyticsVolume={analyticsVolume} />
    //   </section>
    // </main>
  );
};

export default DashboardPage;
