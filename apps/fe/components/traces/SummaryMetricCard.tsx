import { TraceResponse } from "@/app/(signed)/dashboard/types";

const SummaryMetricCard = ({ result }: { result: TraceResponse }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-space-lg">
      {/* <!-- Card 1: Matching traces --> */}
      <div className="anim-card-1 p-space-lg rounded-xl bg-surface-container-lowest border border-[#1e2436] hover:border-indigo-500/40 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(99,102,241,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-space-sm relative z-10">
          <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-slate-300 transition-colors">
            Matching traces
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary group-hover:scale-110 transition-all duration-300">
            <span className="material-symbols-outlined text-lg">layers</span>
          </div>
        </div>
        <div className="relative z-10">
          <div
            className="font-headline-lg text-headline-lg text-on-surface tracking-tight group-hover:text-indigo-100 transition-colors"
            id="metric-total-traces"
          >
            {result.totalCount.toLocaleString()}
          </div>
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant mt-1">
            {/* <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <span className="material-symbols-outlined text-xs">
                trending_up
              </span>{" "}
              +14.2%
            </span> */}
            <span>Based on current filters</span>
          </div>
        </div>
      </div>
      {/* <!-- Card 2: Results on this page --> */}
      <div className="anim-card-2 p-space-lg rounded-xl bg-surface-container-lowest border border-[#1e2436] hover:border-secondary/40 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(139,92,246,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-28 h-28 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-space-sm relative z-10">
          <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-slate-300 transition-colors">
            Results on this page
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary group-hover:scale-110 transition-all duration-300">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <div
            className="font-headline-lg text-headline-lg text-on-surface tracking-tight group-hover:text-purple-100 transition-colors"
            id="metric-page-results"
          >
            {result.data.length}
          </div>
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant mt-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
            <span>
              Out of{" "}
              <span className="font-medium text-slate-300" id="metric-out-of">
                {result.totalCount.toLocaleString()}
              </span>{" "}
              matching traces
            </span>
          </div>
        </div>
      </div>
      {/* <!-- Card 3: Current page & execution rate --> */}
      <div className="anim-card-3 p-space-lg rounded-xl bg-surface-container-lowest border border-[#1e2436] hover:border-cyan-500/40 shadow-sm flex flex-col justify-between group hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(6,182,212,0.12)] transition-all duration-300 cursor-pointer relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
        <div className="flex items-center justify-between mb-space-sm relative z-10">
          <span className="font-label-sm text-label-sm text-on-surface-variant group-hover:text-slate-300 transition-colors">
            Current page
          </span>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-tertiary group-hover:bg-tertiary group-hover:text-on-tertiary group-hover:scale-110 transition-all duration-300">
            <span className="material-symbols-outlined text-lg">
              data_usage
            </span>
          </div>
        </div>
        <div className="relative z-10">
          <div className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
            {result.page}{" "}
            <span className="text-on-surface-variant font-title-md text-title-md font-normal">
              / {Math.max(1, result.totalPages)}
            </span>
          </div>
          <div className="flex items-center gap-space-xs font-caption text-caption text-on-surface-variant mt-1">
            <span className="font-medium text-on-surface">
              {result.limit} traces
            </span>
            <span>per page index</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryMetricCard;
