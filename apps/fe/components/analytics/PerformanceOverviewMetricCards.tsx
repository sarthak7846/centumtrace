import { PerformanceMetrics } from "@/app/(signed)/dashboard/types";

const PerformanceOverviewMetricCards = ({
  performanceMetrics,
}: {
  performanceMetrics: PerformanceMetrics;
}) => {
  const { errorRate, p95LatencyMs, totalCost, totalTokens } =
    performanceMetrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
      {/* <!-- Metric 1: P95 Latency --> */}
      <div
        className="kpi-card-reveal flex flex-col p-space-md rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-md hover:shadow-[0_0_24px_rgba(99,102,241,0.2)] hover:border-indigo-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group gap-space-sm cursor-pointer"
        style={{ animationDelay: "50ms" }}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            P95 latency
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/25 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">schedule</span>
          </div>
        </div>
        <div className="flex items-baseline gap-space-xs">
          <span
            className="counter-val font-headline-lg text-headline-lg text-[#f8fafc] font-bold tracking-tight"
            data-target="1442"
            data-type="int"
          >
            {p95LatencyMs}
          </span>
          <span className="font-label-md text-label-md text-slate-400 font-medium">
            ms
          </span>
        </div>
      </div>
      {/* <!-- Metric 2: Error Rate --> */}
      <div
        className="kpi-card-reveal flex flex-col p-space-md rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-md hover:shadow-[0_0_24px_rgba(239,68,68,0.2)] hover:border-red-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group gap-space-sm cursor-pointer"
        style={{ animationDelay: "120ms" }}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            Error rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 group-hover:bg-red-500/25 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">warning</span>
          </div>
        </div>
        <div className="flex items-baseline gap-space-xs">
          <span
            className="counter-val font-headline-lg text-headline-lg text-[#f8fafc] font-bold tracking-tight"
            data-target="3.00"
            data-type="percent"
          >
            {errorRate.toFixed(2)}%
          </span>
        </div>
      </div>
      {/* <!-- Metric 3: Total Cost --> */}
      <div
        className="kpi-card-reveal flex flex-col p-space-md rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-md hover:shadow-[0_0_24px_rgba(6,182,212,0.2)] hover:border-cyan-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group gap-space-sm cursor-pointer"
        style={{ animationDelay: "190ms" }}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            Total cost
          </span>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/25 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">
              attach_money
            </span>
          </div>
        </div>
        <div className="flex items-baseline gap-space-xs">
          <span
            className="counter-val font-headline-lg text-headline-lg text-[#f8fafc] font-bold tracking-tight"
            data-target="0.1257"
            data-type="currency"
          >
            ${totalCost.toFixed(4)}
          </span>
        </div>
      </div>
      {/* <!-- Metric 4: Total Tokens --> */}
      <div
        className="kpi-card-reveal flex flex-col p-space-md rounded-xl bg-[#0f1424] border border-[#1e263d] shadow-md hover:shadow-[0_0_24px_rgba(168,85,247,0.2)] hover:border-purple-500/60 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group gap-space-sm cursor-pointer"
        style={{ animationDelay: "260ms" }}
      >
        <div className="flex items-start justify-between">
          <span className="font-label-sm text-label-sm text-slate-400 group-hover:text-slate-300 transition-colors">
            Total tokens
          </span>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/25 group-hover:scale-110  transition-all duration-300 flex items-center justify-center">
            <span className="material-symbols-outlined text-lg">token</span>
          </div>
        </div>
        <div className="flex items-baseline gap-space-xs">
          <span
            className="counter-val font-headline-lg text-headline-lg text-[#f8fafc] font-bold tracking-tight"
            data-target="9016"
            data-type="int"
          >
            {totalTokens}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceOverviewMetricCards;
